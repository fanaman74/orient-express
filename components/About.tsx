'use client';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function About() {
  const { dict } = useLanguage();
  const t = dict.about;

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-[800px] mx-auto text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-4 block">{t.label}</span>
        <h2 className="font-display text-3xl md:text-4xl mb-8 font-semibold">{t.title}</h2>
        <div className="w-12 h-px bg-gold mx-auto mb-8" />
        <p className="text-text-muted leading-relaxed text-lg">{t.body}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { value: '4.6★', label: t.stat_rating },
            { value: '130+', label: t.stat_dishes },
            { value: '3km',  label: t.stat_delivery },
            { value: '🥟',   label: t.stat_fondue },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 p-4 border border-border">
              <span className="font-display text-xl text-accent">{value}</span>
              <span className="text-xs uppercase tracking-widest text-text-muted text-center">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
