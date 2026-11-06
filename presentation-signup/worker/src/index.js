import { makeWorkbook } from './xlsx.js';

const dates = [['2026-11-20', 10], ['2026-11-27', 9]];
export const slots = dates.flatMap(([date, count]) =>
  Array.from({ length: count }, (_, i) => `${date}-${String(i + 1).padStart(2, '0')}`));
const slotSet = new Set(slots);
const allowedOrigins = new Set(['https://taherehfiroozi.com', 'https://tahereh-firoozi.github.io']);

function cors(origin) {
  return allowedOrigins.has(origin) ? {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin'
  } : {};
}
function json(value, status, origin) {
  return new Response(JSON.stringify(value), {
    status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...cors(origin) }
  });
}
function equalSecret(a, b) {
  if (!a || !b) return false;
  const one = new TextEncoder().encode(a), two = new TextEncoder().encode(b);
  let diff = one.length ^ two.length;
  for (let i = 0; i < Math.max(one.length, two.length); i++) diff |= (one[i] || 0) ^ (two[i] || 0);
  return diff === 0;
}
function normalizeName(name) {
  if (typeof name !== 'string') return null;
  const trimmed = name.normalize('NFKC').trim().replace(/\s+/gu, ' ');
  if (trimmed.length < 3 || trimmed.length > 90 || !/^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u.test(trimmed)) return null;
  return trimmed;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (origin && !allowedOrigins.has(origin)) return json({ error: 'Origin not allowed.' }, 403, origin);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    const path = new URL(request.url).pathname;
    if (!env.DB) return json({ error: 'Booking service is not configured.' }, 503, origin);

    if (path === '/slots' && request.method === 'GET') {
      const result = await env.DB.prepare('SELECT slot FROM bookings').all();
      const booked = new Set(result.results.map(row => row.slot));
      return json({ slots: slots.map(slot => ({ id: slot, date: slot.slice(0, 10), order: Number(slot.slice(-2)), available: !booked.has(slot) })) }, 200, origin);
    }
    if (path === '/book' && request.method === 'POST') {
      if (!(request.headers.get('Content-Type') || '').toLowerCase().startsWith('application/json')) return json({ error: 'Send JSON.' }, 415, origin);
      let payload;
      try {
        if (Number(request.headers.get('Content-Length')) > 4096) throw Error('Too large');
        payload = await request.json();
      } catch { return json({ error: 'Invalid request.' }, 400, origin); }
      const name = normalizeName(payload?.name), slot = payload?.slot;
      if (!name || !slotSet.has(slot)) return json({ error: 'Choose your name and a valid slot.' }, 400, origin);
      const key = name.toLocaleLowerCase('en-CA');
      try {
        await env.DB.prepare('INSERT INTO bookings (slot, student_name, name_key) VALUES (?, ?, ?)').bind(slot, name, key).run();
        return json({ booked: true, slot, name }, 201, origin);
      } catch (error) {
        // Only an actual uniqueness violation should be presented as a booking conflict.
        if (!/unique constraint/i.test(String(error))) return json({ error: 'Could not save your booking. Please try again.' }, 503, origin);
        const existing = await env.DB.prepare('SELECT slot FROM bookings WHERE name_key = ?').bind(key).first();
        return json({ error: existing ? 'This name already has a presentation slot. Contact the instructor to change it.' : 'That slot was just booked. Choose another available slot.' }, 409, origin);
      }
    }
    if (path === '/admin/export.xlsx' && request.method === 'GET') {
      const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') || '';
      if (!equalSecret(token, env.ADMIN_TOKEN)) return json({ error: 'Not authorized.' }, 401, origin);
      const result = await env.DB.prepare('SELECT student_name, slot, submitted_at FROM bookings ORDER BY slot').all();
      const bytes = makeWorkbook(result.results);
      return new Response(bytes, { status: 200, headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="EDPY501_presentation_schedule.xlsx"',
        'Cache-Control': 'no-store', ...cors(origin)
      } });
    }
    return json({ error: 'Not found.' }, 404, origin);
  }
};
