'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type MenuItem = {
  id: string;
  num: string;
  section: string;
  name_fr: string;
  name_nl: string | null;
  name_en: string | null;
  spicy: boolean;
  price: number;
  display_order: number;
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
  display_order: number;
};

const SECTIONS = [
  { id: 'potages',          fr: 'Potages' },
  { id: 'entrees',          fr: "Hors D'œuvres" },
  { id: 'poulet-canard',    fr: 'Poulet & Canard' },
  { id: 'porc',             fr: 'Porc' },
  { id: 'boeuf',            fr: 'Bœuf' },
  { id: 'fruits-mer',       fr: 'Poissons & Fruits de Mer' },
  { id: 'calamars',         fr: 'Calamars' },
  { id: 'grenouille-lotte', fr: 'Grenouilles & Lotte' },
  { id: 'vegetarien',       fr: 'Végétarien' },
  { id: 'riz-nouilles',     fr: 'Riz & Nouilles' },
  { id: 'supplements',      fr: 'Supplémentaire' },
  { id: 'desserts',         fr: 'Desserts' },
];

const INPUT = 'bg-[#0e0a08] border border-white/10 px-2 py-1 text-[#f5ece6] text-sm focus:outline-none focus:border-[#c8102e] transition-colors w-full';
const BTN   = 'px-3 py-1 text-xs uppercase tracking-wider font-semibold transition-colors';

