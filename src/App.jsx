import React, { useEffect, useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import logo from './assets/logo.jpg'

const pastel = {
  bg: '#e9f7ef',
  bgSoft: '#f3fbf6',
  primary: '#2e7d32',
  accent: '#81c784',
  card: '#d8f3dc',
  text: '#1b4332',
  border: '#b7e4c7',
}

const box = { borderRadius: '1.25rem', boxShadow: '0 6px 20px rgba(0,0,0,.08)', border: `1px solid ${pastel.border}` }
const containerStyle = { fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', color: pastel.text, background: pastel.bg, minHeight: '100vh', padding: '20px' }
const titleStyle = { fontFamily: "'Rubik Bubbles', system-ui, cursive", letterSpacing: 1, color: pastel.primary }

const getLS = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } }
const setLS = (k, v) => localStorage.setItem(k, JSON.stringify(v))

const EDU_VIDEOS = [
  { id: 1, title: 'Pentingnya 1000 HPK', url: 'https://youtu.be/NU_MDQ2iNYE?si=D67ihEiGa28FJKsq' },
  { id: 2, title: 'Gizi Seimbang Anak', url: 'https://youtu.be/C5GW-uLfzTA?si=Su-wk1k-HdQOed8E' },
  { id: 3, title: 'ASI & MPASI', url: 'https://youtu.be/AHzG3AHSFW4?si=LXAU1COiI7WbyZ1-' },
  { id: 4, title: 'Cegah Stunting', url: 'https://youtu.be/zqpinGFvivg?si=MVOmCnZY2G9pzKs3' },
  { id: 5, title: 'Sanitasi & PHBS', url: 'https://youtu.be/ZuHRHv-_KXw?si=NCP2diQ9DGlMoi7o' },
]

const QUIZ = [
  { q: 'Apa kepanjangan dari 1000 HPK?', a: ['1000 Hari Pertumbuhan Kritis', '1000 Hari Pertama Kehidupan', '1000 Hari Penting Keluarga'], answer: 1 },
  { q: 'MPASI dianjurkan mulai usia…', a: ['2 bulan', '4 bulan', '6 bulan'], answer: 2 },
  { q: 'Kebiasaan mana yang paling membantu mencegah stunting?', a: ['Jajan manis setiap hari', 'Imunisasi lengkap & gizi seimbang', 'Tidur larut'], answer: 1 },
]

const REF_POINTS = [ { m:0,h:50 }, { m:6,h:66 }, { m:12,h:75 }, { m:18,h:82 }, { m:24,h:87 }, { m:36,h:96 }, { m:48,h:103 }, { m:60,h:110 } ]
const refHeightAt = (ageM) => {
  const pts = REF_POINTS
  if (ageM <= pts[0].m) return pts[0].h
  if (ageM >= pts[pts.length-1].m) return pts[pts.length-1].h
  for (let i=0;i<pts.length-1;i++){ const a=pts[i], b=pts[i+1]; if(ageM>=a.m && ageM<=b.m){ const t=(ageM-a.m)/(b.m-a.m); return a.h + t*(b.h-a.h) } }
  return 0
}

const Card = ({ children, style }) => (<div style={{ background: pastel.card, padding: 16, ...box, ...style }}>{children}</div>)
const Button = ({ children, onClick, kind='primary', type='button' }) => {
  const base = { padding:'10px 16px', borderRadius:14, fontWeight:600, border:`1px solid ${pastel.border}`, cursor:'pointer', transition:'all .2s' }
  const palette = kind==='ghost' ? { background: pastel.bgSoft, color: pastel.primary } : { background: pastel.accent, color: '#0b3d2e' }
  return <button type={type} onClick={onClick} style={{ ...base, ...palette }} onMouseOver={(e)=>{e.currentTarget.style.transform='translateY(-1px)'}} onMouseOut={(e)=>{e.currentTarget.style.transform='none'}}>{children}</button>
}
const SectionTitle = ({ children }) => (<h2 style={{ margin:'12px 0 8px', fontSize:22, fontWeight:800, color: pastel.primary }}>{children}</h2>)
const inputStyle = { width:'100%', background:'white', border:`1px solid ${pastel.border}`, borderRadius:12, padding:'10px 12px', outline:'none', marginTop:6 }

