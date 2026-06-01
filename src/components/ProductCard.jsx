import { useState } from "react"
import { ShoppingBag, Heart, Star } from "lucide-react"

export default function ProductCard({ product, onAddToCart }) {
  const [wished, setWished]   = useState(false)
  const [added, setAdded]     = useState(false)
  const [imgError, setImgError] = useState(false)

  const handleAddToCart = () => {
    onAddToCart?.(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <article className="group relative flex flex-col rounded-4xl bg-coquette-pearl shadow-petal hover:shadow-bloom hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="relative overflow-hidden rounded-t-4xl bg-coquette-lace aspect-[4/4.5]">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-hero-gradient flex items-center justify-center">
            <span className="text-6xl select-none opacity-40">🎀</span>
          </div>
        )}

        {(product.isNew || discount) && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-body font-semibold tracking-widest uppercase bg-coquette-mauve/90 text-white shadow-soft">
            {product.isNew ? "Nuevo" : `-${discount}%`}
          </span>
        )}

        <button
          onClick={() => setWished((w) => !w)}
          aria-label={wished ? "Quitar de favoritos" : "Agregar a favoritos"}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-soft transition-transform duration-300 hover:scale-110 active:scale-95"
        >
          <Heart
            size={16}
            className={wished ? "fill-coquette-mauve stroke-coquette-mauve" : "stroke-coquette-mist"}
          />
        </button>
      </div>

      <div className="flex flex-col flex-1 gap-2 p-4 pt-3">
        {product.rating && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.round(product.rating)
                  ? "fill-coquette-mauve stroke-coquette-mauve"
                  : "fill-coquette-dust stroke-coquette-dust"}
              />
            ))}
            {product.reviews && (
              <span className="text-[11px] font-body text-coquette-mist ml-1">({product.reviews})</span>
            )}
          </div>
        )}

        <h3 className="font-display text-coquette-ink text-base leading-snug line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="font-body font-semibold text-coquette-burgundy text-lg">
            ${product.price.toLocaleString("es-CL")}
          </span>
          {product.originalPrice && (
            <span className="font-body text-coquette-dust text-sm line-through">
              ${product.originalPrice.toLocaleString("es-CL")}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className={`mt-2 w-full flex items-center justify-center gap-2 rounded-full py-2.5 px-4 font-body text-sm font-semibold tracking-wide transition-all duration-300 active:scale-95 ${
            added
              ? "bg-coquette-burgundy text-white scale-[0.98]"
              : "bg-coquette-blush text-coquette-burgundy hover:bg-coquette-petal hover:shadow-petal"
          }`}
        >
          <ShoppingBag size={15} />
          {added ? "¡Añadido! 🎀" : "Añadir al carrito"}
        </button>
      </div>
    </article>
  )
}
