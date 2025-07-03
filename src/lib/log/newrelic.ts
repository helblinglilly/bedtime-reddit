import { NEWRELIC_LOG_INGEST_KEY } from "$env/static/private";

export function newrelicLogger(){


  return {
    sendToNrLogAPI: (level: 'info' | 'warn' | 'error', message: string, attributes: Record<string, any>) => {
      return new Promise(async (res, rej) => {
        const result = await fetch(`https://log-api.eu.newrelic.com/log/v1`, {
          method: 'POST',
          headers: {
            'Content-Type': "application/json",
            'Api-Key': NEWRELIC_LOG_INGEST_KEY
          },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            common: {
              attributes: {
                "service-name": "reddit.helbling.uk",
              }
            },
            message: {
              level,
              timestamp: new Date().toISOString(),
              message: message,
              ...attributes,
            }
          })
        });

        if (result.status >= 400){
          rej(`Non-200 status code ingesting to newrelic - ${result.status}`)
        }

        res('');
      })
    }
  }
}