function GrowthChart({ ageM, heightCm, weightKg }){
  const data = React.useMemo(() => { const xs=[0,6,12,18,24,36,48,60]; const arr=xs.map(m=>({month:m,Standar:refHeightAt(m)})); arr.push({month:ageM,Standar:refHeightAt(ageM),Anak:heightCm}); return arr.sort((a,b)=>a.month-b.month) }, [ageM, heightCm])
  const bmi = heightCm > 0 ? +(weightKg / Math.pow(heightCm/100,2)).toFixed(1) : null
  return (<div>
    <div style={{ height: 260 }}>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='month' label={{ value:'Umur (bulan)', position:'insideBottom', offset:-5 }} />
          <YAxis label={{ value:'Tinggi (cm)', angle:-90, position:'insideLeft' }} />
          <Tooltip /><Legend />
          <Line type='monotone' dataKey='Standar' stroke='#2e7d32' dot={false} />
          <Line type='monotone' dataKey='Anak' stroke='#1b4332' dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <p style={{ fontSize: 12, color: '#355b47', marginTop: 8 }}>Grafik ilustratif untuk edukasi, bukan alat diagnosis. Gunakan kurva WHO dan konsultasikan ke tenaga kesehatan.</p>
    {bmi && <Card style={{ marginTop:10 }}><strong>Perhitungan Ringkas:</strong><div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:8 }}><div>Tinggi: <b>{heightCm} cm</b></div><div>Berat: <b>{weightKg} kg</b></div><div>Umur: <b>{ageM} bln</b></div><div>BMI (indikatif): <b>{bmi}</b></div></div></Card>}
  </div>)
}

function Edukasi({ onStartQuiz }){
  return (<div>
    <SectionTitle>Materi Edukasi</SectionTitle>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:12 }}>
      {EDU_VIDEOS.map(v => (<Card key={v.id}><div style={{ fontWeight:700, marginBottom:6 }}>{v.title}</div><div style={{ display:'flex', gap:8, alignItems:'center' }}><a href={v.url} target='_blank' rel='noreferrer'><Button>Play ▶</Button></a><Button kind='ghost' onClick={onStartQuiz}>Mulai Kuis</Button></div><div style={{ fontSize:12, marginTop:6 }}>Tonton video, lalu coba kuis singkatnya.</div></Card>))}
    </div>
  </div>)
}

function Quiz({ onDone }){
  const [ans, setAns] = useState(Array(QUIZ.length).fill(null))
  const score = ans.reduce((s,a,i)=> s + (a===QUIZ[i].answer?1:0), 0)
  return (<Card>
    <SectionTitle>Kuis Singkat</SectionTitle>
    {QUIZ.map((it,idx)=>(<div key={idx} style={{ marginBottom:12 }}><div style={{ fontWeight:600 }}>{idx+1}. {it.q}</div><div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:6 }}>{it.a.map((opt,i)=>(<label key={i} style={{ display:'flex', alignItems:'center', gap:6 }}><input type='radio' name={`q${idx}`} checked={ans[idx]===i} onChange={()=>{ const c=[...ans]; c[idx]=i; setAns(c) }} /> {opt}</label>))}</div></div>))}
    <div style={{ display:'flex', gap:10, alignItems:'center' }}><Button onClick={()=>onDone(score)}>Selesai</Button><span>Skor sekarang: <b>{score}</b> / {QUIZ.length}</span></div>
  </Card>)
}

