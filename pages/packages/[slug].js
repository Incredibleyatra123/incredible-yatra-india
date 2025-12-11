import { supabase } from "../../lib/supabaseClient";
import { useState } from "react";

export default function PackagePage({ pkg }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [pax, setPax] = useState(1);
  const [message, setMessage] = useState('');

  async function handleBook(e){
    e.preventDefault();
    const res = await fetch('/api/bookings',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({pkgId:pkg.id,name,phone,date,pax})});
    const data = await res.json();
    if(data.success){
      setMessage('Booking created — proceed to payment.');
      window.location.href = data.checkoutUrl || '/';
    } else setMessage('Error: '+(data.error||'Unable to create booking'));
  }

  if(!pkg) return <div>Package not found</div>
  return (
    <div className="container" style={{padding:24}}>
      <h1>{pkg.title}</h1>
      <img src={(pkg.images && pkg.images[0]) || '/hero.jpg'} alt={pkg.title} style={{width:'100%',height:380,objectFit:'cover',borderRadius:12}}/>
      <p style={{marginTop:12}}>{pkg.long_desc || pkg.short_desc}</p>

      <div style={{maxWidth:600,marginTop:24}} className="card">
        <h3>Book this package</h3>
        <form onSubmit={handleBook} style={{display:'grid',gap:12}}>
          <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
          <input placeholder="Date (YYYY-MM-DD)" value={date} onChange={e=>setDate(e.target.value)} />
          <input type="number" min={1} value={pax} onChange={e=>setPax(e.target.value)} />
          <button className="btn" type="submit">Book & Pay</button>
        </form>
        {message && <p style={{marginTop:12}}>{message}</p>}
      </div>
    </div>
  )
}

export async function getServerSideProps(context){
  const { slug } = context.params;
  const { data } = await supabase.from('packages').select('*').eq('slug',slug).limit(1).single();
  return { props: { pkg: data || null } };
}
