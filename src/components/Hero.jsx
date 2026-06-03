import { ArrowRight, Sparkles, Star } from "lucide-react"

const FloatingShape = ({ className, delay = "0s" }) => (
  <div
    className={`absolute rounded-full opacity-30 animate-float pointer-events-none ${className}`}
    style={{ animationDelay: delay }}
  />
)

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-sand min-h-[600px] flex items-center">
      {/* Layered background blobs */}
      <FloatingShape className="w-96 h-96 bg-teal-light -top-24 -right-24" delay="0s" />
      <FloatingShape className="w-64 h-64 bg-rose-blush -bottom-16 left-10" delay="1s" />
      <FloatingShape className="w-48 h-48 bg-gold-pale top-20 left-1/3" delay="0.5s" />

      {/* Dot pattern */}
      <div className="absolute inset-0 pointer-events-none"
        style={{backgroundImage:"radial-gradient(circle,rgba(93,191,176,.12) 1.5px,transparent 1.5px)",backgroundSize:"28px 28px"}}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-20 lg:py-28 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Text side */}
          <div className="flex flex-col gap-6 animate-fade-up">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 bg-teal text-white rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase shadow-teal">
              <Sparkles size={12} />
              Artesanal · Hecho en Chile
            </div>

            {/* Title */}
            <div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-ink leading-[1.0] tracking-tight">
                Para las
                <br />
                <span className="text-teal italic">niñas</span>
                <br />
                y sus
                <br />
                <span className="relative inline-block">
                  <span className="text-rose-berry">mascotas</span>
                  <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                    <path d="M0 5 Q50 0 100 5 Q150 10 200 5" stroke="#f29eab" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
            </div>

            <p className="font-body text-mist text-lg leading-relaxed max-w-md">
              Lazos, scrunchies, pinches y accesorios para mascotas
              hechos con amor. Cada pieza es única como tú. ✨
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6 py-1">
              {[
                { val: "+2.4k", lbl: "clientas" },
                { val: "100%", lbl: "artesanal" },
                { val: "4.9", lbl: "estrellas", icon: true },
              ].map(s => (
                <div key={s.lbl} className="flex flex-col">
                  <span className="font-display font-black text-2xl text-teal-dark flex items-center gap-1">
                    {s.icon && <Star size={16} className="fill-gold text-gold" />}
                    {s.val}
                  </span>
                  <span className="font-body text-xs text-mist">{s.lbl}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="#pelo"
                className="inline-flex items-center gap-2 bg-teal hover:bg-teal-dark text-white font-bold text-sm rounded-full px-7 py-3.5 shadow-teal hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Ver Accesorios Pelo
                <ArrowRight size={16} />
              </a>
              <a
                href="#mascotas"
                className="inline-flex items-center gap-2 bg-white hover:bg-rose-blush text-rose-berry font-bold text-sm rounded-full px-7 py-3.5 border-2 border-rose-petal hover:border-rose transition-all duration-200"
              >
                Para Mascotas 🐾
              </a>
            </div>
          </div>

          {/* Image side */}
          <div className="relative flex items-center justify-center animate-fade-in">
            {/* Decorative ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[340px] h-[340px] rounded-full border-2 border-dashed border-teal-light opacity-60 animate-pulse-soft" />
            </div>

            {/* Main image */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[340px] lg:h-[340px] rounded-full overflow-hidden border-[6px] border-white shadow-lift">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=680&q=85"
                alt="Niña con accesorios artesanales"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Floating cards */}
            <div className="absolute -left-4 top-12 bg-white rounded-2xl px-4 py-3 shadow-card flex items-center gap-3 animate-scale-in" style={{animationDelay:".3s"}}>
              <div className="w-9 h-9 rounded-full bg-teal-pale flex items-center justify-center text-lg">🎀</div>
              <div>
                <p className="font-bold text-xs text-ink">Accesorios Pelo</p>
                <p className="text-[11px] text-mist">+40 diseños únicos</p>
              </div>
            </div>

            <div className="absolute -right-4 bottom-16 bg-white rounded-2xl px-4 py-3 shadow-card flex items-center gap-3 animate-scale-in" style={{animationDelay:".5s"}}>
              <div className="w-9 h-9 rounded-full bg-gold-pale flex items-center justify-center text-lg">🐾</div>
              <div>
                <p className="font-bold text-xs text-ink">Para Mascotas</p>
                <p className="text-[11px] text-mist">Sets dúo disponibles</p>
              </div>
            </div>

            <div className="absolute right-8 top-0 bg-teal text-white rounded-2xl px-3 py-2 shadow-teal text-center animate-scale-in" style={{animationDelay:".2s"}}>
              <p className="font-black text-lg font-display leading-none">NEW</p>
              <p className="text-[10px] opacity-80">🎀 2025</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
