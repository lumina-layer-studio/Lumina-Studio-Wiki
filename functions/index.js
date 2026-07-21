import {selectLocale} from './locale.mjs';


export async function onRequestGet({request}) {
  const locale = selectLocale(request.headers.get('Accept-Language'));
  const location = new URL(`/${locale}/`, request.url);

  return new Response(null, {
    status: 302,
    headers: {
      'Cache-Control': 'private, no-store',
      Location: location.toString(),
      Vary: 'Accept-Language',
    },
  });
}
