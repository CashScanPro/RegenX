'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Lang = 'fr' | 'pt';

export interface Translation {
  nav: { features: string; pricing: string; testimonials: string; login: string; subscribe: string };
  hero: { titleLine1: string; titleLine2: string; desc: string; ctaStart: string; ctaFeatures: string; badge1: string; badge2: string; badge3: string; partnersLabel: string };
  stats: { s1: string; s2: string; s3: string; s4: string };
  features: { eyebrow: string; title: string; items: { title: string; desc: string }[] };
  testimonials: { eyebrow: string; title: string; items: { role: string; text: string }[] };
  pricing: { eyebrow: string; title: string; perMonth: string; subscribe: string; note: string; plans: { name: string; desc: string; badge?: string; features: string[] }[] };
  cta: { eyebrow: string; title: string; desc: string; button: string };
  footer: { terms: string; privacy: string; legal: string; contact: string; copyright: string };
  register: { successEyebrow: string; successTitle: string; successDesc: string; successLogin: string; panelEyebrow: string; panelTitleLine1: string; panelTitleLine2: string; panelDesc: string; formEyebrow: string; formTitle: string; emailLabel: string; emailPlaceholder: string; passwordLabel: string; passwordPlaceholder: string; submit: string; submitting: string; alreadyMember: string; loginLink: string; termsPrefix: string; termsLink: string };
}

const fr: Translation = {
  nav: {
    features: 'Fonctionnalités',
    pricing: 'Tarifs',
    testimonials: 'Témoignages',
    login: 'Connexion',
    subscribe: 'S’abonner',
  },
  hero: {
    titleLine1: 'Ton coach fitness',
    titleLine2: '100 % personnalisé',
    desc: 'RegenX génère tes programmes d’entraînement et tes plans nutritionnels sur mesure, afin de t’offrir une expérience de coaching unique, précise et évolutive. Notre collaboration avec Eric Favre, marque leader présente dans plus de 70 pays, et partenaire avec Essan NFC, apporte à nos utilisateurs l’expérience d’un acteur majeur de la nutrition sportive internationale. Une alliance entre innovation technologique, expertise sportive et excellence nutritionnelle, pour transformer durablement tes performances.',
    ctaStart: 'Commencer maintenant',
    ctaFeatures: 'Fonctionnalités',
    badge1: 'Remboursement 14 jours',
    badge2: 'Sans engagement',
    badge3: 'Conforme RGPD',
    partnersLabel: 'En partenariat avec',
  },
  stats: {
    s1: 'Athlètes accompagnés · réseau partenaire (Eric Favre · Essan NFC)',
    s2: 'Programmes personnalisés par IA',
    s3: 'Satisfait ou remboursé',
    s4: 'Hébergement & données RGPD',
  },
  features: {
    eyebrow: 'Fonctionnalités',
    title: 'Tout ce dont tu as besoin',
    items: [
      { title: 'Coach IA Personnalisé', desc: 'Ton programme s’adapte en temps réel à tes objectifs, ton niveau et tes préférences grâce à l’IA.' },
      { title: 'Programmes Entraînement', desc: 'Des séances générées automatiquement : musculation, cardio, HIIT, mobilité à la maison ou en salle.' },
      { title: 'Plans Nutritionnels', desc: 'Menus hebdomadaires équilibrés avec macros calculés selon ton profil et tes restrictions alimentaires.' },
      { title: 'Suivi de Progression', desc: 'Visualise tes gains, ta charge d’entraînement et tes tendances nutritionnelles semaine après semaine.' },
      { title: 'App Mobile iOS & Android', desc: 'Accède à tout depuis ton téléphone. Mode hors-ligne disponible pour t’entraîner n’importe où.' },
      { title: 'Données 100 % RGPD', desc: 'Hébergement en Europe, chiffrement de bout en bout. Tes données t’appartiennent.' },
    ],
  },
  testimonials: {
    eyebrow: 'Témoignages',
    title: 'Ils ont transformé leur corps',
    items: [
      { role: 'Coureuse amateur', text: 'En 3 mois avec RegenX, j’ai amélioré mon 10km de 8 minutes. Le coach IA ajuste mes séances chaque semaine.' },
      { role: 'Coach fitness', text: 'J’utilise RegenX pour créer les programmes de mes 6 clients. Gain de temps énorme et résultats au rendez-vous.' },
      { role: 'Prise de masse', text: '+4 kg de muscle en 4 mois. Le plan nutritionnel est précis et les recettes sont vraiment bonnes.' },
    ],
  },
  pricing: {
    eyebrow: 'Tarification',
    title: 'Simple & transparent',
    perMonth: '/mois',
    subscribe: 'S’abonner',
    note: 'TVA incluse — Sans engagement — Remboursement sous 14 jours — Conforme RGPD',
    plans: [
      { name: 'Starter', desc: 'Pour débuter votre transformation', features: ['IA Coach 2h/jour', 'Programmes sport de base', 'Plans nutritionnels simples', 'Suivi progression basique', 'App mobile incluse'] },
      { name: 'Pro', desc: 'L’expérience premium complète', badge: 'Populaire', features: ['IA Coach illimitée 24h/24', 'Programmes sport personnalisés', 'Plans nutritionnels adaptés', 'Suivi progression avancé', 'Support prioritaire'] },
      { name: 'Équipe', desc: 'Pour coachs et équipes sportives', features: ['Tout le forfait Pro', 'Tableau de bord coach', 'Suivi équipe en temps réel', 'Rapports de performance', 'Support dédié 24h/24'] },
    ],
  },
  cta: {
    eyebrow: '★ Rejoignez l’élite',
    title: 'Prêt à commencer ?',
    desc: 'Rejoins les 2 000+ athlètes qui ont transformé leur corps avec RegenX.',
    button: 'S’abonner maintenant',
  },
  footer: {
    terms: 'CGU',
    privacy: 'Confidentialité',
    legal: 'Mentions légales',
    contact: 'Contact',
    copyright: '© 2026 RegenX — Hébergé en EU — Conforme RGPD',
  },
  register: {
    successEyebrow: 'Bienvenue',
    successTitle: 'Compte créé',
    successDesc: 'Vérifiez votre email pour activer votre compte.',
    successLogin: 'Se connecter',
    panelEyebrow: '★ Club Premium',
    panelTitleLine1: 'Rejoignez',
    panelTitleLine2: 'l’élite.',
    panelDesc: 'Coach IA illimité. Programmes sur mesure. Résultats garantis.',
    formEyebrow: 'Création de compte',
    formTitle: 'Inscription',
    emailLabel: 'Email',
    emailPlaceholder: 'votre@email.com',
    passwordLabel: 'Mot de passe',
    passwordPlaceholder: '8 caractères minimum',
    submit: 'Créer mon compte',
    submitting: 'Inscription…',
    alreadyMember: 'Déjà membre ?',
    loginLink: 'Se connecter',
    termsPrefix: 'En créant un compte, vous acceptez nos',
    termsLink: 'CGU',
  },
};

