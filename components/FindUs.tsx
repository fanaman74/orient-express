'use client';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const HOURS = [
  { fr: 'Lundi',    nl: 'Maandag',   en: 'Monday',    time: null },
  { fr: 'Mardi',    nl: 'Dinsdag',   en: 'Tuesday',   time: '11h00–14h00 · 17h00–22h00' },
  { fr: 'Mercredi', nl: 'Woensdag',  en: 'Wednesday', time: '11h00–14h00 · 17h00–22h00' },
  { fr: 'Jeudi',    nl: 'Donderdag', en: 'Thursday',  time: '11h00–14h00 · 17h00–22h00' },
  { fr: 'Vendredi', nl: 'Vrijdag',   en: 'Friday',    time: '11h00–14h00 · 17h00–22h00' },
  { fr: 'Samedi',   nl: 'Zaterdag',  en: 'Saturday',  time: '11h00–14h00 · 17h00–22h00' },
  { fr: 'Dimanche', nl: 'Zondag',    en: 'Sunday',    time: '11h00–14h00 · 17h00–22h00' },
];

export default function FindUs() {
  const { locale, dict } = useLanguage();
  const t = dict.findus;

  return (
    <section id="informations" className="py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-4 block">{t.label}</span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">{t.title}</h2>
          <div className="w-12 h-px bg-gold mx-auto mt-6" />
        </div>

        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="font-display text-xs uppercase tracking-widest text-accent mb-3">{t.address_label}</h3>
              <p className="text-text-muted">Rue de Wand 16 (Wandstraat 16)</p>
              <p className="text-text-muted">1020 Laeken, Bruxelles</p>
            </div>

            <div>
              <h3 className="font-display text-xs uppercase tracking-widest text-accent mb-3">{t.phone_label}</h3>
              <a href="tel:+3222620879" className="block text-text hover:text-accent transition-colors font-medium">
                02/262 08 79
              </a>
              <a href="tel:+32486539422" className="block text-text-muted hover:text-accent transition-colors text-sm mt-1">
                GSM: 0486/53 94 22
              </a>
            </div>

            <div>
              <h3 className="font-display text-xs uppercase tracking-widest text-accent mb-3">{t.delivery_label}</h3>
              <p className="text-text-muted text-sm">
                {t.delivery_from} <span className="text-gold font-semibold">20,00€</span> {t.delivery_radius}
              </p>
              <p className="text-text-muted text-sm mt-1">{t.delivery_hours} <span className="text-text">18h30–21h30</span></p>
            </div>

            <div>
              <h3 className="font-display text-xs uppercase tracking-widest text-accent mb-3">{t.hours_label}</h3>
              <table className="w-full text-sm">
                <tbody>
                  {HOURS.map((row) => {
                    const dayName = row[locale as 'fr' | 'nl' | 'en'];
                    const isClosed = row.time === null;
                    return (
                      <tr key={row.fr} className="border-b border-border">
                        <td className="py-2.5 pr-4 text-text">{dayName}</td>
                        <td className={`py-2.5 ${isClosed ? 'text-text-muted italic' : 'text-gold font-medium'}`}>
                          {isClosed ? t.closed : row.time}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-xs text-text-muted mt-3 italic">{t.closed_note}</p>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-lg overflow-hidden min-h-[450px] border border-border">
            <iframe
              title="Orient Express — Rue de Wand 16, 1020 Bruxelles"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2518.2!2d4.357822!3d50.896429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c2511104e1e1%3A0x8986daca7d28d9f9!2sOrient%20Express!5e0!3m2!1sfr!2sbe!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '450px' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="mt-12 p-6 border border-border text-center">
          <p className="text-text-muted text-sm">
            {t.rice_note} <span className="text-text">{t.white_rice}</span>.{' '}
            {t.upgrade_note}{' '}
            <span className="text-gold font-semibold">{t.upgrade_price}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
