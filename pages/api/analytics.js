import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, payload } = req.body;

  await supabaseAdmin.from('analytics_events').insert({
    event_name: name,
    payload,
  });

  res.status(200).json({ ok: true });
}
