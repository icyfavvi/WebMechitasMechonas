import { ArrowRight, Sparkles } from "lucide-react"
import ProductCard from "../components/ProductCard"

const PRODUCTS = [
  { id:1, name:"Lazo de Satén Perla — Edición Romántica", price:5990, originalPrice:7990,
    image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80",
    isNew:false, rating:5, reviews:42 },
  { id:2, name:"Scrunchie de Terciopelo Rosa Palo", price:3490,
    image:"https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&q=80",
    isNew:true, rating:4.5, reviews:28 },
  { id:3, name:"Set de Pinches Perla × 6 — Coquette Edition", price:6990,
    image:"https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=500&q=80",
    isNew:true, rating:5, reviews:61 },
  { id:4, name:"Cintillo Floral Artesanal — Primavera", price:8490, originalPrice:9990,
    image:"https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&q=80",
    isNew:false, rating:4, reviews:19 },
]

const CATEGORIES = [
  { label:"Lazos", emoji:"🎀" }, { label:"Scrunchies", emoji:"💫" },
  { label:"Pinches", emoji:"✨" }, { label:"Sets", emoji:"🌸" },
  { label:"Novedades", emoji:"💝" },
]

function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient" aria-label="Sección bienvenida">
      <div className="absolute inset-0 bg-ribbon-stripe pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-coquette-blush/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-16 w-56 h-56 rounded-full bg-coquette-petal/40 blur-2xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-5 animate-fade-up">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-coquette-blush text-coquette-burgundy text-xs font-body font-semibold tracking-widest uppercase shadow-soft">
              <Sparkles size={12} />
              Hecho a mano con amor 🎀
            </span>

            <h1 className="font-display text-coquette-ink text-4xl sm:text-5xl lg:text-6xl leading-[1.1] max-w-xl">
              Accesorios que{" "}
              <span className="relative inline-block">
                <span className="text-coquette-burgundy">cuentan</span>
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-coquette-petal rounded-full" />
              </span>{" "}
              tu historia
            </h1>

            <p className="font-body text-coquette-mist text-base sm:text-lg leading-relaxed max-w-md">
              Lazos, scrunchies y pinches artesanales para mujeres que abrazan su feminidad con orgullo. Cada pieza es única, como tú. 🌸
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-1">
              <a href="#catalogo" className="inline-flex items-center justify-center gap-2 rounded-full py-3 px-8 bg-coquette-burgundy text-white font-body font-semibold text-sm shadow-bloom hover:bg-coquette-mauve hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0">
                Ver Catálogo <ArrowRight size={15} />
              </a>
              <a href="#novedades" className="inline-flex items-center justify-center gap-2 rounded-full py-3 px-8 bg-transparent border border-coquette-rose text-coquette-burgundy font-body font-semibold text-sm hover:bg-coquette-blush transition-all duration-300">
                Novedades ✨
              </a>
            </div>

            <div className="flex gap-8 mt-3">
              {[{value:"+2.4k",label:"Clientas felices"},{value:"100%",label:"Artesanal"},{value:"⭐ 4.9",label:"Valoración"}].map((s) => (
                <div key={s.label} className="flex flex-col items-center lg:items-start gap-0.5">
                  <span className="font-display text-coquette-burgundy text-xl leading-none">{s.value}</span>
                  <span className="font-body text-coquette-mist text-[11px]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex-1 flex items-center justify-center lg:justify-end animate-fade-in">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 rounded-full bg-coquette-blush/60 blur-xl animate-float" />
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-coquette-pearl shadow-bloom">
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80"
                  alt="Accesorios para el cabello artesanales"
                  className="w-full h-full object-cover object-center scale-105"
                />
              </div>
              <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-white shadow-petal flex flex-col items-center justify-center animate-bounce-soft">
                <span className="text-xl leading-none">🎀</span>
                <span className="font-body text-[9px] text-coquette-burgundy font-bold leading-tight text-center">NEW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Categories() {
  return (
    <section className="py-10 px-4 sm:px-6 bg-coquette-pearl border-y border-coquette-dust/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <button key={cat.label} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-white border border-coquette-dust/50 font-body text-sm text-coquette-mist hover:bg-coquette-blush hover:border-coquette-rose hover:text-coquette-burgundy transition-all duration-300 shadow-soft hover:shadow-petal hover:-translate-y-0.5">
              <span>{cat.emoji}</span>{cat.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedProducts({ onAddToCart }) {
  return (
    <section id="catalogo" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="font-body text-xs text-coquette-mauve tracking-widest uppercase mb-2">✨ Curados para ti</p>
            <h2 className="font-display text-coquette-ink text-3xl sm:text-4xl leading-tight">Productos Destacados</h2>
          </div>
          <a href="#" className="inline-flex items-center gap-1.5 font-body text-sm text-coquette-burgundy hover:text-coquette-mauve transition-colors duration-300 group">
            Ver todo el catálogo
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {PRODUCTS.map((product, idx) => (
            <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${idx * 80}ms` }}>
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PromoBanner() {
  return (
    <section className="mx-4 sm:mx-6 lg:mx-8 mb-4 rounded-4xl overflow-hidden bg-hero-gradient relative">
      <div className="absolute inset-0 bg-ribbon-stripe pointer-events-none opacity-50" />
      <div className="relative max-w-6xl mx-auto px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <p className="font-display text-coquette-ink text-2xl sm:text-3xl leading-snug max-w-md">
            Envío gratis en compras sobre <span className="text-coquette-burgundy">$15.000</span> 🎀
          </p>
          <p className="font-body text-coquette-mist text-sm mt-1">Solo por esta semana · Envíos a todo Chile</p>
        </div>
        <a href="#catalogo" className="shrink-0 inline-flex items-center gap-2 rounded-full py-3 px-7 bg-coquette-burgundy text-white font-body font-semibold text-sm shadow-bloom hover:bg-coquette-mauve hover:-translate-y-0.5 transition-all duration-300">
          Aprovechar oferta <ArrowRight size={15} />
        </a>
      </div>
    </section>
  )
}

export default function Home({ onAddToCart }) {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts onAddToCart={onAddToCart} />
      <PromoBanner />
    </>
  )
}
