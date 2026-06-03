import { ArrowRight, Tag, Truck } from "lucide-react"

const PERKS = [
  { icon: Truck, title: "Envío gratis", desc: "En compras sobre $15.000" },
  { icon: Tag, title: "100% artesanal", desc: "Hecho a mano en Chile" },
]

export default function PromoBanner() {
  return (
    <section className="bg-teal py-16 relative overflow-hidden">
      {/* Background detail */}
      <div className="absolute inset-0 pointer-events-none"
        style={{backgroundImage:"radial-gradient(circle,rgba(255,255,255,.08) 1.5px,transparent 1.5px)",backgroundSize:"24px 24px"}}
      />
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-teal-dark/40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left: main message */}
          <div className="flex flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-2 bg-white/15 text-white text-xs font-bold uppercase tracking-widest rounded-full px-4 py-1.5">
              🌸 Oferta de la semana
            </span>
            <h2 className="font-display font-black text-white text-4xl sm:text-5xl leading-tight">
              Envío gratis en<br />
              compras sobre<br />
              <span className="text-gold">$15.000</span>
            </h2>
            <p className="text-white/75 font-body text-sm max-w-sm">
              Solo por esta semana. Envíos a todo Chile.
              Aprovecha y arma tu set favorito 🎀
            </p>
            <a
              href="#pelo"
              className="inline-flex w-fit items-center gap-2 bg-white text-teal-dark font-bold text-sm rounded-full px-7 py-3.5 hover:bg-teal-pale transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              Ver todos los productos
              <ArrowRight size={15} />
            </a>
          </div>

          {/* Right: perks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PERKS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{title}</p>
                  <p className="text-white/65 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
            {/* Newsletter mini */}
            <div className="bg-white/15 rounded-2xl p-5 border border-white/20 sm:col-span-2">
              <p className="font-bold text-white text-sm mb-1">Únete al club 🌸</p>
              <p className="text-white/65 text-xs mb-3">Descuentos exclusivos y novedades</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 min-w-0 bg-white/90 text-ink rounded-full px-4 py-2 text-xs font-body outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="bg-rose-berry hover:bg-rose-dark text-white font-bold text-xs rounded-full px-4 py-2 transition-colors whitespace-nowrap">
                  Suscribir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
