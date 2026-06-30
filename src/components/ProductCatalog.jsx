import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"
import { fetchPublicProducts } from "../lib/catalog"

export default function ProductCatalog({
  searchQuery, setSearchQuery,
  selectedCategory, setSelectedCategory,
  onAddToCart,
}) {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    fetchPublicProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  const categories = [
    { key: "all",  label: "Todos" },
    { key: "pelo", label: "Niñas / Mujeres" },
    { key: "pet",  label: "Mascotas" },
  ]

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === "all" || p.category === selectedCategory
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <section id="catalogo" className="bg-neutral-50 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Encabezado */}
        <div className="flex flex-col gap-2 mb-8">
          <p className="font-body text-xs font-bold uppercase tracking-[.15em] text-primary">
            Nuestra colección
          </p>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-dark leading-tight">
            Catálogo de Productos
          </h2>
          <p className="font-body text-neutral-500 text-sm max-w-lg">
            Explora nuestra selección de accesorios artesanales para el cabello y
            mascotas. Filtra por categoría o busca directamente.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button key={cat.key} onClick={() => setSelectedCategory(cat.key)}
                className={`font-body font-bold text-[13px] rounded-full px-5 py-2.5 border transition-all duration-200 ${
                  selectedCategory === cat.key
                    ? "bg-dark text-white border-dark"
                    : "bg-white text-dark/70 border-neutral-200 hover:border-primary hover:text-primary"
                }`}>
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex-1 sm:max-w-sm">
            <input type="text" id="search-input" placeholder="Buscar productos..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-full px-5 py-2.5 text-sm font-body text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-neutral-500" />
          </div>
        </div>

        {/* Grilla */}
        {loading ? (
          <div className="text-center py-16">
            <p className="font-body text-neutral-500 text-sm">Cargando productos...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((product, i) => (
              <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-display font-bold text-xl text-dark mb-2">Sin resultados</p>
            <p className="font-body text-neutral-500 text-sm">
              No encontramos productos que coincidan con tu búsqueda. Intenta con otro término o categoría.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
