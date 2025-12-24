import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { data, error } = await supabaseAdmin
    .from('rounds')
    .select('category, result, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    return res.status(500).json({ error: 'Failed to load feed' });
  }

  const feed = data.map(r => ({
    type: r.result ? 'WIN' : 'FAIL',
    category: r.category,
    time: r.created_at,
  }));

  return res.status(200).json({ feed });
}
