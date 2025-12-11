import { useEffect, useState } from 'react';

export default function Dashboard(){
  const [bookings,setBookings]=useState([]);
  const [packages,setPackages]=useState([]);

  useEffect(()=>{ fetchBookings(); fetchPackages(); },[]);

  async function fetchBookings(){
    const res = await fetch('/api/admin/bookings');
    const data = await res.json(); setBookings(data || []);
  }
  async function fetchPackages(){
    const res = await fetch('/api/packages');
    const data = await res.json(); setPackages(data || []);
  }

  return (
    <div className='container' style={{padding:24}}>
      <h2>Admin Dashboard</h2>
      <section style={{marginTop:18}}>
        <h3>Recent Bookings</h3>
        <div>
          {bookings.map(b => (
            <div key={b.id} className='card' style={{marginBottom:12}}>
              <strong>{b.id}</strong> — {b.booking_status} — {b.payment_status} — ₹{b.total_amount}
            </div>
          ))}
        </div>
      </section>

      <section style={{marginTop:18}}>
        <h3>Packages</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
          {packages.map(p=> (
            <div className='card' key={p.id}>
              <h4>{p.title}</h4>
              <p>{p.short_desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
