import { PUBLIC_ENVIRONMENT } from '$env/static/public';
import type { Edge } from "@logtail/edge/dist/es6/edge";
import type { EdgeWithExecutionContext } from '@logtail/edge/dist/es6/edgeWithExecutionContext';
import type { RequestEvent } from "@sveltejs/kit";
import { v4 as uuidv4 } from 'uuid';
import { logtailLogger } from "./logtail";
import { newrelicLogger } from './newrelic';

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

  const newrelic = newrelicLogger();

  const baseAttributes: Record<string, any> = {};

  if (event) {
    baseAttributes.url = {
      href: event.url.href,
      host: event.url.host,
      pathname: event.url.pathname,
    };
    baseAttributes.method = event.request.method;
    baseAttributes.headers = Object.fromEntries(event.request.headers);
    baseAttributes.ip = event.getClientAddress?.();
    baseAttributes.requestId = uuidv4()
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

      newrelic.sendToNrLogAPI('info', message, {
        ...baseAttributes,
        ...attributes
      })

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

      newrelic.sendToNrLogAPI('error', message, {
        ...baseAttributes,
        ...attributes
      })

      if (logtail === logtailLogger) {
        await logtail.flush().catch((err) => {
          console.log(err);
        });
      }
    },
  }
}

export default Logger;
