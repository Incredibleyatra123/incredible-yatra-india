import { supabaseAdmin } from "../../lib/supabaseClient";

export default async function handler(req,res){
  if(req.method === 'GET'){
    const { data, error } = await supabaseAdmin.from('packages').select('*').order('created_at',{ascending:false});
    if(error) return res.status(500).json({error: error.message});
    return res.json(data);
  }

  if(req.method === 'POST'){
    const adminKey = req.headers['x-admin-key'];
    if(adminKey !== process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(401).json({error:'unauthorized'});

    const payload = req.body;
    const { data, error } = await supabaseAdmin.from('packages').insert([payload]).select();
    if(error) return res.status(500).json({error: error.message});
    return res.json({success:true, package: data[0]});
  }

  res.setHeader('Allow',['GET','POST']);
  res.status(405).end('Method Not Allowed');
}