function Field({ value, onChange, placeholder, className = '' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string;
}) {
  return (
    <input
      className={`${INPUT} ${className}`}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

// ── Menu Items Tab ────────────────────────────────────────────────────────────
function MenuItemsTab({ items, onRefresh }: { items: MenuItem[]; onRefresh: () => void }) {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [edits, setEdits]   = useState<Record<string, Partial<MenuItem>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({ section: activeSection, spicy: false, num: '', name_fr: '', price: 0, display_order: 999 });

  const sectionItems = items.filter(i => i.section === activeSection);

  function edit(id: string, field: keyof MenuItem, value: unknown) {
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  function getField(item: MenuItem, field: keyof MenuItem) {
    return (edits[item.id]?.[field] ?? item[field]) as string;
  }

  async function save(item: MenuItem) {
    if (!edits[item.id]) return;
    setSaving(item.id);
    await fetch(`/api/admin/items/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edits[item.id]),
    });
    setSaving(null);
    setEdits(prev => { const n = { ...prev }; delete n[item.id]; return n; });
    onRefresh();
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cet article ?')) return;
    await fetch(`/api/admin/items/${id}`, { method: 'DELETE' });
    onRefresh();
  }

  async function addItem() {
    if (!newItem.name_fr || !newItem.num) return;
    await fetch('/api/admin/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newItem, section: activeSection }),
    });
    setAdding(false);
    setNewItem({ section: activeSection, spicy: false, num: '', name_fr: '', price: 0, display_order: 999 });
    onRefresh();
  }

  return (
    <div>
      {/* Section tabs */}
      <div className="flex flex-wrap gap-1 mb-6">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => { setActiveSection(s.id); setAdding(false); }}
            className={`${BTN} px-3 py-1.5 text-xs border ${activeSection === s.id ? 'bg-[#c8102e] border-[#c8102e] text-white' : 'border-white/10 text-[#9a7a6a] hover:text-[#f5ece6]'}`}
          >
            {s.fr}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[#9a7a6a] text-xs uppercase tracking-wider">
              <th className="text-left py-2 pr-3 w-12">N°</th>
              <th className="text-left py-2 pr-3">Nom FR</th>
              <th className="text-left py-2 pr-3">Nom NL</th>
              <th className="text-left py-2 pr-3">Nom EN</th>
              <th className="text-left py-2 pr-3 w-24">Prix €</th>
              <th className="text-center py-2 pr-3 w-14">Spicy</th>
              <th className="text-center py-2 w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sectionItems.map(item => {
              const isDirty = !!edits[item.id];
              return (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-2 pr-3">
                    <Field value={getField(item, 'num')} onChange={v => edit(item.id, 'num', v)} className="w-12" />
                  </td>
                  <td className="py-2 pr-3">
                    <Field value={getField(item, 'name_fr')} onChange={v => edit(item.id, 'name_fr', v)} />
                  </td>
                  <td className="py-2 pr-3">
                    <Field value={getField(item, 'name_nl') ?? ''} onChange={v => edit(item.id, 'name_nl', v)} placeholder="—" />
                  </td>
                  <td className="py-2 pr-3">
                    <Field value={getField(item, 'name_en') ?? ''} onChange={v => edit(item.id, 'name_en', v)} placeholder="—" />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      type="number"
                      step="0.5"
                      className={`${INPUT} w-20`}
                      value={(edits[item.id]?.price ?? item.price) as number}
                      onChange={e => edit(item.id, 'price', parseFloat(e.target.value))}
                    />
                  </td>
                  <td className="py-2 pr-3 text-center">
                    <input
                      type="checkbox"
                      checked={(edits[item.id]?.spicy ?? item.spicy) as boolean}
                      onChange={e => edit(item.id, 'spicy', e.target.checked)}
                      className="accent-[#c8102e] w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="py-2 text-center">
                    <div className="flex gap-1 justify-center">
                      <button
                        onClick={() => save(item)}
                        disabled={!isDirty || saving === item.id}
                        className={`${BTN} ${isDirty ? 'bg-[#c8102e] text-white hover:bg-[#a50d25]' : 'bg-white/5 text-[#9a7a6a] cursor-default'}`}
                      >
                        {saving === item.id ? '…' : 'Sauv.'}
                      </button>
                      <button onClick={() => remove(item.id)} className={`${BTN} border border-white/10 text-[#9a7a6a] hover:text-[#c8102e] hover:border-[#c8102e]`}>✕</button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Add new item row */}
            {adding && (
              <tr className="border-b border-[#c8102e]/30 bg-[#c8102e]/5">
                <td className="py-2 pr-3">
                  <Field value={newItem.num ?? ''} onChange={v => setNewItem(p => ({ ...p, num: v }))} placeholder="N°" className="w-12" />
                </td>
                <td className="py-2 pr-3">
                  <Field value={newItem.name_fr ?? ''} onChange={v => setNewItem(p => ({ ...p, name_fr: v }))} placeholder="Nom FR *" />
                </td>
                <td className="py-2 pr-3">
                  <Field value={newItem.name_nl ?? ''} onChange={v => setNewItem(p => ({ ...p, name_nl: v }))} placeholder="Nom NL" />
                </td>
                <td className="py-2 pr-3">
                  <Field value={newItem.name_en ?? ''} onChange={v => setNewItem(p => ({ ...p, name_en: v }))} placeholder="Nom EN" />
                </td>
                <td className="py-2 pr-3">
                  <input type="number" step="0.5" className={`${INPUT} w-20`} value={newItem.price ?? 0}
                    onChange={e => setNewItem(p => ({ ...p, price: parseFloat(e.target.value) }))} />
                </td>
                <td className="py-2 pr-3 text-center">
                  <input type="checkbox" checked={newItem.spicy ?? false}
                    onChange={e => setNewItem(p => ({ ...p, spicy: e.target.checked }))}
                    className="accent-[#c8102e] w-4 h-4 cursor-pointer" />
                </td>
                <td className="py-2 text-center">
                  <div className="flex gap-1 justify-center">
                    <button onClick={addItem} className={`${BTN} bg-[#c8102e] text-white hover:bg-[#a50d25]`}>Ajouter</button>
                    <button onClick={() => setAdding(false)} className={`${BTN} border border-white/10 text-[#9a7a6a]`}>✕</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!adding && (
        <button onClick={() => setAdding(true)} className={`${BTN} mt-4 border border-white/10 text-[#9a7a6a] hover:text-[#f5ece6] hover:border-white/30`}>
          + Ajouter un article
        </button>
      )}
    </div>
  );
}

// ── Set Menus Tab ─────────────────────────────────────────────────────────────
function SetMenusTab({ sets, onRefresh }: { sets: SetMenu[]; onRefresh: () => void }) {
  const [edits, setEdits]   = useState<Record<string, Partial<SetMenu>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newSet, setNewSet] = useState<Partial<SetMenu>>({ type: 'menu', name_fr: '', price: 0, min_people: 1, display_order: 999 });

  function edit(id: string, field: keyof SetMenu, value: unknown) {
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  function getField(s: SetMenu, field: keyof SetMenu) {
    return (edits[s.id]?.[field] ?? s[field]) as string;
  }

  async function save(s: SetMenu) {
    if (!edits[s.id]) return;
    setSaving(s.id);
    await fetch(`/api/admin/sets/${s.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edits[s.id]),
    });
    setSaving(null);
    setEdits(prev => { const n = { ...prev }; delete n[s.id]; return n; });
    onRefresh();
  }

  async function remove(id: string) {
    if (!confirm('Supprimer ce menu ?')) return;
    await fetch(`/api/admin/sets/${id}`, { method: 'DELETE' });
    onRefresh();
  }

  async function addSet() {
    if (!newSet.name_fr) return;
    await fetch('/api/admin/sets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSet),
    });
    setAdding(false);
    setNewSet({ type: 'menu', name_fr: '', price: 0, min_people: 1, display_order: 999 });
    onRefresh();
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-[#9a7a6a] text-xs uppercase tracking-wider">
            <th className="text-left py-2 pr-3">Nom FR</th>
            <th className="text-left py-2 pr-3">Nom NL</th>
            <th className="text-left py-2 pr-3">Nom EN</th>
            <th className="text-left py-2 pr-3">Description FR</th>
            <th className="text-left py-2 pr-3 w-24">Prix €</th>
            <th className="text-left py-2 pr-3 w-16">Min pers.</th>
            <th className="text-left py-2 pr-3 w-16">Max pers.</th>
            <th className="text-center py-2 w-28">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sets.map(s => {
            const isDirty = !!edits[s.id];
            return (
              <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-2 pr-3"><Field value={getField(s, 'name_fr')} onChange={v => edit(s.id, 'name_fr', v)} /></td>
                <td className="py-2 pr-3"><Field value={getField(s, 'name_nl') ?? ''} onChange={v => edit(s.id, 'name_nl', v)} placeholder="—" /></td>
                <td className="py-2 pr-3"><Field value={getField(s, 'name_en') ?? ''} onChange={v => edit(s.id, 'name_en', v)} placeholder="—" /></td>
                <td className="py-2 pr-3"><Field value={getField(s, 'description_fr') ?? ''} onChange={v => edit(s.id, 'description_fr', v)} placeholder="—" /></td>
                <td className="py-2 pr-3">
                  <input type="number" step="0.5" className={`${INPUT} w-20`}
                    value={(edits[s.id]?.price ?? s.price) as number}
                    onChange={e => edit(s.id, 'price', parseFloat(e.target.value))} />
                </td>
                <td className="py-2 pr-3">
                  <input type="number" className={`${INPUT} w-14`}
                    value={(edits[s.id]?.min_people ?? s.min_people) as number}
                    onChange={e => edit(s.id, 'min_people', parseInt(e.target.value))} />
                </td>
                <td className="py-2 pr-3">
                  <input type="number" className={`${INPUT} w-14`}
                    value={(edits[s.id]?.max_people ?? s.max_people ?? '') as number}
                    onChange={e => edit(s.id, 'max_people', e.target.value ? parseInt(e.target.value) : null)} />
                </td>
                <td className="py-2 text-center">
                  <div className="flex gap-1 justify-center">
                    <button onClick={() => save(s)} disabled={!isDirty || saving === s.id}
                      className={`${BTN} ${isDirty ? 'bg-[#c8102e] text-white hover:bg-[#a50d25]' : 'bg-white/5 text-[#9a7a6a] cursor-default'}`}>
                      {saving === s.id ? '…' : 'Sauv.'}
                    </button>
                    <button onClick={() => remove(s.id)} className={`${BTN} border border-white/10 text-[#9a7a6a] hover:text-[#c8102e] hover:border-[#c8102e]`}>✕</button>
                  </div>
                </td>
              </tr>
            );
          })}

          {adding && (
            <tr className="border-b border-[#c8102e]/30 bg-[#c8102e]/5">
              <td className="py-2 pr-3"><Field value={newSet.name_fr ?? ''} onChange={v => setNewSet(p => ({ ...p, name_fr: v }))} placeholder="Nom FR *" /></td>
              <td className="py-2 pr-3"><Field value={newSet.name_nl ?? ''} onChange={v => setNewSet(p => ({ ...p, name_nl: v }))} placeholder="Nom NL" /></td>
              <td className="py-2 pr-3"><Field value={newSet.name_en ?? ''} onChange={v => setNewSet(p => ({ ...p, name_en: v }))} placeholder="Nom EN" /></td>
              <td className="py-2 pr-3"><Field value={newSet.description_fr ?? ''} onChange={v => setNewSet(p => ({ ...p, description_fr: v }))} placeholder="Description" /></td>
              <td className="py-2 pr-3">
                <input type="number" step="0.5" className={`${INPUT} w-20`} value={newSet.price ?? 0}
                  onChange={e => setNewSet(p => ({ ...p, price: parseFloat(e.target.value) }))} />
              </td>
              <td className="py-2 pr-3">
                <input type="number" className={`${INPUT} w-14`} value={newSet.min_people ?? 1}
                  onChange={e => setNewSet(p => ({ ...p, min_people: parseInt(e.target.value) }))} />
              </td>
              <td className="py-2 pr-3">
                <input type="number" className={`${INPUT} w-14`} placeholder="∞"
                  onChange={e => setNewSet(p => ({ ...p, max_people: e.target.value ? parseInt(e.target.value) : null }))} />
              </td>
              <td className="py-2 text-center">
                <div className="flex gap-1 justify-center">
                  <button onClick={addSet} className={`${BTN} bg-[#c8102e] text-white hover:bg-[#a50d25]`}>Ajouter</button>
                  <button onClick={() => setAdding(false)} className={`${BTN} border border-white/10 text-[#9a7a6a]`}>✕</button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!adding && (
        <button onClick={() => setAdding(true)} className={`${BTN} mt-4 border border-white/10 text-[#9a7a6a] hover:text-[#f5ece6] hover:border-white/30`}>
          + Ajouter un menu
        </button>
      )}
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const router = useRouter();
  const [tab, setTab]     = useState<'items' | 'sets'>('items');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [sets, setSets]   = useState<SetMenu[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [ri, rs] = await Promise.all([
      fetch('/api/admin/items').then(r => r.json()),
      fetch('/api/admin/sets').then(r => r.json()),
    ]);
    setItems(Array.isArray(ri) ? ri : []);
    setSets(Array.isArray(rs) ? rs : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  }

  return (
    <div className="min-h-screen bg-[#0e0a08] text-[#f5ece6]">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-brand text-xl text-[#c8102e]">ORIENT EXPRESS</span>
          <span className="text-[#9a7a6a] text-xs uppercase tracking-widest">Administration</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="text-xs text-[#9a7a6a] hover:text-[#f5ece6] transition-colors uppercase tracking-wider">
            ↗ Voir le site
          </a>
          <button onClick={logout} className={`${BTN} border border-white/10 text-[#9a7a6a] hover:text-[#c8102e] hover:border-[#c8102e]`}>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/10 px-6">
        <div className="flex gap-0">
          {([['items', 'Articles du menu'], ['sets', "Menus & Fondue"]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-5 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors ${tab === id ? 'border-[#c8102e] text-[#f5ece6]' : 'border-transparent text-[#9a7a6a] hover:text-[#f5ece6]'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="px-6 py-8">
        {loading ? (
          <p className="text-[#9a7a6a] text-sm">Chargement…</p>
        ) : tab === 'items' ? (
          <MenuItemsTab items={items} onRefresh={fetchData} />
        ) : (
          <SetMenusTab sets={sets} onRefresh={fetchData} />
        )}
      </main>
    </div>
  );
}