const pt: Translation = {
  nav: {
    features: 'Funcionalidades',
    pricing: 'Preços',
    testimonials: 'Testemunhos',
    login: 'Entrar',
    subscribe: 'Subscrever',
  },
  hero: {
    titleLine1: 'O teu treinador fitness',
    titleLine2: '100% personalizado',
    desc: 'A RegenX gera os teus programas de treino e os teus planos nutricionais à medida, para te oferecer uma experiência de coaching única, precisa e evolutiva. A nossa colaboração com a Eric Favre, marca líder presente em mais de 70 países, e a parceria com a Essan NFC, traz aos nossos utilizadores a experiência de um ator de referência da nutrição desportiva internacional. Uma aliança entre inovação tecnológica, especialização desportiva e excelência nutricional, para transformar duradouramente o teu desempenho.',
    ctaStart: 'Começar agora',
    ctaFeatures: 'Funcionalidades',
    badge1: 'Reembolso em 14 dias',
    badge2: 'Sem compromisso',
    badge3: 'Conforme o RGPD',
    partnersLabel: 'Em parceria com',
  },
  stats: {
    s1: 'Atletas acompanhados · rede de parceiros (Eric Favre · Essan NFC)',
    s2: 'Programas personalizados por IA',
    s3: 'Satisfeito ou reembolsado',
    s4: 'Alojamento e dados RGPD',
  },
  features: {
    eyebrow: 'Funcionalidades',
    title: 'Tudo o que precisas',
    items: [
      { title: 'Treinador IA Personalizado', desc: 'O teu programa adapta-se em tempo real aos teus objetivos, ao teu nível e às tuas preferências graças à IA.' },
      { title: 'Programas de Treino', desc: 'Sessões geradas automaticamente: musculação, cardio, HIIT, mobilidade em casa ou no ginásio.' },
      { title: 'Planos Nutricionais', desc: 'Ementas semanais equilibradas com macros calculados de acordo com o teu perfil e as tuas restrições alimentares.' },
      { title: 'Acompanhamento de Progresso', desc: 'Visualiza os teus ganhos, a tua carga de treino e as tuas tendências nutricionais semana após semana.' },
      { title: 'App Móvel iOS e Android', desc: 'Acede a tudo a partir do teu telemóvel. Modo offline disponível para treinares em qualquer lugar.' },
      { title: 'Dados 100% RGPD', desc: 'Alojamento na Europa, encriptação ponta a ponta. Os teus dados pertencem-te.' },
    ],
  },
  testimonials: {
    eyebrow: 'Testemunhos',
    title: 'Transformaram o seu corpo',
    items: [
      { role: 'Corredora amadora', text: 'Em 3 meses com a RegenX, melhorei os meus 10 km em 8 minutos. O treinador IA ajusta os meus treinos todas as semanas.' },
      { role: 'Treinador fitness', text: 'Uso a RegenX para criar os programas dos meus 6 clientes. Uma enorme poupança de tempo e resultados garantidos.' },
      { role: 'Ganho de massa', text: '+4 kg de músculo em 4 meses. O plano nutricional é preciso e as receitas são mesmo boas.' },
    ],
  },
  pricing: {
    eyebrow: 'Preços',
    title: 'Simples e transparente',
    perMonth: '/mês',
    subscribe: 'Subscrever',
    note: 'IVA incluído — Sem compromisso — Reembolso em 14 dias — Conforme o RGPD',
    plans: [
      { name: 'Starter', desc: 'Para iniciar a tua transformação', features: ['IA Coach 2h/dia', 'Programas de treino base', 'Planos nutricionais simples', 'Acompanhamento de progresso básico', 'App móvel incluída'] },
      { name: 'Pro', desc: 'A experiência premium completa', badge: 'Popular', features: ['IA Coach ilimitada 24h/24', 'Programas de treino personalizados', 'Planos nutricionais adaptados', 'Acompanhamento de progresso avançado', 'Suporte prioritário'] },
      { name: 'Equipa', desc: 'Para treinadores e equipas desportivas', features: ['Tudo no plano Pro', 'Painel do treinador', 'Acompanhamento de equipa em tempo real', 'Relatórios de desempenho', 'Suporte dedicado 24h/24'] },
    ],
  },
  cta: {
    eyebrow: '★ Junta-te à elite',
    title: 'Pronto para começar?',
    desc: 'Junta-te aos mais de 2 000 atletas que transformaram o seu corpo com a RegenX.',
    button: 'Subscrever agora',
  },
  footer: {
    terms: 'Termos',
    privacy: 'Privacidade',
    legal: 'Avisos legais',
    contact: 'Contacto',
    copyright: '© 2026 RegenX — Alojado na UE — Conforme o RGPD',
  },
  register: {
    successEyebrow: 'Bem-vindo',
    successTitle: 'Conta criada',
    successDesc: 'Verifica o teu email para ativar a tua conta.',
    successLogin: 'Entrar',
    panelEyebrow: '★ Club Premium',
    panelTitleLine1: 'Junta-te',
    panelTitleLine2: 'à elite.',
    panelDesc: 'Coach IA ilimitado. Programas à medida. Resultados garantidos.',
    formEyebrow: 'Criação de conta',
    formTitle: 'Registo',
    emailLabel: 'Email',
    emailPlaceholder: 'o-seu@email.com',
    passwordLabel: 'Palavra-passe',
    passwordPlaceholder: 'mínimo 8 caracteres',
    submit: 'Criar a minha conta',
    submitting: 'A registar…',
    alreadyMember: 'Já és membro?',
    loginLink: 'Entrar',
    termsPrefix: 'Ao criar uma conta, aceitas os nossos',
    termsLink: 'Termos',
  },
};

export const translations: Record<Lang, Translation> = { fr, pt };

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translation;
};

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr');

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && localStorage.getItem('regenx_lang')) as Lang | null;
    if (stored === 'fr' || stored === 'pt') {
      setLangState(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem('regenx_lang', l);
      document.documentElement.lang = l;
    }
  }

  const t = translations[lang];

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useTranslation must be used within LanguageProvider');
  return ctx;
}
