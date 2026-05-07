'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type CookieConsent = 'accepted' | 'declined' | null;

const COOKIE_KEY = 'regenx_cookie_consent';

export function CookieBanner() {
  const [consent, setConsent] = useState<CookieConsent>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY) as CookieConsent;
    if (!stored) {
      // Small delay so it doesn't flash immediately on load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
    setConsent(stored);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setConsent('accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_KEY, 'declined');
    setConsent('declined');
    setVisible(false);
    // If PostHog is loaded, opt out
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).posthog) {
      const ph = (window as unknown as Record<string, { opt_out_capturing?: () => void }>).posthog;
      if (ph && typeof ph.opt_out_capturing === 'function') {
        ph.opt_out_capturing();
      }
    }
  };

  if (!visible || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Gestion des cookies"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
    >
      <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/50 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
            <span className="text-xl" role="img" aria-label="cookie">🍪</span>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm mb-1">
              Nous utilisons des cookies
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              RegenX utilise uniquement des cookies strictement nécessaires (authentification) et des analytics anonymisés
              hébergés en Europe (PostHog EU). Aucun cookie publicitaire ou tiers.{' '}
              <Link href="/privacy#cookies" className="text-green-400 hover:underline">
                En savoir plus
              </Link>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-shrink-0 gap-3 w-full sm:w-auto">
            <button
              onClick={handleDecline}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-400 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
              aria-label="Refuser les cookies analytiques"
            >
              Refuser
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-white bg-green-500 hover:bg-green-400 rounded-lg transition-colors"
              aria-label="Accepter les cookies"
            >
              Accepter
            </button>
          </div>
        </div>

        {/* Detail links */}
        <div className="mt-3 pt-3 border-t border-gray-800 flex flex-wrap gap-3 text-xs text-gray-500">
          <Link href="/privacy" className="hover:text-green-400 transition-colors">Politique de confidentialité</Link>
          <Link href="/mentions-legales" className="hover:text-green-400 transition-colors">Mentions légales</Link>
          <Link href="/gdpr" className="hover:text-green-400 transition-colors">Droits RGPD</Link>
        </div>
      </div>
    </div>
  );
}
