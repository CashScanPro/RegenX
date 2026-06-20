'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation, type Lang } from '@/lib/i18n';

const GOLD = '#c8a85a';
const CREAM = '#d8cbb0';

const LANGS: { code: Lang; label: string; full: string }[] = [
  { code: 'fr', label: 'FR', full: 'Français' },
  { code: 'pt', label: 'PT', full: 'Português' },
];

export function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Changer de langue / Mudar de idioma"
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '38px',
          height: '38px',
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: CREAM,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(200,146,42,0.3)',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontFamily: "'Jost', sans-serif",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = GOLD;
          (e.currentTarget as HTMLElement).style.color = GOLD;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,146,42,0.3)';
          (e.currentTarget as HTMLElement).style.color = CREAM;
        }}
      >
        {current.label}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: '130px',
            backgroundColor: 'rgba(15,15,17,0.97)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(200,146,42,0.25)',
            borderRadius: '6px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            zIndex: 100,
          }}
        >
          {LANGS.map((l) => {
            const active = l.code === lang;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  width: '100%',
                  padding: '0.6rem 0.9rem',
                  background: active ? 'rgba(200,146,42,0.1)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: "'Jost', sans-serif",
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: active ? GOLD : CREAM,
                    minWidth: '22px',
                  }}
                >
                  {l.label}
                </span>
                <span style={{ fontSize: '0.78rem', color: active ? GOLD : 'rgba(216,203,176,0.7)' }}>
                  {l.full}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
