export async function POST(req) {
  const { code } = await req.json();

  const ANI_API_URL = "https://anilist.co/api/v2/oauth/token";
  const CLIENT_ID = process.env.NEXT_PUBLIC_ANILIST_CLIENT_ID;
  const CLIENT_SECRET = process.env.NEXT_PUBLIC_ANILIST_CLIENT_SECRET;
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/callback`;

  if (!code) {
    return new Response(JSON.stringify({ error: "Missing code" }), { status: 400 });
  }

  try {
    const res = await fetch(ANI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data }), { status: res.status });
    }

    return new Response(JSON.stringify({ access_token: data.access_token }), {
      status: 200,
    });
  } catch (error) {
    console.error("Token fetch failed:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
