'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type MenuItem = {
  id: string;
  num: string;
  section: string;
  name_fr: string;
  name_nl: string | null;
  name_en: string | null;
  spicy: boolean;
  price: number;
};

type SetMenu = {
  id: string;
  type: string;
  num: string | null;
  name_fr: string;
  name_nl: string | null;
  name_en: string | null;
  description_fr: string | null;
  price: number;
  min_people: number;
  max_people: number | null;
};

const SECTIONS: { id: string; label_fr: string; label_nl: string; label_en: string }[] = [
  { id: 'menus',           label_fr: 'Menus',                    label_nl: 'Menu\'s',                label_en: 'Set Menus' },
  { id: 'fondue',          label_fr: 'Fondue Chinoise',          label_nl: 'Chinese Fondue',         label_en: 'Chinese Hot Pot' },
  { id: 'potages',         label_fr: 'Potages',                  label_nl: 'Soepen',                 label_en: 'Soups' },
  { id: 'entrees',         label_fr: 'Hors D\'œuvres',          label_nl: 'Voorgerechten',          label_en: 'Starters' },
  { id: 'poulet-canard',   label_fr: 'Poulet & Canard',         label_nl: 'Kip & Eend',            label_en: 'Chicken & Duck' },
  { id: 'porc',            label_fr: 'Porc',                     label_nl: 'Varken',                label_en: 'Pork' },
  { id: 'boeuf',           label_fr: 'Bœuf',                    label_nl: 'Rundvlees',             label_en: 'Beef' },
  { id: 'fruits-mer',      label_fr: 'Poissons & Fruits de Mer',label_nl: 'Vis & Zeevruchten',     label_en: 'Fish & Seafood' },
  { id: 'calamars',        label_fr: 'Calamars',                 label_nl: 'Inktvis',               label_en: 'Squid' },
  { id: 'grenouille-lotte',label_fr: 'Grenouilles & Lotte',     label_nl: 'Kikkerbouten & Zeeduivel', label_en: 'Frog Legs & Monkfish' },
  { id: 'vegetarien',      label_fr: 'Végétarien',              label_nl: 'Vegetarisch',            label_en: 'Vegetarian' },
  { id: 'riz-nouilles',    label_fr: 'Riz & Nouilles',          label_nl: 'Rijst & Noedels',       label_en: 'Rice & Noodles' },
  { id: 'supplements',     label_fr: 'Supplémentaire',          label_nl: 'Extra',                  label_en: 'Extras' },
  { id: 'desserts',        label_fr: 'Desserts',                 label_nl: 'Desserts',              label_en: 'Desserts' },
];

export default function Menu() {
  const [activeSection, setActiveSection] = useState('potages');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [setMenus, setSetMenus] = useState<SetMenu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [{ data: menuData }, { data: setData }] = await Promise.all([
        supabase.from('menu_items').select('*').order('display_order'),
        supabase.from('set_menus').select('*').order('display_order'),
      ]);
      setItems(menuData ?? []);
      setSetMenus(setData ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const isSetSection = activeSection === 'menus' || activeSection === 'fondue';
  const visibleItems = items.filter(i => i.section === activeSection);
  const visibleSets = setMenus.filter(s => s.type === (activeSection === 'menus' ? 'menu' : 'fondue'));

  return (
    <section id="menu" className="py-24 px-6 bg-bg-alt">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-4 block">Notre Carte</span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">Menu</h2>
          <p className="text-text-muted text-sm mt-3">Tous les plats sont accompagnés de riz blanc.</p>
          <div className="w-12 h-px bg-gold mx-auto mt-6" />
        </div>

        {/* Section tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${
                activeSection === s.id
                  ? 'border-accent bg-accent text-white font-medium'
                  : 'border-border text-text-muted hover:text-text hover:border-text'
              }`}
            >
              {s.label_fr}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-text-muted text-sm uppercase tracking-widest">Chargement…</div>
        ) : isSetSection ? (
          /* Set menus / Fondue cards */
          <div className="max-w-[900px] mx-auto grid gap-6">
            {visibleSets.map(set => (
              <div key={set.id} className="border border-border p-6 hover:border-accent transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-display font-semibold text-lg text-text">{set.name_fr}</h3>
                  <span className="text-gold font-bold text-xl whitespace-nowrap">{set.price.toFixed(2).replace('.', ',')} €</span>
                </div>
                {set.min_people > 1 && (
                  <p className="text-xs text-accent uppercase tracking-wider mb-2">
                    Min. {set.min_people} personne{set.min_people > 1 ? 's' : ''}
                    {set.max_people ? ` — ${set.max_people} max` : ''}
                  </p>
                )}
                {set.description_fr && (
                  <p className="text-text-muted text-sm leading-relaxed">{set.description_fr}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Regular menu items table */
          <div className="max-w-[800px] mx-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs uppercase tracking-widest text-text-muted pb-3 font-normal w-12">N°</th>
                  <th className="text-left text-xs uppercase tracking-widest text-text-muted pb-3 font-normal">Plat</th>
                  <th className="text-right text-xs uppercase tracking-widest text-text-muted pb-3 font-normal w-24">Prix</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map(item => (
                  <tr key={item.id} className="border-b border-border group hover:bg-surface/30 transition-colors">
                    <td className="py-3 pr-4 text-xs text-text-muted align-top pt-4">{item.num}</td>
                    <td className="py-3 pr-4 align-top pt-4">
                      <span className="font-medium text-text group-hover:text-accent transition-colors">
                        {item.name_fr}
                      </span>
                      {item.spicy && (
                        <span className="ml-2 text-xs text-red-400" title="Piquant">🌶</span>
                      )}
                    </td>
                    <td className="py-3 text-right text-gold font-semibold whitespace-nowrap align-top pt-4">
                      {item.price.toFixed(2).replace('.', ',')} €
                    </td>
                  </tr>
                ))}
                {visibleItems.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-text-muted text-sm italic">
                      Aucun plat trouvé — exécutez le SQL dans le tableau de bord Supabase.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
