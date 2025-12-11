import { useState } from 'react';

export default function Login(){
  const [email,setEmail]=useState('');
  const [pass,setPass]=useState('');
  const [msg,setMsg]=useState('');

  async function handle(e){
    e.preventDefault();
    const res = await fetch('/api/admin/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,pass})});
    const data = await res.json();
    if(data.ok) window.location.href='/admin/dashboard';
    else setMsg(data.error||'Login failed');
  }

  return (
    <div style={{maxWidth:520,margin:'48px auto'}}>
      <h2>Admin Login</h2>
      <form onSubmit={handle} style={{display:'grid',gap:12}}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email' />
        <input value={pass} onChange={e=>setPass(e.target.value)} placeholder='Password' type='password' />
        <button className='btn' type='submit'>Login</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  )
}
