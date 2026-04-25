export default function Hero() {
  return (
    <section id="accueil" className="relative h-screen flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1920"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://videos.pexels.com/video-files/2620043/2620043-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black/60" />

      {/* Red gradient overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />

      <div className="relative z-10 text-center px-6 flex flex-col items-center gap-5">
        <span className="text-xs uppercase tracking-[0.4em] text-gold font-semibold hero-animate hero-animate-delay-1">
          Cuisine Chinoise Authentique · Bruxelles
        </span>

        <h1 className="font-hero text-5xl md:text-6xl lg:text-7xl max-w-[700px] hero-animate hero-animate-delay-2 font-bold leading-tight">
          Orient Express
        </h1>

        <div className="w-16 h-px bg-accent hero-animate hero-animate-delay-3" />

        <p className="text-text-muted font-medium max-w-[480px] hero-animate hero-animate-delay-3 leading-relaxed">
          Des saveurs authentiques de la cuisine chinoise traditionnelle, à déguster sur place ou à emporter à De Wand.
        </p>

        <div className="flex items-center gap-4 hero-animate hero-animate-delay-4">
          <a
            href="#menu"
            className="inline-block bg-accent text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-accent-alt transition-colors font-medium"
          >
            Voir le Menu
          </a>
          <a
            href="#informations"
            className="inline-block border border-border text-text-muted px-8 py-3 text-sm uppercase tracking-wider hover:border-accent hover:text-accent transition-colors"
          >
            Nous Trouver
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-text-muted">
        <span className="text-xs uppercase tracking-wider">Découvrir</span>
        <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
