/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Scheduled Worker: a Worker that can run on a
 * configurable interval:
 * https://developers.cloudflare.com/workers/platform/triggers/cron-triggers/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"` to see your Worker in action
 * - Run `npm run deploy` to publish your Worker
 *
 * Bind resources to your Worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { insertVideo } from '../lib/db/insertVideo';
import { getChannelVideos } from '../lib/youtubeApi/search/api';
import { channels } from './channels';

export default {
	async fetch(req) {
		const url = new URL(req.url);
		url.pathname = '/__scheduled';
		url.searchParams.append('cron', '* * * * *');
		return new Response(`To test the scheduled handler, ensure you have used the "--test-scheduled" then try running "curl ${url.href}".`);
	},

	// The scheduled handler is invoked at the interval set in our wrangler.jsonc's
	// [[triggers]] configuration.
	async scheduled(event, env, ctx): Promise<void> {
		console.debug(`Triggered at ${event.cron}`);
		const freshVideosPromises = await Promise.allSettled(
			channels.map((channel) => {
				return getChannelVideos(channel.id, env);
			}),
		);

		const freshVideos = freshVideosPromises
			.filter((promise) => promise.status === 'fulfilled')
			.map((promise) => promise.value)
			.flatMap((videos) => videos);
		const errors = freshVideosPromises.filter((promise) => promise.status === 'rejected').map((promise) => promise.reason);

		errors.forEach((error) => {
			console.error(error);
		});

		if (freshVideos.length === 0 && errors.length > 0) {
			throw new Error('All Youtube API Request have failed');
		}

		if (freshVideos.length > 0 && errors.length > 0) {
			console.warn('Some API requests have failed');
		}

		const dbInserts = await Promise.allSettled(
			freshVideos.map((video) => {
				return insertVideo(video, env.DB);
			}),
		);

		const success = dbInserts.filter((promise) => promise.status === 'fulfilled');
		const dbErrors = dbInserts.filter((promise) => promise.status === 'rejected');

		dbErrors.forEach((error) => {
			console.error(error);
		});

		console.info(`Added ${success.length} new videos to the DB`);
	},
} satisfies ExportedHandler<Env>;
