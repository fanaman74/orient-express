const HOURS = [
  { day: 'Lundi',    nl: 'Maandag',   en: 'Monday',    time: 'Fermé' },
  { day: 'Mardi',    nl: 'Dinsdag',   en: 'Tuesday',   time: '11h00–14h00 · 17h00–22h00' },
  { day: 'Mercredi', nl: 'Woensdag',  en: 'Wednesday', time: '11h00–14h00 · 17h00–22h00' },
  { day: 'Jeudi',    nl: 'Donderdag', en: 'Thursday',  time: '11h00–14h00 · 17h00–22h00' },
  { day: 'Vendredi', nl: 'Vrijdag',   en: 'Friday',    time: '11h00–14h00 · 17h00–22h00' },
  { day: 'Samedi',   nl: 'Zaterdag',  en: 'Saturday',  time: '11h00–14h00 · 17h00–22h00' },
  { day: 'Dimanche', nl: 'Zondag',    en: 'Sunday',    time: '11h00–14h00 · 17h00–22h00' },
];

export default function FindUs() {
  return (
    <section id="informations" className="py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-4 block">Informations</span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">Nous Trouver</h2>
          <div className="w-12 h-px bg-gold mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Info */}
          <div>
            <div className="mb-8">
              <h3 className="font-display text-xs uppercase tracking-widest text-accent mb-3">Adresse</h3>
              <p className="text-text-muted">Rue de Wand 16 (Wandstraat 16)</p>
              <p className="text-text-muted">1020 Laeken, Bruxelles</p>
            </div>

            <div className="mb-8">
              <h3 className="font-display text-xs uppercase tracking-widest text-accent mb-3">Téléphone</h3>
              <a href="tel:+3222620879" className="block text-text hover:text-accent transition-colors font-medium">
                02/262 08 79
              </a>
              <a href="tel:+32486539422" className="block text-text-muted hover:text-accent transition-colors text-sm mt-1">
                GSM: 0486/53 94 22
              </a>
            </div>

            <div className="mb-8">
              <h3 className="font-display text-xs uppercase tracking-widest text-accent mb-3">Livraison à domicile</h3>
              <p className="text-text-muted text-sm">À partir de <span className="text-gold font-semibold">20,00€</span> · Dans un rayon de 3 km</p>
              <p className="text-text-muted text-sm mt-1">Disponible <span className="text-text">18h30–21h30</span></p>
            </div>

            <div>
              <h3 className="font-display text-xs uppercase tracking-widest text-accent mb-3">Horaires</h3>
              <table className="w-full text-sm">
                <tbody>
                  {HOURS.map(({ day, time }) => {
                    const isClosed = time === 'Fermé';
                    return (
                      <tr key={day} className="border-b border-border">
                        <td className="py-2.5 pr-4 text-text">{day}</td>
                        <td className={`py-2.5 ${isClosed ? 'text-text-muted italic' : 'text-gold font-medium'}`}>
                          {time}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-xs text-text-muted mt-3 italic">Fermé les lundis non fériés.</p>
            </div>
          </div>

          {/* Right: Map */}
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

        {/* Note */}
        <div className="mt-12 p-6 border border-border text-center">
          <p className="text-text-muted text-sm">
            Tous nos plats sont accompagnés de <span className="text-text">riz blanc</span>.
            Remplacement par riz sauté ou nouilles sautées :
            <span className="text-gold font-semibold"> +3,00€ par plat</span>
          </p>
        </div>
      </div>
    </section>
  );
}
