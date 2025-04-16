import { PUBLIC_LOGTAIL_HOST, PUBLIC_LOGTAIL_TOKEN } from '$env/static/public';
import { Logtail } from "@logtail/edge";

export const baseLogger = new Logtail(PUBLIC_LOGTAIL_TOKEN, {
  endpoint: PUBLIC_LOGTAIL_HOST,
})