function Pemeriksaan(){
  const [form, setForm] = useState(()=> getLS('bye_form', { nama:'', umurBulan:'', berat:'', tinggi:'' }))
  const [submitted, setSubmitted] = useState(null)
  const onChange = (k,v) => { const next={ ...form, [k]: v }; setForm(next); setLS('bye_form', next) }
  const handleSubmit = (e) => { e.preventDefault(); if(!form.nama || !form.umurBulan || !form.berat || !form.tinggi) return alert('Lengkapi semua data.'); const umur=parseFloat(form.umurBulan), berat=parseFloat(form.berat), tinggi=parseFloat(form.tinggi); const ref=refHeightAt(umur); const gap=+(tinggi-ref).toFixed(1); const status = gap < -5 ? 'Di bawah perkiraan (perlu pantau)' : gap > 5 ? 'Di atas perkiraan (pantau)' : 'Dalam kisaran ilustratif'; setSubmitted({ ...form, umur, berat, tinggi, ref, gap, status }) }
  return (<div>
    <SectionTitle>Pemeriksaan Tumbuh Kembang</SectionTitle>
    <Card><form onSubmit={handleSubmit} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:12 }}>
      <div><label>Nama Anak</label><input value={form.nama} onChange={e=>onChange('nama', e.target.value)} placeholder='contoh: Aisyah' style={inputStyle} /></div>
      <div><label>Umur (bulan)</label><input type='number' value={form.umurBulan} onChange={e=>onChange('umurBulan', e.target.value)} placeholder='mis. 24' style={inputStyle} /></div>
      <div><label>Berat (kg)</label><input type='number' value={form.berat} onChange={e=>onChange('berat', e.target.value)} placeholder='mis. 12' style={inputStyle} /></div>
      <div><label>Tinggi (cm)</label><input type='number' value={form.tinggi} onChange={e=>onChange('tinggi', e.target.value)} placeholder='mis. 85' style={inputStyle} /></div>
      <div style={{ display:'flex', alignItems:'end' }}><Button type='submit'>Cek Status</Button></div>
    </form></Card>
    {submitted && (<div style={{ marginTop:16 }}><Card><div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:8 }}><div><b>Nama:</b> {submitted.nama}</div><div><b>Umur:</b> {submitted.umur} bln</div><div><b>Berat:</b> {submitted.berat} kg</div><div><b>Tinggi:</b> {submitted.tinggi} cm</div><div><b>Perkiraan tinggi referensi:</b> {submitted.ref} cm</div><div><b>Selisih:</b> {submitted.gap} cm</div><div><b>Status ilustratif:</b> {submitted.status}</div></div><div style={{ marginTop:12 }}><GrowthChart ageM={submitted.umur} heightCm={submitted.tinggi} weightKg={submitted.berat} /></div><ul style={{ marginTop:8, lineHeight:1.6 }}><li>Lengkapi imunisasi & rutin ke Posyandu/Puskesmas.</li><li>Penuhi gizi seimbang (karbo, protein hewani & nabati, sayur, buah) serta ASI/MPASI sesuai usia.</li><li>Jaga sanitasi & kebersihan (PHBS) dan kualitas tidur.</li><li>Konsultasikan hasil ini dengan tenaga kesehatan untuk penilaian berbasis standar WHO.</li></ul></Card></div>)}
  </div>)
}

