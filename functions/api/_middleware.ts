// functions/api/_middleware.ts

export async function onRequest({ request, env }) {
  if (!env.VITE_API_BASE_URL) {
    return new Response('API base URL is not set', { status: 500 })
  }

  const url = new URL(request.url)
  const backendUrl = `${env.VITE_API_BASE_URL}${url.pathname}${url.search}`

  const newRequest = new Request(backendUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'manual',
  })

  return fetch(newRequest)
}
