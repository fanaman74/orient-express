const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Menu', href: '#menu' },
  { label: 'Horaires', href: '#informations' },
  { label: 'Contact', href: '#informations' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border py-16 px-6 bg-bg-alt">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-8 text-center">
        <a href="#accueil" className="font-display uppercase tracking-[0.15em] text-xl text-accent no-underline font-semibold">
          ORIENT EXPRESS
        </a>

        <nav className="flex flex-wrap justify-center gap-6">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-text-muted hover:text-accent transition-colors uppercase tracking-wider"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="text-text-muted text-sm space-y-1">
          <p>Wandstraat 16, 1020 Laeken, Bruxelles</p>
          <a href="tel:+3222620879" className="hover:text-accent transition-colors block">
            02 262 08 79
          </a>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-border" />

        <p className="text-text-muted text-xs">
          © {new Date().getFullYear()} Orient Express — Cuisine Chinoise. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
