const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestOptions() {
  return new Response(null, { headers: cors });
}

export async function onRequestPost({ request, env }) {
  try {
    const { password } = await request.json();
    const adminPassword = await env.JOBS_STORE.get('admin_password') || 'Dongshan@2024';
    if (password !== adminPassword) {
      return new Response(JSON.stringify({ error: 'Wrong password' }), {
        status: 401, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }
    const token = crypto.randomUUID();
    await env.JOBS_STORE.put('admin_session', token, { expirationTtl: 86400 });
    return new Response(JSON.stringify({ token }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Bad request' }), {
      status: 400, headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
}
