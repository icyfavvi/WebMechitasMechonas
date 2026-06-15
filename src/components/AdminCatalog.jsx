// src/components/AdminCatalog.jsx
// Edición del catálogo desde el panel admin: crear, editar, eliminar productos,
// con precio de oferta, tallas y descripción.

import { useState, useEffect } from "react"
import {
  fetchAllProducts, createProduct, updateProduct, deleteProduct,
} from "../lib/catalog"

const EMPTY = {
  name: "", description: "", price: "", sale_price: "", on_sale: false,
  sizes: "", category: "pelo", image: "", active: true,
}

function fmtCLP(n) { return `$${Number(n).toLocaleString("es-CL")}` }

export default function AdminCatalog() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [editing,  setEditing]  = useState(null) // null | "new" | product
  const [form,     setForm]     = useState(EMPTY)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState("")

  const load = () => {
    setLoading(true)
    fetchAllProducts().then(setProducts).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openNew = () => { setForm(EMPTY); setEditing("new"); setError("") }
  const openEdit = (p) => {
    setForm({
      name: p.name ?? "", description: p.description ?? "",
      price: String(p.price ?? ""), sale_price: p.sale_price != null ? String(p.sale_price) : "",
      on_sale: p.on_sale ?? false, sizes: (p.sizes ?? []).join(", "),
      category: p.category ?? "pelo", image: p.image ?? "", active: p.active ?? true,
    })
    setEditing(p)
    setError("")
  }
  const closeForm = () => { setEditing(null); setForm(EMPTY); setError("") }
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setError("")
    if (!form.name.trim()) { setError("El nombre es obligatorio."); return }
    const price = parseInt(form.price, 10)
    if (!price || price <= 0) { setError("Ingresa un precio válido."); return }

    let salePrice = null
    if (form.on_sale) {
      salePrice = parseInt(form.sale_price, 10)
      if (!salePrice || salePrice <= 0) { setError("Ingresa un precio de oferta válido."); return }
      if (salePrice >= price) { setError("El precio de oferta debe ser menor al precio normal."); return }
    }

    setSaving(true)
    const payload = {
      name:        form.name.trim(),
      description: form.description.trim(),
      price:       price,
      sale_price:  salePrice,
      on_sale:     form.on_sale,
      sizes:       form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      category:    form.category,
      image:       form.image.trim(),
      active:      form.active,
    }
    try {
      if (editing === "new") await createProduct(payload)
      else await updateProduct(editing.id, payload)
      closeForm()
      load()
    } catch {
      setError("No se pudo guardar. Verifica tu conexión y permisos de admin.")
    }
    setSaving(false)
  }

  const handleDelete = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.name}" del catálogo?`)) return
    try { await deleteProduct(p.id); load() }
    catch { alert("No se pudo eliminar.") }
  }

  const toggleActive = async (p) => {
    try { await updateProduct(p.id, { active: !p.active }); load() }
    catch { alert("No se pudo cambiar el estado.") }
  }

  const inp = "w-full bg-white border border-dust rounded-xl px-4 py-2.5 text-sm font-body text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all placeholder:text-mist"

  // ── Formulario ─────────────────────────────────────────────────────────────
  if (editing) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-ink">
            {editing === "new" ? "Nuevo producto" : "Editar producto"}
          </h3>
          <button onClick={closeForm}
            className="font-body text-sm font-semibold text-mist hover:text-ink px-3 py-1.5 rounded-full hover:bg-sand transition-all">
            Cancelar
          </button>
        </div>

        {error && (
          <div className="bg-rose-blush border border-rose-berry/30 rounded-xl px-4 py-3">
            <p className="font-body text-xs text-rose-berry font-semibold">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="font-body text-sm font-semibold text-ink mb-1.5 block">Nombre</label>
            <input className={inp} placeholder="Ej: Lazo de Satén Perla"
              value={form.name} onChange={(e) => setField("name", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="font-body text-sm font-semibold text-ink mb-1.5 block">Descripción</label>
            <textarea className={`${inp} resize-none`} rows={2} placeholder="Describe el producto..."
              value={form.description} onChange={(e) => setField("description", e.target.value)} />
          </div>

          <div>
            <label className="font-body text-sm font-semibold text-ink mb-1.5 block">Precio normal (CLP)</label>
            <input type="number" className={inp} placeholder="20000"
              value={form.price} onChange={(e) => setField("price", e.target.value)} />
          </div>
          <div>
            <label className="font-body text-sm font-semibold text-ink mb-1.5 block">Categoría</label>
            <select className={`${inp} cursor-pointer`}
              value={form.category} onChange={(e) => setField("category", e.target.value)}>
              <option value="pelo">Niñas / Mujeres</option>
              <option value="pet">Mascotas</option>
            </select>
          </div>

          {/* Oferta */}
          <div className="sm:col-span-2 bg-sand rounded-xl p-4 flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.on_sale}
                onChange={(e) => setField("on_sale", e.target.checked)}
                className="w-4 h-4 accent-rose-berry" />
              <span className="font-body text-sm font-semibold text-ink">Poner en oferta</span>
            </label>
            {form.on_sale && (
              <div>
                <label className="font-body text-sm font-semibold text-ink mb-1.5 block">
                  Precio de oferta (CLP)
                </label>
                <input type="number" className={inp} placeholder="17000"
                  value={form.sale_price} onChange={(e) => setField("sale_price", e.target.value)} />
                <p className="font-body text-xs text-mist mt-1.5">
                  En la tienda aparecerá tachado el precio normal y se mostrará el de oferta con la etiqueta "¡Oferta!".
                </p>
              </div>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="font-body text-sm font-semibold text-ink mb-1.5 block">
              Tallas <span className="text-mist font-normal">(separadas por coma)</span>
            </label>
            <input className={inp} placeholder="Ej: S, M, L  —  o  —  Único"
              value={form.sizes} onChange={(e) => setField("sizes", e.target.value)} />
          </div>

          <div className="sm:col-span-2">
            <label className="font-body text-sm font-semibold text-ink mb-1.5 block">URL de imagen</label>
            <input className={inp} placeholder="https://..."
              value={form.image} onChange={(e) => setField("image", e.target.value)} />
            {form.image && (
              <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-dust">
                <img src={form.image} alt="vista previa" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.active}
            onChange={(e) => setField("active", e.target.checked)}
            className="w-4 h-4 accent-teal" />
          <span className="font-body text-sm text-ink">Visible en la tienda (activo)</span>
        </label>

        <button onClick={handleSave} disabled={saving}
          className="w-full bg-ink hover:bg-ink/90 disabled:opacity-60 text-white font-bold rounded-full py-3.5 transition-all text-sm">
          {saving ? "Guardando..." : "Guardar producto"}
        </button>
      </div>
    )
  }

  // ── Lista ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg text-ink">Catálogo</h3>
        <button onClick={openNew}
          className="bg-ink hover:bg-ink/90 text-white font-bold rounded-full px-5 py-2.5 text-sm transition-all">
          Nuevo producto
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-dust p-12 text-center">
          <p className="font-body text-sm text-mist">Cargando...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dust p-12 text-center">
          <p className="font-display font-bold text-lg text-ink mb-2">Catálogo vacío</p>
          <p className="font-body text-sm text-mist">Agrega tu primer producto.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((p) => (
            <div key={p.id}
              className="bg-white rounded-2xl border border-dust p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-sand flex-shrink-0 border border-dust/30">
                  {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-bold text-sm text-ink truncate">{p.name}</span>
                    {p.on_sale && (
                      <span className="text-xs font-bold rounded-full px-2 py-0.5 bg-rose-berry text-white">
                        ¡Oferta!
                      </span>
                    )}
                    {!p.active && (
                      <span className="text-xs font-semibold rounded-full px-2 py-0.5 bg-sand text-mist border border-dust">
                        Oculto
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-mist mt-0.5">
                    {p.on_sale && p.sale_price
                      ? <>
                          <span className="line-through">{fmtCLP(p.price)}</span>
                          {" "}<span className="text-rose-berry font-semibold">{fmtCLP(p.sale_price)}</span>
                        </>
                      : fmtCLP(p.price)}
                    {p.sizes?.length > 0 && ` · Tallas: ${p.sizes.join(", ")}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(p)}
                  className="font-body font-semibold text-xs text-mist hover:text-ink px-3 py-1.5 rounded-full border border-dust hover:border-ink/30 transition-all">
                  {p.active ? "Ocultar" : "Mostrar"}
                </button>
                <button onClick={() => openEdit(p)}
                  className="font-body font-semibold text-xs text-ink px-3 py-1.5 rounded-full border border-dust hover:border-ink/30 transition-all">
                  Editar
                </button>
                <button onClick={() => handleDelete(p)}
                  className="font-body font-semibold text-xs text-rose-berry px-3 py-1.5 rounded-full border border-rose-petal hover:bg-rose-blush transition-all">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
