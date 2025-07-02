import { PUBLIC_ENVIRONMENT } from '$env/static/public';
import type { Edge } from "@logtail/edge/dist/es6/edge";
import type { EdgeWithExecutionContext } from '@logtail/edge/dist/es6/edgeWithExecutionContext';
import type { RequestEvent } from "@sveltejs/kit";
import { logtailLogger } from "./logtail";

export interface ILogger {
  info: (message: string, attributes?: Record<string, any>) => Promise<void>,
  error: (message: string, attributes?: Record<string, any>) => Promise<void>,
}

const Logger = (event?: RequestEvent<Partial<Record<string, string>>, string | null>): ILogger => {
  const context = event?.platform?.ctx;

  let logtail: EdgeWithExecutionContext | Edge = logtailLogger;

  if (context && typeof logtailLogger.withExecutionContext === 'function') {
    logtail = logtailLogger.withExecutionContext(context);
  }

  const baseAttributes: Record<string, any> = {};

  if (event) {
    baseAttributes.url = event.url.pathname;
    baseAttributes.method = event.request.method;
    baseAttributes.headers = Object.fromEntries(event.request.headers);
    baseAttributes.ip = event.getClientAddress?.();
  }

  return {
    info: async (message: string, attributes?: Record<string, any>) => {
      if (PUBLIC_ENVIRONMENT === 'local'){
        console.info(message, {
          ...baseAttributes,
          ...attributes
        })
        return;
      }

      logtail.info(message, {
        ...baseAttributes,
        ...attributes
      });

      if (logtail === logtailLogger) {
        await logtail.flush().catch((err) => {
          console.log(err);
        });
      }
    },
    error: async (message: string, attributes?: Record<string, any>) => {
      if (PUBLIC_ENVIRONMENT === 'local'){
        console.error(message, {
          ...baseAttributes,
          ...attributes
        })
        return;
      }

      logtail.error(message, {
        ...baseAttributes,
        ...attributes
      });

      if (logtail === logtailLogger) {
        await logtail.flush().catch((err) => {
          console.log(err);
        });
      }
    },
  }
}

export default Logger;