function Konsultasi(){
  const [input, setInput] = useState('')
  const [history, setHistory] = useState(()=> getLS('bye_chat', []))
  const botReply = (msg) => { const m = msg.toLowerCase(); if(m.includes('imun') || m.includes('vaks')) return 'Imunisasi lengkap sesuai usia sangat penting. Cek jadwal di menu Pengingat atau konsultasi ke Puskesmas terdekat.'; if(m.includes('gizi') || m.includes('mpasi') || m.includes('makan')) return 'Pastikan protein hewani harian (telur/ikan/daging), variasi sayur-buah, dan frekuensi makan sesuai usia. Hindari minuman manis berlebih.'; if(m.includes('tinggi') || m.includes('berat') || m.includes('stunting')) return 'Pemantauan tinggi & berat harus dibandingkan kurva WHO. Silakan isi di menu Pemeriksaan, lalu diskusikan di Puskesmas.'; return 'Terima kasih! Saya bot BYE STUNTING. Saya bisa bantu info umum. Untuk saran medis spesifik, hubungi tenaga kesehatan ya.' }
  const send = () => { if(!input.trim()) return; const userMsg={ role:'user', text: input, t: Date.now() }, botMsg={ role:'bot', text: botReply(input), t: Date.now()+1 }; const next=[...history, userMsg, botMsg]; setHistory(next); setLS('bye_chat', next); setInput('') }
  const clear = () => { setHistory([]); setLS('bye_chat', []) }
  return (<div><SectionTitle>Konsultasi</SectionTitle><Card><div style={{ maxHeight:280, overflow:'auto', background: pastel.bgSoft, padding:12, borderRadius:12, border:`1px dashed ${pastel.border}` }}>{history.length===0 && <div style={{ color:'#56766a' }}>Belum ada riwayat chat. Mulai bertanya di bawah.</div>}{history.map((m,i)=>(<div key={i} style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start', margin:'6px 0' }}><div style={{ background:m.role==='user'? pastel.accent : 'white', padding:'8px 12px', borderRadius:14, maxWidth:'80%', border:`1px solid ${pastel.border}` }}><div style={{ fontSize:12, opacity:.6 }}>{m.role==='user'?'Anda':'BOT'}</div><div>{m.text}</div></div></div>))}</div><div style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:8, marginTop:10 }}><input value={input} onChange={(e)=>setInput(e.target.value)} placeholder='Tulis pertanyaan…' style={inputStyle} onKeyDown={(e)=>{ if(e.key==='Enter') send() }} /><button onClick={send} style={{ padding:'10px 16px', borderRadius:14, fontWeight:600, border:`1px solid ${pastel.border}`, cursor:'pointer', background: pastel.accent }}>Kirim</button><button onClick={clear} style={{ padding:'10px 16px', borderRadius:14, fontWeight:600, border:`1px solid ${pastel.border}`, cursor:'pointer', background: pastel.bgSoft }}>Hapus</button></div><div style={{ marginTop:10, display:'flex', gap:8, flexWrap:'wrap' }}><a href='mailto:ahli.gizi@example.org?subject=Konsultasi%20BYE%20STUNTING' rel='noreferrer'><button style={{ padding:'10px 16px', borderRadius:14, fontWeight:600, border:`1px solid ${pastel.border}`, cursor:'pointer', background: pastel.accent }}>Hubungi Ahli</button></a><span style={{ fontSize:12, color:'#355b47' }}>Riwayat chat tersimpan dan bisa diakses kembali.</span></div></Card></div>)
}

function Pengingat(){
  const defaultEvents = [
    { id: 1, title: 'BCG & Polio 1', monthFromBirth: 0, on: true },
    { id: 2, title: 'DPT-HB-Hib 1', monthFromBirth: 2, on: true },
    { id: 3, title: 'DPT-HB-Hib 2', monthFromBirth: 3, on: true },
    { id: 4, title: 'DPT-HB-Hib 3 & Polio 4', monthFromBirth: 4, on: true },
    { id: 5, title: 'Campak-Rubella', monthFromBirth: 9, on: true },
    { id: 6, title: 'Booster DPT & Polio', monthFromBirth: 18, on: true },
  ]
  const [events, setEvents] = useState(()=> getLS('bye_events', defaultEvents))
  const [notif, setNotif] = useState(()=> getLS('bye_notif', true))
  const toggle = (id) => { const next = events.map(e => e.id===id ? { ...e, on: !e.on } : e); setEvents(next); setLS('bye_events', next) }
  const requestNotif = async () => { if(!('Notification' in window)) return alert('Browser Anda tidak mendukung notifikasi'); try { const p = await Notification.requestPermission(); if(p!=='granted') return alert('Izin notifikasi ditolak'); setNotif(true); setLS('bye_notif', true); new Notification('BYE STUNTING', { body: 'Notifikasi aktif. Kami akan mengingatkan jadwal kesehatan.' }) } catch { alert('Gagal mengaktifkan notifikasi') } }
  const disableNotif = () => { setNotif(false); setLS('bye_notif', false) }
  return (<div><SectionTitle>Pengingat</SectionTitle><Card><div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:10 }}><div><div style={{ fontWeight:700, marginBottom:6 }}>Kalender Imunisasi (contoh)</div>{events.map(ev => (<div key={ev.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background: pastel.bgSoft, border:`1px solid ${pastel.border}`, borderRadius:12, padding:'8px 10px', marginBottom:6 }}><div><div style={{ fontWeight:600 }}>{ev.title}</div><div style={{ fontSize:12, opacity:.7 }}>Usia: {ev.monthFromBirth} bln</div></div><label style={{ display:'flex', alignItems:'center', gap:6 }}><input type='checkbox' checked={ev.on} onChange={()=>toggle(ev.id)} /> aktif</label></div>))}</div><div><div style={{ fontWeight:700, marginBottom:6 }}>Notifikasi</div><div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8 }}>{notif ? (<><button onClick={disableNotif} style={{ padding:'10px 16px', borderRadius:14, fontWeight:600, border:`1px solid ${pastel.border}`, background: pastel.bgSoft }}>Matikan Notifikasi</button><span style={{ fontSize:12 }}>Status: <b>Aktif</b></span></>) : (<><button onClick={requestNotif} style={{ padding:'10px 16px', borderRadius:14, fontWeight:600, border:`1px solid ${pastel.border}`, background: pastel.accent }}>Nyalakan Notifikasi</button><span style={{ fontSize:12 }}>Status: <b>Nonaktif</b></span></>)}</div><div style={{ fontWeight:700, marginTop:10 }}>Event Kesehatan</div><ul style={{ marginTop:6, lineHeight:1.7 }}><li>Posyandu Keliling tiap <b>minggu ke-1</b> bulan berjalan.</li><li>Penyuluhan gizi di Puskesmas, <b>Sabtu ke-2</b> tiap bulan.</li><li>Gerakan Makan Telur Nasional, <b>25 setiap bulan</b>.</li></ul></div></div><p style={{ fontSize:12, marginTop:10, color:'#56766a' }}>Catatan: Jadwal di atas contoh edukatif. Sesuaikan dengan jadwal resmi wilayah Anda.</p></Card></div>)
}

