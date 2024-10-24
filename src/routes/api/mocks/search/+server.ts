const staticResponse = {
        "kind": "youtube#searchListResponse",
        "etag": "ok5Zjx8I7cS5SakyoPZyxMi5Pwk",
        "nextPageToken": "CAMQAA",
        "regionCode": "GB",
        "pageInfo": {
          "totalResults": 125086,
          "resultsPerPage": 3
        },
        "items": [
          {
            "kind": "youtube#searchResult",
            "etag": "_bmlyq05rfv440jzQgt6PcH-LEY",
            "id": {
              "kind": "youtube#video",
              "videoId": "UZNI5k7aNQk"
            },
            "snippet": {
              "publishedAt": "2024-10-24T19:00:24Z",
              "channelId": "UCegtkvhLG9XYzWfRR99ateQ",
              "title": "What&#39;s the Most Depressing Meal You Ever Ate?",
              "description": "Fresh AskReddit Stories: What's the Most Depressing Meal You Ever Ate? --- LIKE AND I WILL UPLOAD MORE REDDIT ...",
              "thumbnails": {
                "default": {
                  "url": "https://i.ytimg.com/vi/UZNI5k7aNQk/default.jpg",
                  "width": 120,
                  "height": 90
                },
                "medium": {
                  "url": "https://i.ytimg.com/vi/UZNI5k7aNQk/mqdefault.jpg",
                  "width": 320,
                  "height": 180
                },
                "high": {
                  "url": "https://i.ytimg.com/vi/UZNI5k7aNQk/hqdefault.jpg",
                  "width": 480,
                  "height": 360
                }
              },
              "channelTitle": "UE Stories",
              "liveBroadcastContent": "none",
              "publishTime": "2024-10-24T19:00:24Z"
            }
          },
          {
            "kind": "youtube#searchResult",
            "etag": "Qc9z_PKWBj5zNmjOMRzoj11tYTI",
            "id": {
              "kind": "youtube#video",
              "videoId": "Mw-QAzRsFEU"
            },
            "snippet": {
              "publishedAt": "2024-10-23T19:00:12Z",
              "channelId": "UCegtkvhLG9XYzWfRR99ateQ",
              "title": "What Was the Biggest Scandal At Your Workplace?",
              "description": "Fresh AskReddit Stories: What Was the Biggest Scandal At Your Workplace? --- LIKE AND I WILL UPLOAD MORE REDDIT ...",
              "thumbnails": {
                "default": {
                  "url": "https://i.ytimg.com/vi/Mw-QAzRsFEU/default.jpg",
                  "width": 120,
                  "height": 90
                },
                "medium": {
                  "url": "https://i.ytimg.com/vi/Mw-QAzRsFEU/mqdefault.jpg",
                  "width": 320,
                  "height": 180
                },
                "high": {
                  "url": "https://i.ytimg.com/vi/Mw-QAzRsFEU/hqdefault.jpg",
                  "width": 480,
                  "height": 360
                }
              },
              "channelTitle": "UE Stories",
              "liveBroadcastContent": "none",
              "publishTime": "2024-10-23T19:00:12Z"
            }
          },
          {
            "kind": "youtube#searchResult",
            "etag": "hLm7xXWBSJig8sq3C2X3nZQ_Qdg",
            "id": {
              "kind": "youtube#video",
              "videoId": "aXD7IgRhvKo"
            },
            "snippet": {
              "publishedAt": "2024-10-22T19:00:00Z",
              "channelId": "UCegtkvhLG9XYzWfRR99ateQ",
              "title": "What Was The Biggest Plot Twist Of Your Life?",
              "description": "Fresh AskReddit Stories: What Was The Biggest Plot Twist Of Your Life? --- LIKE AND I WILL UPLOAD MORE REDDIT STORIES!",
              "thumbnails": {
                "default": {
                  "url": "https://i.ytimg.com/vi/aXD7IgRhvKo/default.jpg",
                  "width": 120,
                  "height": 90
                },
                "medium": {
                  "url": "https://i.ytimg.com/vi/aXD7IgRhvKo/mqdefault.jpg",
                  "width": 320,
                  "height": 180
                },
                "high": {
                  "url": "https://i.ytimg.com/vi/aXD7IgRhvKo/hqdefault.jpg",
                  "width": 480,
                  "height": 360
                }
              },
              "channelTitle": "UE Stories",
              "liveBroadcastContent": "none",
              "publishTime": "2024-10-22T19:00:00Z"
            }
          }
        ]
      }
      

export const GET = () => {
    return new Response(JSON.stringify(staticResponse), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}