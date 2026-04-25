'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/admin/dashboard');
    } else {
      setError('Identifiants incorrects.');
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0a08] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="font-brand text-2xl text-[#c8102e] tracking-wider">ORIENT EXPRESS</span>
          <p className="text-[#9a7a6a] text-xs uppercase tracking-widest mt-2">Administration</p>
        </div>

        <form onSubmit={handleSubmit} className="border border-white/10 p-8 space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#9a7a6a] mb-2">
              Utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full bg-[#1a100c] border border-white/10 px-4 py-2.5 text-[#f5ece6] text-sm focus:outline-none focus:border-[#c8102e] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#9a7a6a] mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full bg-[#1a100c] border border-white/10 px-4 py-2.5 text-[#f5ece6] text-sm focus:outline-none focus:border-[#c8102e] transition-colors"
            />
          </div>

          {error && <p className="text-[#c8102e] text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c8102e] text-white py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#a50d25] transition-colors disabled:opacity-50"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
