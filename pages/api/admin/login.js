import { supabaseAdmin } from '../../../lib/supabaseClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const { email, pass } = req.body;
  const { data } = await supabaseAdmin.from('users').select('*').eq('email',email).limit(1).single();
  if(!data) return res.json({ error: 'User not found' });
  const ok = await bcrypt.compare(pass, data.password_hash || '');
  if(!ok) return res.json({ error: 'Invalid credentials' });
  if(data.role !== 'admin') return res.json({ error: 'Not an admin' });

  const token = jwt.sign({ userId: data.id, role: data.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${60*60*24*7}`);
  return res.json({ ok: true });
}
