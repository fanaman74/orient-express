'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useOrder } from './OrderProvider';

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
  description_nl: string | null;
  description_en: string | null;
  price: number;
  min_people: number;
  max_people: number | null;
};

const SECTIONS = [
  { id: 'menus',            fr: 'Menus',                    nl: "Menu's",                   en: 'Set Menus' },
  { id: 'fondue',           fr: 'Fondue Chinoise',          nl: 'Chinese Fondue',            en: 'Chinese Hot Pot' },
  { id: 'potages',          fr: 'Potages',                  nl: 'Soepen',                    en: 'Soups' },
  { id: 'entrees',          fr: "Hors D'œuvres",            nl: 'Voorgerechten',             en: 'Starters' },
  { id: 'poulet-canard',    fr: 'Poulet & Canard',          nl: 'Kip & Eend',               en: 'Chicken & Duck' },
  { id: 'porc',             fr: 'Porc',                     nl: 'Varken',                    en: 'Pork' },
  { id: 'boeuf',            fr: 'Bœuf',                     nl: 'Rundvlees',                en: 'Beef' },
  { id: 'fruits-mer',       fr: 'Poissons & Fruits de Mer', nl: 'Vis & Zeevruchten',        en: 'Fish & Seafood' },
  { id: 'calamars',         fr: 'Calamars',                 nl: 'Inktvis',                  en: 'Squid' },
  { id: 'grenouille-lotte', fr: 'Grenouilles & Lotte',      nl: 'Kikkerbouten & Zeeduivel', en: 'Frog Legs & Monkfish' },
  { id: 'vegetarien',       fr: 'Végétarien',               nl: 'Vegetarisch',              en: 'Vegetarian' },
  { id: 'riz-nouilles',     fr: 'Riz & Nouilles',           nl: 'Rijst & Noedels',          en: 'Rice & Noodles' },
  { id: 'supplements',      fr: 'Supplémentaire',           nl: 'Extra',                    en: 'Extras' },
  { id: 'desserts',         fr: 'Desserts',                 nl: 'Desserts',                 en: 'Desserts' },
];

function itemName(item: MenuItem | SetMenu, locale: string): string {
  if (locale === 'nl' && item.name_nl) return item.name_nl;
  if (locale === 'en' && item.name_en) return item.name_en;
  return item.name_fr;
}

function itemDesc(set: SetMenu, locale: string): string | null {
  if (locale === 'nl' && set.description_nl) return set.description_nl;
  if (locale === 'en' && set.description_en) return set.description_en;
  return set.description_fr;
}

export default function Menu() {
  const { locale, dict } = useLanguage();
  const t = dict.menu;
  const { addItem } = useOrder();

  const [activeSection, setActiveSection] = useState('potages');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [setMenus, setSetMenus] = useState<SetMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState<string | null>(null);

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

  function handleAdd(item: MenuItem) {
    addItem({ id: item.id, name: itemName(item, locale), price: item.price });
    setAdded(item.id);
    setTimeout(() => setAdded(null), 900);
  }

  const isSetSection = activeSection === 'menus' || activeSection === 'fondue';
  const visibleItems = items.filter(i => i.section === activeSection);
  const visibleSets = setMenus.filter(s => s.type === (activeSection === 'menus' ? 'menu' : 'fondue'));

  return (
    <section id="menu" className="py-24 px-6 bg-bg-alt">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-4 block">{t.label}</span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">{t.title}</h2>
          <p className="text-text-muted text-sm mt-3">{t.rice_note}</p>
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
              {s[locale as 'fr' | 'nl' | 'en']}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-text-muted text-sm uppercase tracking-widest">{t.loading}</div>
        ) : isSetSection ? (
          /* Set menus / Fondue cards */
          <div className="max-w-[900px] mx-auto grid gap-6">
            {visibleSets.map(set => (
              <div key={set.id} className="border border-border p-6 hover:border-accent transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-display font-semibold text-lg text-text">{itemName(set, locale)}</h3>
                  <span className="text-gold font-bold text-xl whitespace-nowrap">{set.price.toFixed(2).replace('.', ',')} €</span>
                </div>
                {set.min_people > 1 && (
                  <p className="text-xs text-accent uppercase tracking-wider mb-2">
                    {t.min_people} {set.min_people} {set.min_people > 1 ? t.persons : t.person}
                    {set.max_people ? ` — ${set.max_people} ${t.max}` : ''}
                  </p>
                )}
                {itemDesc(set, locale) && (
                  <p className="text-text-muted text-sm leading-relaxed">{itemDesc(set, locale)}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Regular menu items table */
          <div className="max-w-[860px] mx-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs uppercase tracking-widest text-text-muted pb-3 font-normal w-12">{t.col_num}</th>
                  <th className="text-left text-xs uppercase tracking-widest text-text-muted pb-3 font-normal">{t.col_dish}</th>
                  <th className="text-right text-xs uppercase tracking-widest text-text-muted pb-3 font-normal w-24">{t.col_price}</th>
                  <th className="w-16" />
                </tr>
              </thead>
              <tbody>
                {visibleItems.map(item => (
                  <tr key={item.id} className="border-b border-border group hover:bg-surface/30 transition-colors">
                    <td className="py-3 pr-4 text-xs text-text-muted align-middle">{item.num}</td>
                    <td className="py-3 pr-4 align-middle">
                      <span className="font-medium text-text group-hover:text-accent transition-colors">
                        {itemName(item, locale)}
                      </span>
                      {item.spicy && (
                        <span className="ml-2 text-xs text-red-400" title="Piquant">🌶</span>
                      )}
                    </td>
                    <td className="py-3 text-right text-gold font-semibold whitespace-nowrap align-middle">
                      {item.price.toFixed(2).replace('.', ',')} €
                    </td>
                    <td className="py-3 pl-3 align-middle">
                      <button
                        onClick={() => handleAdd(item)}
                        className={`w-7 h-7 rounded-full border flex items-center justify-center text-sm transition-all ${
                          added === item.id
                            ? 'border-accent bg-accent text-white scale-110'
                            : 'border-border text-text-muted hover:border-accent hover:text-accent'
                        }`}
                        aria-label={`${t.add} ${itemName(item, locale)}`}
                      >
                        {added === item.id ? '✓' : '+'}
                      </button>
                    </td>
                  </tr>
                ))}
                {visibleItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-text-muted text-sm italic">
                      {t.empty}
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
