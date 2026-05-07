import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient, isSubscriptionActive, getSubscription } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const active = await isSubscriptionActive(user.id);
  const subscription = await getSubscription(user.id);

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, fitness_level')
    .eq('id', user.id)
    .single();

  const { data: workouts } = await supabase
    .from('workouts')
    .select('id, completed_at')
    .eq('user_id', user.id);

  const { data: nutritionPlans } = await supabase
    .from('nutrition_plans')
    .select('id, active')
    .eq('user_id', user.id);

  const { data: progressEntries } = await supabase
    .from('progress_tracking')
    .select('id, date')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(1);

  const completedWorkouts = workouts?.filter(w => w.completed_at).length || 0;
  const activePlan = nutritionPlans?.find(p => p.active);
  const lastProgress = progressEntries?.[0];
  const firstName = profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Coach';

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '⚡' },
    { href: '/dashboard/coach', label: 'Coach IA', icon: '🤖' },
    { href: '/dashboard/workouts', label: 'Programmes', icon: '💪' },
    { href: '/dashboard/nutrition', label: 'Nutrition', icon: '🥗' },
    { href: '/dashboard/progress', label: 'Progression', icon: '📈' },
    { href: '/account', label: 'Compte', icon: '👤' },
  ];

  const cards = [
    {
      href: '/dashboard/coach',
      emoji: '🤖',
      label: 'Coach IA',
      desc: 'Discute avec ton coach 24/7',
      stat: 'Disponible',
      color: 'from-emerald-500/20 to-emerald-600/5',
      border: 'border-emerald-500/20',
    },
    {
      href: '/dashboard/workouts',
      emoji: '💪',
      label: 'Programmes',
      desc: `${workouts?.length || 0} programme(s) actif(s)`,
      stat: `${completedWorkouts} complété(s)`,
      color: 'from-blue-500/20 to-blue-600/5',
      border: 'border-blue-500/20',
    },
    {
      href: '/dashboard/nutrition',
      emoji: '🥗',
      label: 'Nutrition',
      desc: activePlan ? '1 plan nutritionnel actif' : 'Aucun plan actif',
      stat: activePlan ? 'Actif' : 'À configurer',
      color: 'from-orange-500/20 to-orange-600/5',
      border: 'border-orange-500/20',
    },
    {
      href: '/dashboard/progress',
      emoji: '📈',
      label: 'Progression',
      desc: lastProgress ? `Dernière entrée: ${new Date(lastProgress.date).toLocaleDateString('fr-FR')}` : 'Aucune entrée',
      stat: lastProgress ? 'Suivi actif' : 'Démarrer',
      color: 'from-purple-500/20 to-purple-600/5',
      border: 'border-purple-500/20',
    },
  ];

  return (
    <div className="min-h-screen" style={{background: '#09090f'}}>

      {/* Sidebar nav */}
      <aside
        className="fixed top-0 left-0 h-full w-64 border-r flex flex-col z-20 hidden lg:flex"
        style={{background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)'}}
      >
        {/* Logo */}
        <div className="p-6 border-b" style={{borderColor: 'rgba(255,255,255,0.06)'}}>
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{background: 'linear-gradient(135deg, #059669, #10b981)'}}
            >
              <span className="text-white text-lg font-black">R</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">RegenX</span>
          </Link>
        </div>
        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white transition-all duration-200 hover:bg-white/5 text-sm font-medium"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        {/* User badge */}
        <div className="p-4 border-t" style={{borderColor: 'rgba(255,255,255,0.06)'}}>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{firstName}</p>
              <p className="text-slate-500 text-xs truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">

        {/* Top bar mobile */}
        <header
          className="sticky top-0 z-10 border-b px-6 py-4 flex items-center justify-between lg:hidden"
          style={{background: 'rgba(9,9,15,0.95)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.06)'}}
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #059669, #10b981)'}}>
              <span className="text-white text-sm font-black">R</span>
            </div>
          </Link>
          <nav className="flex gap-4 text-xs">
            {navItems.slice(0, 4).map(item => (
              <Link key={item.href} href={item.href} className="text-slate-400 hover:text-white transition">{item.icon}</Link>
            ))}
          </nav>
        </header>

        <div className="px-6 py-8 max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-black text-white tracking-tight mb-1">
              Bonjour {firstName} 👋
            </h1>
            <p className="text-slate-500">Prêt à progresser aujourd&apos;hui ?</p>
          </div>

          {/* Upsell banner si pas d'abonnement actif */}
          {!active && (
            <div
              className="rounded-2xl p-6 mb-8 flex items-center justify-between gap-4 flex-wrap"
              style={{background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.08) 100%)', border: '1px solid rgba(16,185,129,0.2)'}}
            >
              <div>
                <h2 className="font-bold text-white mb-1">Débloque RegenX Premium ✨</h2>
                <p className="text-slate-400 text-sm">Coach IA illimité, programmes personnalisés, nutrition &amp; récupération.</p>
              </div>
              <Link
                href="/pricing"
                className="flex-shrink-0 px-6 py-3 font-semibold text-white rounded-xl transition-all duration-200 hover:scale-105"
                style={{background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 16px rgba(16,185,129,0.3)'}}
              >
                Choisir un forfait →
              </Link>
            </div>
          )}

          {/* Cards */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
            {cards.map(card => (
              <Link
                key={card.href}
                href={card.href}
                className={`rounded-2xl p-5 border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg bg-gradient-to-br ${card.color} ${card.border} group`}
                style={{background: 'rgba(255,255,255,0.03)'}}
              >
                <div className="text-3xl mb-4">{card.emoji}</div>
                <h3 className="font-bold text-white mb-1 text-sm">{card.label}</h3>
                <p className="text-slate-500 text-xs mb-3 leading-relaxed">{card.desc}</p>
                <span className="inline-block text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
                  {card.stat}
                </span>
              </Link>
            ))}
          </div>

          {/* Statut abonnement */}
          <div
            className="rounded-2xl p-6"
            style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'}}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-white">Statut abonnement</h2>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  background: active ? 'rgba(16,185,129,0.15)' : 'rgba(100,100,100,0.15)',
                  color: active ? '#10b981' : '#94a3b8',
                  border: active ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(100,100,100,0.2)'
                }}
              >
                {active ? '● Actif' : '○ ' + (subscription?.status || 'Inactif')}
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              {active
                ? 'Ton abonnement RegenX Premium est actif. Profite de toutes les fonctionnalités !'
                : 'Passe à Premium pour débloquer le coach IA, la génération de programmes et les plans nutritionnels.'}
            </p>
            {!active && (
              <Link
                href="/pricing"
                className="inline-flex mt-4 px-5 py-2.5 font-semibold text-white text-sm rounded-xl transition-all hover:scale-105"
                style={{background: 'linear-gradient(135deg, #059669, #10b981)'}}
              >
                Voir les offres →
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
