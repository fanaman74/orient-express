'use client';
import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Menu', href: '#menu' },
  { label: 'Horaires', href: '#informations' },
  { label: 'Contact', href: '#informations' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center transition-all duration-[400ms] ease-in-out ${scrolled ? 'bg-bg/95 backdrop-blur-md border-b border-border' : 'bg-transparent'}`}>
        <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center">
          <a href="#accueil" className="font-display uppercase tracking-[0.15em] text-lg text-accent no-underline whitespace-nowrap font-semibold">
            ORIENT EXPRESS
          </a>

          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-wider hover:text-accent transition-colors font-medium text-text"
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="tel:+3222620879"
            className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gold hover:text-accent transition-colors font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            02 262 08 79
          </a>

          <button
            className="md:hidden ml-auto flex flex-col justify-center gap-1.5 w-8 h-8"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-px w-6 bg-text transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
            <span className={`block h-px w-6 bg-text transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-bg/98 flex flex-col items-center justify-center gap-8 md:hidden">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-2xl font-display text-text hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a href="tel:+3222620879" className="text-gold text-lg mt-4">02 262 08 79</a>
        </div>
      )}
    </>
  );
}
