import { fetchCacheFirst } from '../../../platform/platformCache.js'
import { API_BASE, YOUTUBE_API_KEY } from '$env/static/private'

const channelIds = [
    'UCegtkvhLG9XYzWfRR99ateQ', // UE Stories
    'UCEqKKebvZbAQoD3NRIn4jaQ', // Updoot Studios
    'UC2sabBFKKPFcz8tg0lZwzvg', // OnTapStudios
]

export const GET = async ({ platform }) => {
    const queryParamsValues = channelIds.map((channelId) => {
        return {
            maxResults: '5',
            order: 'date',
            safeSearch: 'none',
            channelId,
            key: YOUTUBE_API_KEY,
            type: 'video',
            part: 'snippet'
        }
    });


    const promises = queryParamsValues.map((queryParamValue) => {
        const queryParams = new URLSearchParams(queryParamValue);
        return fetchCacheFirst(`${API_BASE}/search?${queryParams.toString()}`, platform)
    })

    const settledResolutions = await Promise.allSettled(promises);
    const rejectedResolutions = settledResolutions.filter((res) => res.status === 'rejected').map((a) => a.reason);

    if (rejectedResolutions.length > 0){
        console.log(rejectedResolutions.length, 'requests failed')
        return new Response(JSON.stringify({
            error: 'At least one request has failed'
        }), { 
            headers: {
                'Content-Type': 'application/json'
            },
            status: 500
        })
    }
    const resolutions = settledResolutions.filter((res) => res.status === 'fulfilled').map((a) => a.value)

    const happyResponses = resolutions.filter((a) => a.status === 200);
    const unhappyResponses = resolutions.filter((a) => a.status > 200);
    
    if (unhappyResponses.length > 0){
        console.log(unhappyResponses.map((a) => a.status).join(' - '));
    }
    
    // @ts-expect-error Prototyping - go away
    const flatItems = (await Promise.all(happyResponses.map((res) => res.json()))).map((a) => a.items).flat();

    const bodies = flatItems.map((a) => {
        return {
            link: `https://youtube.com/watch?v=${a.id.videoId}`,
            title: a.snippet.title,
            thumbnail: a.snippet.thumbnails.medium.url,
            channel: {
                name: a.snippet.channelTitle
            },
            uploaded: a.snippet.publishedAt
        }
    })

    return new Response(JSON.stringify(bodies), { 
        headers: {
            'Content-Type': 'application/json'
        }
    })


}