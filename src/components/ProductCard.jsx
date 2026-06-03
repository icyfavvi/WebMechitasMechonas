import { useState } from "react"
import { ShoppingBag, Heart, Star, Check } from "lucide-react"

export default function ProductCard({ product, onAddToCart }) {
  const [wished, setWished] = useState(false)
  const [added, setAdded] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const isPet = product.category === "pet"

  const handleAdd = () => {
    onAddToCart?.(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const disc = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <article className={`group relative flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-2
      ${isPet
        ? "bg-[#fffef7] border-[#f0dfa0] hover:shadow-gold"
        : "bg-white border-dust hover:shadow-rose"
      }`}
    >
      {/* Image area */}
      <div className={`relative aspect-square overflow-hidden
        ${isPet ? "bg-gradient-to-br from-gold-pale to-[#fff8dc]" : "bg-gradient-to-br from-teal-pale to-rose-blush"}`}>
        {!imgErr ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {isPet ? "🐾" : "🎀"}
          </div>
        )}

        {/* Badge */}
        {product.tag && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide
            ${product.tag === "nuevo"
              ? "bg-teal text-white"
              : "bg-rose-berry text-white"
            }`}>
            {product.tag === "nuevo" ? "✨ Nuevo" : `−${disc}%`}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setWished(w => !w)}
          aria-label="Favorito"
          className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center border transition-all duration-200 hover:scale-110
            ${wished
              ? "bg-rose-blush border-rose text-rose-berry"
              : "bg-white/80 border-white/60 text-dust hover:text-rose"
            }`}
        >
          <Heart size={15} className={wished ? "fill-rose-berry stroke-rose-berry" : ""} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        {/* Stars */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={11}
              className={i < Math.round(product.rating)
                ? isPet ? "fill-gold text-gold" : "fill-rose text-rose"
                : "fill-dust text-dust"
              }
            />
          ))}
          <span className="text-[11px] text-mist ml-1">({product.reviews})</span>
        </div>

        {/* Name */}
        <h3 className="font-display font-bold text-[15px] text-ink leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className={`font-body font-black text-lg ${isPet ? "text-teal-dark" : "text-rose-berry"}`}>
            ${product.price.toLocaleString("es-CL")}
          </span>
          {product.originalPrice && (
            <span className="font-body text-dust text-sm line-through">
              ${product.originalPrice.toLocaleString("es-CL")}
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleAdd}
          className={`mt-1 w-full flex items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-bold transition-all duration-200 active:scale-95
            ${added
              ? "bg-teal text-white"
              : isPet
                ? "bg-gold-pale text-gold-deep hover:bg-gold hover:text-white border border-gold/40"
                : "bg-rose-blush text-rose-berry hover:bg-rose-petal border border-rose-petal"
            }`}
        >
          {added ? <Check size={14} /> : <ShoppingBag size={14} />}
          {added ? "¡Añadido! 🎀" : "Añadir al carrito"}
        </button>
      </div>
    </article>
  )
}
