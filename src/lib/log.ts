import { PUBLIC_LOGTAIL_HOST, PUBLIC_LOGTAIL_TOKEN } from '$env/static/public';
import type { ExecutionContext } from '@cloudflare/workers-types';
import { Logtail } from "@logtail/edge";

export enum UserImpacts  {
  NO_VIDEOS = "No videos displayed",
  PERFORMANCE = "Performance"
}

interface LogAttributes {
  // biome-ignore lint/suspicious/noExplicitAny: Should be able to pass anything
  [key: string]: any;
  userImpact?: UserImpacts;
}

export class Logger {
  private logtail: Logtail;
  private ctx: ExecutionContext | undefined

  constructor(ctx?: ExecutionContext){
    this.logtail = new  Logtail(PUBLIC_LOGTAIL_TOKEN, {
      endpoint: PUBLIC_LOGTAIL_HOST,
    })

    if (ctx){
      this.ctx = ctx;
    }
  }

  info(
			message: string | Error,
			attributes?: LogAttributes
		){
		if (this.ctx){
		  this.logtail.withExecutionContext(this.ctx).info(message, attributes);
		}
		if (attributes){
		  console.info(message, attributes)
		} else {
		  console.info(message)
		}
	}

  error(
			message: string | Error,
			attributes?: LogAttributes
		){
      if (this.ctx){
        this.logtail.withExecutionContext(this.ctx).error(message, attributes);
      }

  		if (attributes){
  		  console.error(message, attributes)
  		} else {
    		console.error(message)
  		}
		}

	warn(
	message: string | Error,
	attributes?: LogAttributes
  ) {
    if (this.ctx) {
      this.logtail.withExecutionContext(this.ctx).warn(message, attributes);
    }

    if (attributes){
		  console.warn(message, attributes)
		} else {
		  console.warn(message)
		}
	}
}
