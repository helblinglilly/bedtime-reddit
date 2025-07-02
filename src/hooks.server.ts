import Logger from '$lib/log';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const logger = Logger(event);

  logger.info('ServerRequest')

  return await resolve(event);
};
