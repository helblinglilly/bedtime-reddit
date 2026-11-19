import type { Context } from "hono";
import { z } from "zod";

export type AppContext = Context<{ Bindings: Env }>;

export const Videos = z.object({
  videoId: z
    .string()
    .openapi({ example: "jNQXAC9IVRw", description: "Youtube Video ID that's part of the URL" }),
  videoTitle: z.string().openapi({
    example: "A day at the Zoo",
  }),
  thumbnailUrl: z.string(),
  channelId: z.string().openapi({
    example: "UC4QobU6STFB0P71PMvOGN5A",
    description: "Youtube ID for the uploader's channel. May be required to form a valid URL",
  }),
  channelName: z.string().openapi({
    example: "jawed",
    description: "Human readable name",
  }),
  uploadedAt: z.iso.datetime(),
});
