import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../lib/supabaseClient";

export default function Home({ packages }) {
  return (
    <div>
      <Head>
        <title>Incredible Yatra India</title>
        <meta name="description" content="Incredible Yatra India - Pilgrimage & Tour Packages" />
      </Head>

      <header style={{background:'linear-gradient(90deg,#fb923c,#ef4444)',padding:30,color:'#fff',textAlign:'center'}}>
        <h1 style={{fontSize:34}}>Incredible Yatra India</h1>
        <p>9060079779 | incredibleyatraindia@gmail.com</p>
      </header>

      <main className="container" style={{paddingTop:24}}>
        <section style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:24,alignItems:'center'}}>
          <div>
            <h2 style={{fontSize:36}}>Discover India Like Never Before</h2>
            <p style={{fontSize:18,color:'#4b5563'}}>Spiritual journeys, pilgrimage packages and curated experiences across India.</p>
            <div style={{marginTop:16}}>
              <Link href="/packages"><a className="btn">View Packages</a></Link>
              <a href={"https://wa.me/919060079779"} style={{marginLeft:12}} className="btn">Chat on WhatsApp</a>
            </div>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&q=80" alt="hero" style={{borderRadius:12,width:'100%'}}/>
          </div>
        </section>

        <section style={{marginTop:40}}>
          <h3 style={{fontSize:28}}>Featured Packages</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18,marginTop:16}}>
            {packages.map((p)=> (
              <div key={p.id} className="card">
                <img src={(p.images && p.images[0]) || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&q=80'} alt={p.title} style={{width:'100%',height:160,objectFit:'cover',borderRadius:8}}/>
                <h4 style={{marginTop:12}}>{p.title}</h4>
                <p style={{color:'#6b7280'}}>{p.short_desc}</p>
                <div style={{marginTop:12}}>
                  <Link href={`/packages/${p.slug}`}><a className="btn">View</a></Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{marginTop:60,marginBottom:40}}>
          <h3 style={{fontSize:28}}>Contact</h3>
          <p>📞 9060079779</p>
          <p>📧 incredibleyatraindia@gmail.com</p>
          <p>📍 Madarawan, Marutinagar Colony, Lanka, Varanasi, Uttar Pradesh 221011</p>
        </section>
      </main>

      <footer style={{textAlign:'center',padding:24,background:'#111',color:'#fff'}}>
        © 2025 Incredible Yatra India
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const { data, error } = await supabase.from('packages').select('*').limit(6);
    if (error) throw error;
    const packages = data.length ? data : [
      { id: '1', slug: 'varanasi-darshan', title: 'Varanasi Darshan', short_desc: 'Kashi Vishwanath Temple, Ganga Aarti', images: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&q=80'] },
      { id: '2', slug: 'ayodhya-ram-mandir', title: 'Ayodhya Ram Mandir Tour', short_desc: 'Visit the newly built Ram Mandir', images: ['https://images.unsplash.com/photo-1600674475981-e53b0a1abec3?auto=format&q=80'] },
      { id: '3', slug: 'prayagraj-sangam', title: 'Prayagraj Sangam Snan', short_desc: 'Holy dip at Triveni Sangam', images: ['https://images.unsplash.com/photo-1571407978243-8f12d9f7da9b?auto=format&q=80'] },
    ];
    return { props: { packages }, revalidate: 60 };
  } catch (err) {
    return { props: { packages: [] } };
  }
}
