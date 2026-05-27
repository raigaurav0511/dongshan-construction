const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const DEFAULT_JOBS = [
  { id: '1', title: 'Senior Site Engineer — Interior', dept: 'Civil / Interior', type: 'Full-Time', location: 'Noida / Pune', salary: '₹8–14 LPA', active: true },
  { id: '2', title: 'Gypsum & Dry Wall Supervisor', dept: 'Interior', type: 'Full-Time', location: 'Pan India', salary: '₹5–8 LPA', active: true },
  { id: '3', title: 'MEP / Electrical Engineer', dept: 'MEP', type: 'Full-Time', location: 'Pune / Kolkata', salary: '₹8–15 LPA', active: true },
  { id: '4', title: 'HSE Officer — Site Safety', dept: 'Safety', type: 'Full-Time', location: 'All Locations', salary: '₹4–7 LPA', active: true },
  { id: '5', title: 'Interior Design Coordinator', dept: 'Design', type: 'Full-Time', location: 'Noida', salary: '₹4–8 LPA', active: true },
];

export async function onRequestOptions() {
  return new Response(null, { headers: cors });
}

export async function onRequestGet({ request, env }) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const storedToken = await env.JOBS_STORE.get('admin_session');
  if (!token || token !== storedToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
  const jobs = await env.JOBS_STORE.get('jobs', { type: 'json' });
  return new Response(JSON.stringify(jobs || DEFAULT_JOBS), {
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
