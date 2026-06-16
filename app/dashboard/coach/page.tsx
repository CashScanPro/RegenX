'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Brain, Dumbbell, Apple, TrendingUp, User, Zap, Send } from 'lucide-react';

type Msg = { role: 'user' | 'assistant'; content: string };

const GOLD = '#C8922A';
const GOLD_LIGHT = '#E8B84B';

const navItems = [
  { href: '/dashboard', label: 'Vue d’ensemble', icon: Zap },
  { href: '/dashboard/coach', label: 'Coach IA', icon: Brain },
  { href: '/dashboard/workouts', label: 'Entraînements', icon: Dumbbell },
  { href: '/dashboard/nutrition', label: 'Nutrition', icon: Apple },
  { href: '/dashboard/progress', label: 'Progression', icon: TrendingUp },
  { href: '/account', label: 'Mon compte', icon: User },
];

export default function CoachPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Salut ! Je suis ton coach RegenX IA. Pose-moi tes questions sur le sport, la nutrition ou la récupération.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    setError(null);
    const userMsg: Msg = { role: 'user', content: input.trim() };
    const next = [...messages, userMsg];
    setMessages([...next, { role: 'assistant', content: '' }]);
    setInput(''); setLoading(true);
    try {
      const res = await fetch('/api/ai/coach', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages: next }) });
      if (res.status === 402) { setError('Abonnement requis.'); setMessages(next); setLoading(false); return; }
      if (!res.ok || !res.body) { setError('Erreur serveur.'); setLoading(false); return; }
      const reader = res.body.getReader(); const decoder = new TextDecoder(); let acc = '';
      while (true) { const { done, value } = await reader.read(); if (done) break; acc += decoder.decode(value,{stream:true}); setMessages(m=>{const c=[...m];c[c.length-1]={role:'assistant',content:acc};return c;}); }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Erreur'); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0a' }}>
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full flex-col z-20 hidden lg:flex" style={{ width: '250px', backgroundColor: '#0d0d0d', borderRight: '1px solid rgba(200,146,42,0.15)' }}>
        <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid rgba(200,146,42,0.12)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Image src="/logo RengenX.png" alt="RegenX" width={60} height={60} style={{ objectFit: 'contain' }} />
        </div>
        <nav style={{ flex: 1, padding: '1.25rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className={'rx-nav-link' + (item.href === '/dashboard/coach' ? ' active' : '')}>
              <item.icon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex flex-col flex-1" style={{ marginLeft: '0' }}>
        <div className="lg:ml-[250px] flex flex-col flex-1">
          {/* Header */}
          <header className="sticky top-0 z-10 px-6 py-4 flex items-center gap-4" style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(200,146,42,0.12)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(200,146,42,0.15)', border: '1px solid rgba(200,146,42,0.3)' }}>
              <Brain style={{ width: '20px', height: '20px', color: GOLD }} />
            </div>
            <div>
              <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem' }}>Coach IA RegenX</h1>
              <p style={{ color: GOLD, fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: GOLD, display: 'inline-block' }} className="animate-pulse"></span> En ligne
              </p>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6" style={{ maxHeight: 'calc(100vh - 150px)' }}>
            <div className="max-w-3xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((m, i) => (
                <div key={i} className={'flex gap-3 ' + (m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {m.role === 'assistant' && (
                    <div style={{ width: '34px', height: '34px', borderRadius: '11px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '4px', background: 'rgba(200,146,42,0.15)', border: '1px solid rgba(200,146,42,0.3)' }}>
                      <Brain style={{ width: '17px', height: '17px', color: GOLD }} />
                    </div>
                  )}
                  <div className="whitespace-pre-wrap" style={Object.assign({ maxWidth: '80%', padding: '0.85rem 1.1rem', borderRadius: '16px', fontSize: '0.88rem', lineHeight: 1.6 }, m.role === 'user' ? { background: 'linear-gradient(135deg, ' + GOLD + ', ' + GOLD_LIGHT + ')', color: '#0a0a0a', fontWeight: 600, borderBottomRightRadius: '4px' } : { background: '#161616', border: '1px solid rgba(255,255,255,0.08)', color: '#e5e5e5', borderBottomLeftRadius: '4px' })}>
                    {m.content || (loading && i === messages.length - 1 ? <span className="flex gap-1 items-center"><span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: GOLD, animationDelay: '0ms' }}></span><span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: GOLD, animationDelay: '150ms' }}></span><span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: GOLD, animationDelay: '300ms' }}></span></span> : '')}
                  </div>
                  {m.role === 'user' && (
                    <div style={{ width: '34px', height: '34px', borderRadius: '11px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '4px', fontWeight: 800, color: GOLD, background: 'rgba(200,146,42,0.1)', border: '1px solid rgba(200,146,42,0.2)' }}>T</div>
                  )}
                </div>
              ))}
              {error && (
                <div style={{ padding: '1rem', borderRadius: '12px', fontSize: '0.85rem', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <span>{error}</span><Link href="/pricing" style={{ color: GOLD, fontWeight: 700, fontSize: '0.78rem' }}>Abonnement →</Link>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </div>

          {/* Input */}
          <div style={{ padding: '1rem', borderTop: '1px solid rgba(200,146,42,0.12)', background: 'rgba(10,10,10,0.95)' }}>
            <div className="max-w-3xl mx-auto flex gap-3">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()} placeholder="Pose ta question..." disabled={loading}
                className="flex-1 focus:outline-none disabled:opacity-50"
                style={{ padding: '0.9rem 1.1rem', borderRadius: '14px', color: '#fff', fontSize: '0.88rem', background: '#161616', border: '1px solid rgba(255,255,255,0.08)' }}
              />
              <button onClick={send} disabled={loading || !input.trim()} className="rx-btn-gold disabled:opacity-40" style={{ padding: '0 1.3rem', borderRadius: '14px' }}>
                <Send style={{ width: '17px', height: '17px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
