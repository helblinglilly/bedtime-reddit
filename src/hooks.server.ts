import Logger from '$lib/log';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const logger = Logger(event);
  event.locals.logger = logger;


  const response = await resolve(event);

  await logger.info('ServerRequest', {
    success: response.ok
  })

  return response;
};
