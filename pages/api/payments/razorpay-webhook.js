import { verifyRazorpaySignature } from '../../../lib/razorpay';
import { supabaseAdmin } from '../../../lib/supabaseClient';

export const config = { api: { bodyParser: false } };

import getRawBody from 'raw-body';

export default async function handler(req,res){
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const raw = (await getRawBody(req)).toString();
  const signature = req.headers['x-razorpay-signature'];

  const valid = verifyRazorpaySignature(raw, signature, secret);
  if(!valid) return res.status(401).send('invalid signature');

  const payload = JSON.parse(raw);
  if(payload.event === 'payment.captured'){
    const payment = payload.payload.payment.entity;
    const bookingId = payment.receipt;
    await supabaseAdmin.from('transactions').insert([{ booking_id: bookingId, amount: payment.amount/100, gateway_response: payment }]);
    await supabaseAdmin.from('bookings').update({ payment_status: 'PAID', booking_status: 'CONFIRMED', payment_gateway_id: payment.id }).eq('id', bookingId);
  }

  res.json({ ok: true });
}
