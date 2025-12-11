import { supabaseAdmin } from '../../../lib/supabaseClient';

export default async function handler(req,res){
  const { data, error } = await supabaseAdmin.from('bookings').select('*').order('created_at',{ascending:false}).limit(100);
  if(error) return res.status(500).json({error: error.message});
  return res.json(data);
}
