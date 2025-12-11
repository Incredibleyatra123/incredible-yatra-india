import { supabaseAdmin } from "../../lib/supabaseClient";
import { razorpay } from "../../lib/razorpay";

export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const { pkgId, name, phone, date, pax } = req.body;
  try{
    const { data: pkg } = await supabaseAdmin.from('packages').select('*').eq('id',pkgId).single();
    if(!pkg) return res.status(400).json({error:'Package not found'});

    const total = Number(pkg.price) * Number(pax || 1);
    const { data: booking } = await supabaseAdmin.from('bookings').insert([{
      package_id: pkgId,
      booking_date: date,
      pax_count: pax,
      total_amount: total,
      booking_status: 'PENDING',
      payment_status: 'PENDING'
    }]).select().single();

    const order = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: 'INR',
      receipt: String(booking.id),
      payment_capture: 1,
    });

    await supabaseAdmin.from('bookings').update({ payment_gateway_id: order.id }).eq('id', booking.id);

    return res.json({ success: true, order, checkoutUrl: null, bookingId: booking.id, razorpayKey: process.env.RAZORPAY_KEY_ID });
  }catch(err){
    console.error(err);
    return res.status(500).json({error: String(err)});
  }
}
