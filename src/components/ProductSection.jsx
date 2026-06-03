import { ArrowRight } from "lucide-react"
import ProductCard from "./ProductCard"
import { HAIR_PRODUCTS, PET_PRODUCTS } from "../data/products"

const SECTION_CONFIG = {
  pelo: {
    id: "pelo",
    eyebrow: "✨ Para ti, princesa",
    title: "Accesorios para el Pelo",
    emoji: "🎀",
    tagline: "Lazos, scrunchies y pinches artesanales hechos a mano",
    bg: "bg-sand",
    accentBg: "bg-teal-pale",
    accentText: "text-teal-dark",
    products: HAIR_PRODUCTS,
  },
  pet: {
    id: "mascotas",
    eyebrow: "🐾 También para ellos",
    title: "Accesorios para Mascotas",
    emoji: "🐾",
    tagline: "Porque tu mascota también merece brillar",
    bg: "bg-gold-pale",
    accentBg: "bg-gold-pale",
    accentText: "text-gold-deep",
    products: PET_PRODUCTS,
  },
}

export default function ProductSection({ type, onAddToCart }) {
  const cfg = SECTION_CONFIG[type]

  return (
    <section id={cfg.id} className={`${cfg.bg} py-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div className="flex flex-col gap-2">
            <p className={`font-body text-xs font-bold uppercase tracking-[.15em] ${cfg.accentText}`}>
              {cfg.eyebrow}
            </p>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-ink leading-tight">
              {cfg.title} <span>{cfg.emoji}</span>
            </h2>
            <p className="font-body text-mist text-sm max-w-sm">{cfg.tagline}</p>
          </div>

          <a
            href="#"
            className={`inline-flex items-center gap-1.5 font-bold text-sm ${cfg.accentText} group transition-all`}
          >
            Ver colección completa
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {cfg.products.map((product, i) => (
            <div
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex justify-center">
          <a
            href="#"
            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm border-2 transition-all duration-200 hover:-translate-y-0.5
              ${type === "pelo"
                ? "border-teal text-teal-dark hover:bg-teal hover:text-white hover:shadow-teal"
                : "border-gold-deep text-gold-deep hover:bg-gold hover:text-white hover:shadow-gold"
              }`}
          >
            Ver todos los {type === "pelo" ? "accesorios" : "accesorios para mascotas"}
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  )
}