function Komunitas(){
  const [posts, setPosts] = useState(()=> getLS('bye_posts', []))
  const [text, setText] = useState('')
  const addPost = () => { if(!text.trim()) return; const p={ id: Date.now(), text, likes:0, comments:[] }; const next=[p, ...posts]; setPosts(next); setLS('bye_posts', next); setText('') }
  const like = (id) => { const next = posts.map(p => p.id===id? { ...p, likes:p.likes+1 } : p); setPosts(next); setLS('bye_posts', next) }
  const comment = (id, ctext) => { if(!ctext.trim()) return; const next = posts.map(p => p.id===id? { ...p, comments:[...p.comments, { id: Date.now(), text: ctext }] } : p); setPosts(next); setLS('bye_posts', next) }
  return (<div><SectionTitle>Komunitas</SectionTitle><Card><div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:8 }}><textarea rows={3} value={text} onChange={e=>setText(e.target.value)} placeholder='Bagikan pengalaman atau tips…' style={{ ...inputStyle, resize:'vertical' }} /><button onClick={addPost} style={{ padding:'10px 16px', borderRadius:14, fontWeight:600, border:`1px solid ${pastel.border}`, background: pastel.accent }}>Posting</button></div></Card><div style={{ marginTop:12, display:'grid', gap:10 }}>{posts.length===0 && <div style={{ color:'#56766a' }}>Belum ada posting. Jadilah yang pertama!</div>}{posts.map(p => (<Card key={p.id}><div style={{ marginBottom:6 }}>{p.text}</div><div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8 }}><button onClick={()=>like(p.id)} style={{ padding:'10px 16px', borderRadius:14, fontWeight:600, border:`1px solid ${pastel.border}`, background: pastel.bgSoft }}>👍 {p.likes}</button></div><CommentBox onSubmit={(t)=>comment(p.id, t)} />{p.comments.length>0 && (<div style={{ marginTop:8 }}><div style={{ fontWeight:600, marginBottom:6 }}>Komentar:</div><div style={{ display:'grid', gap:6 }}>{p.comments.map(c => (<div key={c.id} style={{ background: pastel.bgSoft, padding:8, borderRadius:10, border:`1px solid ${pastel.border}` }}>{c.text}</div>))}</div></div>)}</Card>))}</div></div>)
}

function CommentBox({ onSubmit }){ const [t, setT] = useState(''); return (<div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:8 }}><input value={t} onChange={e=>setT(e.target.value)} placeholder='Tulis komentar…' style={inputStyle} onKeyDown={(e)=>{ if(e.key==='Enter'){ onSubmit(t); setT('') } }} /><button onClick={()=>{ onSubmit(t); setT('') }} style={{ padding:'10px 16px', borderRadius:14, fontWeight:600, border:`1px solid ${pastel.border}`, background: pastel.accent }}>Kirim</button></div>) }

function Profil(){
  const [parent, setParent] = useState(()=> getLS('bye_parent', { nama:'', hp:'' }))
  const [child, setChild] = useState(()=> getLS('bye_child', { nama:'', umurBulan:'', berat:'', tinggi:'' }))
  const onSave = () => { setLS('bye_parent', parent); setLS('bye_child', child); alert('Profil disimpan.') }
  const logout = () => { localStorage.clear(); alert('Data lokal dibersihkan. Anda telah logout.'); window.location.reload() }
  return (<div><SectionTitle>Profil Pengguna</SectionTitle><Card><div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:12 }}><div><div style={{ fontWeight:700, marginBottom:6 }}>Data Orang Tua/Wali</div><label>Nama</label><input value={parent.nama} onChange={e=>setParent({ ...parent, nama:e.target.value })} style={inputStyle} /><label style={{ marginTop:8 }}>No. HP</label><input value={parent.hp} onChange={e=>setParent({ ...parent, hp:e.target.value })} style={inputStyle} /></div><div><div style={{ fontWeight:700, marginBottom:6 }}>Data Anak</div><label>Nama Anak</label><input value={child.nama} onChange={e=>setChild({ ...child, nama:e.target.value })} style={inputStyle} /><label style={{ marginTop:8 }}>Umur (bulan)</label><input type='number' value={child.umurBulan} onChange={e=>setChild({ ...child, umurBulan:e.target.value })} style={inputStyle} /><label style={{ marginTop:8 }}>Berat (kg)</label><input type='number' value={child.berat} onChange={e=>setChild({ ...child, berat:e.target.value })} style={inputStyle} /><label style={{ marginTop:8 }}>Tinggi (cm)</label><input type='number' value={child.tinggi} onChange={e=>setChild({ ...child, tinggi:e.target.value })} style={inputStyle} /></div></div><div style={{ display:'flex', gap:8, marginTop:12 }}><button onClick={onSave} style={{ padding:'10px 16px', borderRadius:14, fontWeight:600, border:`1px solid ${pastel.border}`, background: pastel.accent }}>Simpan</button><button onClick={logout} style={{ padding:'10px 16px', borderRadius:14, fontWeight:600, border:`1px solid ${pastel.border}`, background: pastel.bgSoft }}>Logout</button></div></Card></div>)
}

