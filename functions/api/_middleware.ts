// functions/api/_middleware.ts

export async function onRequest(context, env) {
    const url = new URL(context.request.url)
    const backendUrl = `${env.VITE_API_BASE_URL}${url.pathname}${url.search}`
  
    const newRequest = new Request(backendUrl, {
      method: context.request.method,
      headers: context.request.headers,
      body: context.request.body,
      redirect: 'manual',
    })
  
    return fetch(newRequest)
  }
  