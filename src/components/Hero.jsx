export default function Hero({ onNavigate }) {
  return (
    <section className="relative bg-neutral-50 min-h-[640px] lg:min-h-[720px] flex flex-col lg:flex-row items-stretch justify-center overflow-hidden">
      
      {/* Left Image */}
      <div className="w-full lg:w-1/2 min-h-[400px] lg:h-auto bg-cover bg-center relative" style={{ backgroundImage: "url(/images/hero-cabello.jpg)" }}>
        {/* Soft fade towards center */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-white/95 hidden lg:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/50 to-white/95 lg:hidden" />
        
        {/* Left Card */}
        <div className="absolute bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] bg-white rounded-[24px] shadow-lg p-3 pr-4 flex items-center gap-4">
          <div className="w-[84px] h-[84px] rounded-full bg-primary-pale flex items-center justify-center flex-shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-10 h-10 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c-4.418 0-8 3.582-8 8h16c0-4.418-3.582-8-8-8z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z" />
             </svg>
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-serif text-primary text-lg leading-tight mb-0.5">Mechitas Mechonas</h3>
            <p className="text-[9px] text-dark font-bold tracking-widest uppercase mb-2">Accesorios para el cabello</p>
            <button 
              onClick={() => {
                if (onNavigate) {
                  onNavigate("shop");
                  setTimeout(() => {
                    const el = document.getElementById("catalogo");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
              className="bg-primary hover:bg-primary-dark text-white text-sm font-bold py-1.5 px-5 rounded-full transition-colors shadow-sm"
            >
              Ver colección
            </button>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className="w-full lg:w-1/2 min-h-[400px] lg:h-auto bg-cover bg-center relative" style={{ backgroundImage: "url(/images/hero-mascota.jpg)" }}>
        {/* Soft fade towards center */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/50 to-white/95 hidden lg:block" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white/95 lg:hidden" />
        
        {/* Right Card */}
        <div className="absolute bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] bg-[#f7f9f6] rounded-[24px] shadow-lg p-3 pr-4 flex items-center gap-4">
          <div className="w-[84px] h-[84px] rounded-full bg-[#E3EBE0] flex items-center justify-center flex-shrink-0 border border-green-dark/10">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="w-10 h-10 text-[#6B8064]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5c-1.5 0-2.5-.5-2.5-1.5s1-1.5 2.5-1.5 2.5.5 2.5 1.5-1 1.5-2.5 1.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10a2 2 0 100-4 2 2 0 000 4zM16 10a2 2 0 100-4 2 2 0 000 4z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.5A9.5 9.5 0 1012 2.5a9.5 9.5 0 000 19z" />
             </svg>
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-serif text-[#6B8064] text-lg leading-tight mb-0.5">Mechitas Mechonas Pet</h3>
            <p className="text-[9px] text-dark font-bold tracking-widest uppercase mb-2">Accesorios para mascotas</p>
            <button 
              onClick={() => {
                if (onNavigate) {
                  onNavigate("shop");
                  setTimeout(() => {
                    const el = document.getElementById("catalogo");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
              className="bg-[#8AA082] hover:bg-[#6B8064] text-white text-sm font-bold py-1.5 px-5 rounded-full transition-colors shadow-sm"
            >
              Ver colección Pet
            </button>
          </div>
        </div>
      </div>

      {/* Center text overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none text-center px-4 top-[-60px] lg:top-[-100px]">
        {/* Glow behind text to ensure legibility */}
        <div className="absolute w-[340px] h-[340px] lg:w-[450px] lg:h-[450px] bg-white/75 blur-3xl rounded-full" />
        
        <div className="relative z-10 flex flex-col items-center">
          <p className="font-serif text-primary text-2xl sm:text-[28px] mb-2 tracking-wide">Bienvenidos a</p>
          <div className="flex flex-col items-center justify-center leading-[0.75] mb-6">
            <span className="font-display text-[75px] sm:text-[90px] lg:text-[110px] text-dark">Mechitas</span>
            <span className="font-display text-[75px] sm:text-[90px] lg:text-[110px] text-dark pl-12 lg:pl-16">Mechonas</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary mb-3">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
          <p className="font-body text-dark font-semibold text-[13px] sm:text-[15px] max-w-[300px] leading-relaxed text-center">
            Accesorios hechos con amor para quienes llenan de alegría nuestros días.
          </p>
        </div>
      </div>
    </section>
  );
}
