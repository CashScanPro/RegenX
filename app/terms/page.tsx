import Link from 'next/link';
import Image from 'next/image';


export const metadata = {
  title: "Conditions Générales d'Utilisation | RegenX",
  description: "CGU de RegenX - Conditions générales d'utilisation de la plateforme.",
};


const LAST_UPDATED = '1er mai 2026';
const COMPANY = 'RegenX SAS';
const EMAIL = 'legal@regenx.app';


export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo RengenX.png" alt="RegenX" width={28} height={28} className="rounded-lg object-contain" />
            <span className="font-black text-lg">RegenX</span>
          </Link>
        </div>
      </nav>


      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-black mb-2">{"Conditions Générales d'Utilisation"}</h1>
        <p className="text-slate-400 mb-12">Dernière mise à jour : {LAST_UPDATED}</p>


        <div className="space-y-10 text-slate-300 leading-relaxed">


          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Présentation du service</h2>
