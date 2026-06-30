import { useState } from "react"

export default function ProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  // Precio efectivo: si está en oferta y tiene sale_price, ese es el precio a cobrar
  const onSale = product.on_sale && product.sale_price != null
  const displayPrice = onSale ? product.sale_price : product.price

  const handleAdd = () => {
    // Se agrega al carrito con el precio efectivo (oferta si aplica)
    onAddToCart?.({ ...product, price: displayPrice })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const disc = onSale
    ? Math.round((1 - product.sale_price / product.price) * 100)
    : null

  const isPet = product.category === "pet"

  return (
    <article
      className="group relative flex flex-col rounded-3xl overflow-hidden border border-neutral-200 transition-all duration-300 hover:-translate-y-2 bg-white hover:shadow-primary hover:border-primary/30"
    >
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {!imgErr && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-neutral-500 font-body text-sm font-semibold">Imagen no disponible</span>
          </div>
        )}

        {/* Etiqueta de oferta */}
        {onSale && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-primary text-white">
            ¡Oferta!{disc ? ` -${disc}%` : ""}
          </span>
        )}
      </div>

      {/* Cuerpo */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <h3 className="font-display font-semibold text-[14px] text-dark leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Descripción corta */}
        {product.description && (
          <p className="font-body text-xs text-neutral-500 line-clamp-2 -mt-1">
            {product.description}
          </p>
        )}

        {/* Tallas */}
        {product.sizes?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((s) => (
              <span key={s} className="font-body text-[10px] font-semibold text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-full px-2 py-0.5">
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Precio */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="font-display font-black text-[18px] text-primary">
            ${displayPrice.toLocaleString("es-CL")}
          </span>
          {onSale && (
            <span className="font-display text-neutral-500 text-[12px] line-through">
              ${product.price.toLocaleString("es-CL")}
            </span>
          )}
        </div>

        {/* Botón agregar */}
        <button
          onClick={handleAdd}
          id={`add-product-${product.id}`}
          className={`mt-1 w-full flex items-center justify-center rounded-full py-2.5 font-bold text-sm transition-all duration-200 active:scale-95 ${
            added
              ? "bg-dark text-white"
              : "bg-primary hover:bg-primary-dark text-white shadow-primary"
          }`}
        >
          {added ? "Agregado" : "Agregar al carrito"}
        </button>
      </div>
    </article>
  )
}