export default function App(){
  const [tab, setTab] = useState('home')
  const [showQuiz, setShowQuiz] = useState(false)
  const [lastScore, setLastScore] = useState(()=> getLS('bye_quiz_score', null))
  const finishQuiz = (score) => { setShowQuiz(false); setLastScore(score); setLS('bye_quiz_score', score) }
  return (<div style={containerStyle}>
    <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
      <img src={logo} alt='Logo BYE STUNTING' width={56} height={56} style={{ borderRadius:14, border:`1px solid ${pastel.border}` }} />
      <div><div style={{ ...titleStyle, fontSize:34 }}>BYE STUNTING</div><div style={{ color:'#355b47' }}>Selamat datang 👋 — sehatkan tumbuh kembang anak bersama.</div></div>
    </div>
    <Card style={{ marginBottom: 16 }}><div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>{[{id:'home',label:'Beranda'},{id:'edukasi',label:'Edukasi'},{id:'pemeriksaan',label:'Pemeriksaan'},{id:'konsultasi',label:'Konsultasi'},{id:'pengingat',label:'Pengingat'},{id:'komunitas',label:'Komunitas'},{id:'profil',label:'Profil'}].map(m => (<button key={m.id} onClick={()=>{ setTab(m.id); setShowQuiz(false) }} style={{ padding:'10px 16px', borderRadius:14, fontWeight:800, border:`1px solid ${pastel.border}`, cursor:'pointer', background: tab===m.id? pastel.accent : pastel.bgSoft }}>{m.label}</button>))}</div></Card>
    {tab==='home' && (<div><Card><div style={{ display:'grid', gridTemplateColumns:'1fr', gap:10 }}><div style={{ fontSize:18, fontWeight:700 }}>Menu Utama</div><div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:10 }}>{[{label:'Edukasi',id:'edukasi'},{label:'Pemeriksaan',id:'pemeriksaan'},{label:'Konsultasi',id:'konsultasi'},{label:'Pengingat',id:'pengingat'},{label:'Komunitas',id:'komunitas'},{label:'Profil',id:'profil'}].map(it=>(<div key={it.id} onClick={()=>setTab(it.id)} role='button' tabIndex={0} onKeyDown={(e)=>{ if(e.key==='Enter') setTab(it.id) }} style={{ background:'white', padding:16, borderRadius:16, border:`1px solid ${pastel.border}`, cursor:'pointer', boxShadow:'0 2px 10px rgba(0,0,0,.05)' }}><div style={{ fontWeight:800, color: pastel.primary }}>{it.label}</div><div style={{ fontSize:12, color:'#56766a' }}>Buka {it.label.toLowerCase()}</div></div>))}</div>{lastScore!==null && <div style={{ fontSize:14, color:'#355b47' }}>Skor kuis terakhir: <b>{lastScore}</b> / {QUIZ.length}</div>}</div></Card></div>)}
    {tab==='edukasi' && (!showQuiz ? <Edukasi onStartQuiz={()=>setShowQuiz(true)} /> : <Quiz onDone={finishQuiz} />)}
    {tab==='pemeriksaan' && <Pemeriksaan />}
    {tab==='konsultasi' && <Konsultasi />}
    {tab==='pengingat' && <Pengingat />}
    {tab==='komunitas' && <Komunitas />}
    {tab==='profil' && <Profil />}
    <div style={{ textAlign:'center', marginTop:18, color:'#56766a', fontSize:12 }}>© {new Date().getFullYear()} BYE STUNTING — Edukasi, Pemeriksaan, Konsultasi, Pengingat & Komunitas.</div>
  </div>)
}
