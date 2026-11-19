import assert from "node:assert/strict";
import test from "node:test";
import app from "../src/index";
import { Videos } from "../src/types";

test("OpenAPI describes uploadedAt as a datetime string", async () => {
  const response = await app.request("http://localhost/openapi.json");
  assert.equal(response.status, 200);
  const schema = await response.json() as any;
  const uploadedAt = schema.paths["/videos"].get.responses["200"].content["application/json"].schema.items.properties.uploadedAt;
  assert.equal(uploadedAt.type, "string");
  assert.equal(uploadedAt.format, "date-time");
});

test("GET /videos returns JSON matching the declared response schema", async () => {
  const DB = {
    prepare: () => ({
      all: async () => ({
        results: [{
          video_id: "jNQXAC9IVRw",
          video_title: "A day at the Zoo",
          thumbnail_url: "https://example.com/thumbnail.jpg",
          channel_id: "channel-id",
          channel_name: "jawed",
          uploaded_at: "2026-11-18T12:34:56.000Z",
        }],
      }),
    }),
  };
  const response = await app.request("http://localhost/videos", {}, { DB } as unknown as Env);
  assert.equal(response.status, 200);
  const videos = Videos.array().parse(await response.json());
  assert.equal(videos.length, 1);
  assert.equal(videos[0]?.uploadedAt, "2026-11-18T12:34:56.000Z");
  assert.equal(videos[0]?.videoId, "jNQXAC9IVRw");
});
