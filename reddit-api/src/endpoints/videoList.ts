import { OpenAPIRoute } from "chanfana";

import { type AppContext, Videos } from "../types";

export class VideoList extends OpenAPIRoute {
  schema = {
    tags: ["Videos"],
    summary: "Get Videos",
    responses: {
      "200": {
        description: "Returns a list of recently uploaded videos",
        content: {
          "application/json": {
            schema: Videos.array(),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const result = await c.env.DB.prepare(
      "SELECT * FROM videos order by videos.uploaded_at DESC",
    ).all<{
      id: number;
      video_id: string;
      video_title: string;
      thumbnail_url: string;
      channel_id: string;
      channel_name: string;
      uploaded_at: string;
      created_at: string;
    }>();

    const response = result.results.map((video) => {
      return {
        videoId: video.video_id,
        videoTitle: video.video_title,
        thumbnailUrl: video.thumbnail_url,
        channelId: video.channel_id,
        channelName: video.channel_name,
        uploadedAt: new Date(video.uploaded_at).toISOString(),
      };
    });

    return response;
  }
}
