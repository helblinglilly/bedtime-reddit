import type { Edge } from "@logtail/edge/dist/es6/edge";
import type { EdgeWithExecutionContext } from "@logtail/edge/dist/es6/edgeWithExecutionContext";
import type { RequestEvent } from "@sveltejs/kit";
import { logtailLogger } from "./logtail";

const Logger = (event?: RequestEvent<Partial<Record<string, string>>, string | null>) => {
  const context = event?.platform?.ctx;

  let logtail: EdgeWithExecutionContext | Edge = logtailLogger;

  if (context && typeof logtailLogger.withExecutionContext === 'function') {
    logtail =  logtailLogger.withExecutionContext(context);
  }

  const baseAttributes: Record<string, any> = {};

  if (event){
    baseAttributes.url = event.url.pathname;
    baseAttributes.method = event.request.method;
    baseAttributes.headers = Object.fromEntries(event.request.headers);
    baseAttributes.ip = event.getClientAddress?.();
  }

  return {
    info: (message: string, attributes?: Record<string, any>) => {
      logtail.info(message, {
        ...baseAttributes,
        ...attributes
      })
    }
  }

}

export default Logger;
