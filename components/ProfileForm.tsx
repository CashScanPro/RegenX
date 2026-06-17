'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Check } from 'lucide-react';

const GOLD = '#C8922A';
const SERIF = 'var(--font-playfair), Georgia, serif';

type ProfileFormProps = {
  initialFirstName: string;
  initialLastName: string;
};

export function ProfileForm({ initialFirstName, initialLastName }: ProfileFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    setErrorMsg('');

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      },
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message || 'Une erreur est survenue.');
      return;
    }

    setStatus('success');
    router.refresh();
    setTimeout(() => setStatus('idle'), 2500);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.7rem 0.85rem',
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 300,
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '0.45rem',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.75rem' }}>
      <div className="rx-eyebrow" style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '1.5rem' }}>Modifier mon profil</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <label htmlFor="firstName" style={labelStyle}>Prénom</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Votre prénom"
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="lastName" style={labelStyle}>Nom</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Votre nom"
            style={inputStyle}
          />
        </div>
      </div>

      <button
        type="submit"
        className="rx-btn"
        disabled={status === 'saving'}
        style={{ cursor: status === 'saving' ? 'wait' : 'pointer', opacity: status === 'saving' ? 0.7 : 1 }}
      >
        {status === 'saving' ? 'Enregistrement…' : 'Enregistrer'}
      </button>

      {status === 'success' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.82rem', color: '#4ade80', fontWeight: 400 }}>
          <Check style={{ width: '15px', height: '15px' }} strokeWidth={2} />
          Profil mis à jour.
        </div>
      )}

      {status === 'error' && (
        <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: '#f87171', fontWeight: 300 }}>
          {errorMsg}
        </div>
      )}
    </form>
  );
}
