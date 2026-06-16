// src/components/AdminOrders.jsx
// Gestión completa de pedidos — muestra todos los campos del cliente,
// productos, montos, historial de estados y permite cambiar el estado.

import { useState, useEffect, useMemo, useCallback } from "react"
import { supabase } from "../lib/supabase"
import { ORDER_STATUSES, STATUS_DISPLAY_ORDER } from "../data/orderStatuses"

// ── Helpers de formato ────────────────────────────────────────────────────────
function fmtFecha(d) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("es-CL", {
    day: "2-digit", month: "2-digit", year: "numeric",
  })
}
function fmtFechaHora(d) {
  if (!d) return "—"
  return new Date(d).toLocaleString("es-CL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}
function fmtHora(d) {
  if (!d) return ""
  return new Date(d).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })
}
function fmtCLP(n) {
  return `$${Number(n ?? 0).toLocaleString("es-CL")}`
}

// ── Badge de estado ───────────────────────────────────────────────────────────
function StatusBadge({ statusKey, size = "sm" }) {
  const st = ORDER_STATUSES[statusKey]
  if (!st) return null
  const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
  return (
    <span
      className={`inline-flex items-center rounded-full font-body font-semibold border ${pad}`}
      style={{ backgroundColor: st.colors.bg, color: st.colors.text, borderColor: st.colors.border }}
    >
      {st.short}
    </span>
  )
}

// ── Línea de tiempo del historial ─────────────────────────────────────────────
function StatusTimeline({ history }) {
  if (!history?.length) return (
    <p className="font-body text-xs text-mist italic">Sin historial registrado.</p>
  )
  return (
    <div className="flex flex-col">
      {[...history].reverse().map((entry, i, arr) => {
        const st = ORDER_STATUSES[entry.status]
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center flex-shrink-0 pt-1">
              <div
                className="w-2.5 h-2.5 rounded-full border-2 flex-shrink-0"
                style={{
                  backgroundColor: st?.colors.bg ?? "#eee",
                  borderColor:     st?.colors.border ?? "#ccc",
                }}
              />
              {i < arr.length - 1 && (
                <div className="w-px flex-1 mt-1 mb-1 bg-dust" />
              )}
            </div>
            <div className="pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-body font-semibold text-sm text-ink">
                  {st?.label ?? entry.status}
                </span>
                <span className="font-body text-xs text-mist">
                  {fmtFechaHora(entry.timestamp)}
                </span>
              </div>
              {entry.note && (
                <p className="font-body text-xs text-mist mt-0.5 italic">"{entry.note}"</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Panel lateral de detalle del pedido ───────────────────────────────────────
function OrderDetail({ order, onClose, onRequestChange }) {
  const itemsTotal   = (order.items ?? []).reduce((s, i) => s + i.qty, 0)

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl">

        {/* Cabecera fija */}
        <div className="sticky top-0 z-10 bg-white border-b border-dust px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-body text-[10px] text-mist uppercase tracking-wider">Pedido</p>
            <h3 className="font-display font-bold text-lg text-ink leading-tight">{order.id}</h3>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge statusKey={order.status} size="md" />
            <button
              onClick={onClose}
              className="font-body text-sm font-semibold text-mist hover:text-ink px-3 py-1.5 rounded-full hover:bg-sand transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="px-6 py-6 flex flex-col gap-7">

          {/* ── Sección: Datos del cliente ── */}
          <div>
            <p className="font-body text-[10px] font-bold text-mist uppercase tracking-[.12em] mb-3">
              Datos del cliente
            </p>
            <div className="bg-sand rounded-2xl p-4 grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                { l: "Nombre",              v: order.customer_name,    full: true },
                { l: "Correo electrónico",  v: order.customer_email,   full: true },
                { l: "RUT",                 v: order.customer_rut,     full: false },
                { l: "Teléfono",            v: order.customer_phone || "—", full: false },
                { l: "Dirección",           v: order.customer_address, full: true },
                { l: "Comuna",              v: order.customer_comuna,  full: false },
                { l: "Región",              v: order.customer_region,  full: false },
              ].map(({ l, v, full }) => (
                <div key={l} className={full ? "col-span-2" : ""}>
                  <p className="font-body text-[10px] text-mist uppercase tracking-wider">{l}</p>
                  <p className="font-body font-semibold text-sm text-ink mt-0.5 break-words">{v || "—"}</p>
                </div>
              ))}
            </div>

            {/* Observaciones (solo si hay) */}
            {order.notes && (
              <div className="mt-3 bg-gold/10 border border-gold/30 rounded-xl p-3">
                <p className="font-body text-[10px] text-mist uppercase tracking-wider mb-1">
                  Observaciones del cliente
                </p>
                <p className="font-body text-sm text-ink">{order.notes}</p>
              </div>
            )}
          </div>

          {/* ── Sección: Información de envío ── */}
          <div>
            <p className="font-body text-[10px] font-bold text-mist uppercase tracking-[.12em] mb-3">
              Envío
            </p>
            <div className="bg-sand rounded-2xl p-4 grid grid-cols-2 gap-x-4 gap-y-3">
              <div className="col-span-2">
                <p className="font-body text-[10px] text-mist uppercase tracking-wider">Región</p>
                <p className="font-body font-semibold text-sm text-ink mt-0.5">
                  {order.shipping_region || order.customer_region || "—"}
                </p>
              </div>
              {order.shipping_zone && (
                <div>
                  <p className="font-body text-[10px] text-mist uppercase tracking-wider">Zona</p>
                  <p className="font-body font-semibold text-sm text-ink mt-0.5">{order.shipping_zone}</p>
                </div>
              )}
              <div>
                <p className="font-body text-[10px] text-mist uppercase tracking-wider">Costo de envío</p>
                <p className="font-body font-semibold text-sm mt-0.5">
                  {order.shipping_is_free
                    ? <span className="text-teal-dark">GRATIS</span>
                    : <span className="text-ink">{fmtCLP(order.shipping_cost)}</span>
                  }
                </p>
              </div>
            </div>
          </div>

          {/* ── Sección: Productos comprados ── */}
          <div>
            <p className="font-body text-[10px] font-bold text-mist uppercase tracking-[.12em] mb-3">
              Productos ({itemsTotal} {itemsTotal === 1 ? "unidad" : "unidades"})
            </p>
            <div className="flex flex-col gap-3">
              {(order.items ?? []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-sand rounded-xl p-3">
                  {item.image && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-dust/40">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-sm text-ink line-clamp-2">
                      {item.name}
                    </p>
                    <p className="font-body text-xs text-mist mt-0.5">
                      {fmtCLP(item.price)} × {item.qty} {item.qty === 1 ? "unidad" : "unidades"}
                    </p>
                  </div>
                  <p className="font-body font-bold text-sm text-ink flex-shrink-0">
                    {fmtCLP(item.price * item.qty)}
                  </p>
                </div>
              ))}
            </div>

            {/* Desglose financiero */}
            <div className="mt-4 border-t border-dust pt-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm font-body">
                <span className="text-mist">Subtotal</span>
                <span className="text-ink font-semibold">{fmtCLP(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-mist">
                  Envío{order.shipping_zone ? ` — ${order.shipping_zone}` : ""}
                </span>
                {order.shipping_is_free
                  ? <span className="font-semibold text-teal-dark">GRATIS</span>
                  : <span className="font-semibold text-ink">{fmtCLP(order.shipping_cost)}</span>
                }
              </div>
              <div className="flex justify-between pt-2 mt-1 border-t border-dust">
                <span className="font-body font-bold text-base text-ink">Total</span>
                <span className="font-display font-black text-2xl text-ink">{fmtCLP(order.total)}</span>
              </div>
            </div>
          </div>

          {/* ── Sección: Fecha de compra ── */}
          <div className="flex gap-6 text-sm font-body">
            <div>
              <p className="font-body text-[10px] text-mist uppercase tracking-wider">Fecha de compra</p>
              <p className="font-body font-semibold text-ink mt-0.5">{fmtFechaHora(order.created_at)}</p>
            </div>
            {order.updated_at && order.updated_at !== order.created_at && (
              <div>
                <p className="font-body text-[10px] text-mist uppercase tracking-wider">Última actualización</p>
                <p className="font-body font-semibold text-ink mt-0.5">{fmtFechaHora(order.updated_at)}</p>
              </div>
            )}
          </div>

          {/* ── Sección: Cambiar estado ── */}
          <div>
            <p className="font-body text-[10px] font-bold text-mist uppercase tracking-[.12em] mb-3">
              Cambiar estado
            </p>
            <select
              value={order.status}
              onChange={(e) => {
                const newStatus = e.target.value
                if (newStatus !== order.status) onRequestChange(order.id, newStatus)
              }}
              className="w-full bg-white border-2 rounded-xl px-4 py-3 text-sm font-body font-semibold outline-none cursor-pointer focus:ring-2 focus:ring-teal/20 transition-all"
              style={{
                borderColor: ORDER_STATUSES[order.status]?.colors.border ?? "#ddd0d3",
                color:       ORDER_STATUSES[order.status]?.colors.text   ?? "#1a2e2b",
              }}
            >
              {STATUS_DISPLAY_ORDER.map((key) => (
                <option key={key} value={key}>
                  {ORDER_STATUSES[key].label}
                </option>
              ))}
            </select>
            <p className="font-body text-xs text-mist mt-2">
              Selecciona cualquier estado de la lista — no es necesario seguir un orden.
            </p>
          </div>

          {/* ── Sección: Historial ── */}
          <div>
            <p className="font-body text-[10px] font-bold text-mist uppercase tracking-[.12em] mb-3">
              Historial de estados
            </p>
            <StatusTimeline history={order.status_history ?? []} />
          </div>

        </div>
      </div>
    </div>
  )
}

// ── Modal de confirmación de cambio de estado ──────────────────────────────────
function ConfirmModal({ change, orders, onConfirm, onCancel }) {
  const [note, setNote] = useState("")
  const order = orders.find((o) => o.id === change.orderId)
  const toSt  = ORDER_STATUSES[change.newStatus]

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-3xl border border-dust shadow-xl p-6 sm:p-8 w-full max-w-md">
        <h3 className="font-display font-bold text-lg text-ink mb-1">
          Confirmar cambio de estado
        </h3>
        <p className="font-body text-sm text-mist mb-5">Pedido {change.orderId}</p>

        <div className="flex items-center gap-3 mb-5">
          <StatusBadge statusKey={order?.status} size="md" />
          <span className="text-mist font-bold text-lg">→</span>
          <StatusBadge statusKey={change.newStatus} size="md" />
        </div>

        <div className="mb-5">
          <label className="font-body text-sm font-semibold text-ink mb-1.5 block">
            Nota interna{" "}
            <span className="text-mist font-normal">(opcional — se guarda en el historial)</span>
          </label>
          <input
            type="text"
            placeholder="Ej: Starken guía n.° 12345, pago verificado con banco, etc."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onConfirm(note)}
            className="w-full bg-white border border-dust rounded-xl px-4 py-3 text-sm font-body text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all placeholder:text-mist"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-dust rounded-full py-3 font-body font-semibold text-sm text-mist hover:text-ink hover:border-ink transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(note)}
            className="flex-1 rounded-full py-3 font-body font-bold text-sm text-white transition-all"
            style={{ backgroundColor: toSt?.colors.border ?? "#5DBFB0" }}
          >
            Confirmar cambio
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal AdminOrders ──────────────────────────────────────────
export default function AdminOrders() {
  const [orders,        setOrders]        = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [updating,      setUpdating]      = useState(false)
  const [search,        setSearch]        = useState("")
  const [filterStatus,  setFilterStatus]  = useState("all")
  const [selectedId,    setSelectedId]    = useState(null)
  const [confirmChange, setConfirmChange] = useState(null)

  // ── Cargar pedidos ─────────────────────────────────────────────────────────
  const loadOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
    if (err) {
      setError("No se pudieron cargar los pedidos. Revisa la conexión con Supabase.")
      console.error("[AdminOrders]", err)
    } else {
      setOrders(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadOrders() }, [loadOrders])

  // ── Cambiar estado ─────────────────────────────────────────────────────────
  const handleConfirmChange = async (note) => {
    const { orderId, newStatus } = confirmChange
    const order = orders.find((o) => o.id === orderId)
    if (!order) return
    setUpdating(true)
    setConfirmChange(null)

    const newHistory = [
      ...(order.status_history ?? []),
      {
        status:    newStatus,
        timestamp: new Date().toISOString(),
        note:      note.trim(),
      },
    ]

    const { error: err } = await supabase
      .from("orders")
      .update({
        status:         newStatus,
        status_history: newHistory,
        updated_at:     new Date().toISOString(),
      })
      .eq("id", orderId)

    if (err) {
      console.error("[AdminOrders] Error al actualizar:", err)
      alert("Error al guardar el cambio de estado. Intenta nuevamente.")
    } else {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: newStatus, status_history: newHistory }
            : o
        )
      )
    }
    setUpdating(false)
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const counts = {}
    STATUS_DISPLAY_ORDER.forEach((k) => { counts[k] = 0 })
    orders.forEach((o) => { if (counts[o.status] !== undefined) counts[o.status]++ })
    return counts
  }, [orders])

  // ── Filtrado ───────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = filterStatus === "all" || o.status === filterStatus
      const q = search.toLowerCase().trim()
      if (!q) return matchStatus
      const matchSearch =
        o.id.toLowerCase().includes(q) ||
        (o.customer_name  ?? "").toLowerCase().includes(q) ||
        (o.customer_email ?? "").toLowerCase().includes(q) ||
        (o.customer_rut   ?? "").toLowerCase().includes(q) ||
        (o.customer_phone ?? "").toLowerCase().includes(q) ||
        (o.customer_comuna ?? "").toLowerCase().includes(q) ||
        (o.customer_region ?? "").toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [orders, search, filterStatus])

  const selectedOrder = selectedId
    ? orders.find((o) => o.id === selectedId) ?? null
    : null

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="font-body">

      {/* Error de conexión */}
      {error && (
        <div className="bg-rose-blush border border-rose-berry/30 rounded-2xl px-5 py-4 mb-6">
          <p className="font-body font-semibold text-sm text-rose-berry">{error}</p>
          <button onClick={loadOrders} className="font-body text-xs text-rose-berry underline mt-1">
            Reintentar
          </button>
        </div>
      )}

      {/* Estadísticas por estado */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-3 mb-8">
        <button
          onClick={() => setFilterStatus("all")}
          className={`col-span-1 rounded-2xl border p-3 text-left transition-all ${
            filterStatus === "all"
              ? "bg-ink text-white border-ink shadow-card"
              : "bg-white border-dust hover:border-ink/30"
          }`}
        >
          <p className={`font-body text-[10px] uppercase tracking-wider mb-1 ${filterStatus === "all" ? "text-white/60" : "text-mist"}`}>
            Total
          </p>
          <p className={`font-display font-black text-xl ${filterStatus === "all" ? "text-white" : "text-ink"}`}>
            {orders.length}
          </p>
        </button>

        {STATUS_DISPLAY_ORDER.map((key) => {
          const st     = ORDER_STATUSES[key]
          const count  = stats[key] ?? 0
          const active = filterStatus === key
          return (
            <button
              key={key}
              onClick={() => setFilterStatus(active ? "all" : key)}
              className="rounded-2xl border p-3 text-left transition-all hover:shadow-sm"
              style={
                active
                  ? { backgroundColor: st.colors.bg, borderColor: st.colors.border }
                  : { backgroundColor: "white", borderColor: "#ddd0d3" }
              }
            >
              <p
                className="font-display font-black text-xl"
                style={{ color: active ? st.colors.text : "#1a2e2b" }}
              >
                {count}
              </p>
              <p
                className="font-body text-[10px] truncate mt-0.5"
                style={{ color: active ? st.colors.text : "#557570" }}
              >
                {st.short}
              </p>
            </button>
          )
        })}
      </div>

      {/* Buscador */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por N° pedido, nombre, correo, RUT, teléfono o comuna..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white border border-dust rounded-2xl px-4 py-3 text-sm font-body text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all placeholder:text-mist"
        />
        <div className="flex gap-2">
          {(search || filterStatus !== "all") && (
            <button
              onClick={() => { setSearch(""); setFilterStatus("all") }}
              className="font-body text-sm font-semibold text-mist hover:text-ink px-4 py-2 rounded-2xl border border-dust hover:border-ink/30 bg-white transition-all flex-shrink-0"
            >
              Limpiar filtros
            </button>
          )}
          <button
            onClick={loadOrders}
            disabled={loading}
            className="font-body text-sm font-semibold text-mist hover:text-ink px-4 py-2 rounded-2xl border border-dust hover:border-ink/30 bg-white transition-all flex-shrink-0 disabled:opacity-50"
          >
            {loading ? "..." : "Actualizar"}
          </button>
        </div>
      </div>

      {/* Lista de pedidos */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-dust p-16 text-center">
          <p className="font-body text-sm text-mist">Cargando pedidos desde Supabase...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dust p-16 text-center">
          <p className="font-display font-bold text-xl text-ink mb-2">Sin resultados</p>
          <p className="font-body text-sm text-mist">
            No hay pedidos que coincidan con los filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => {
            const st     = ORDER_STATUSES[order.status]
            const nItems = (order.items ?? []).reduce((s, i) => s + i.qty, 0)

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-dust shadow-card hover:shadow-md transition-all overflow-hidden"
              >
                <div className="flex">
                  {/* Franja de color del estado */}
                  <div
                    className="w-1 flex-shrink-0"
                    style={{ backgroundColor: st?.colors.border ?? "#ddd" }}
                  />

                  <div className="flex-1 p-4 sm:p-5">
                    {/* Fila superior: ID + estado / total */}
                    <div className="flex flex-wrap items-start gap-3 justify-between">
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-bold text-sm text-ink">{order.id}</span>
                          <StatusBadge statusKey={order.status} />
                        </div>
                        {/* Nombre y correo del cliente */}
                        <p className="font-body font-semibold text-sm text-ink truncate">
                          {order.customer_name || "—"}
                        </p>
                        <p className="font-body text-xs text-mist truncate">
                          {order.customer_email || ""}
                          {order.customer_phone ? ` · ${order.customer_phone}` : ""}
                        </p>
                        {/* Dirección resumida */}
                        <p className="font-body text-xs text-mist">
                          {[order.customer_address, order.customer_comuna, order.customer_region]
                            .filter(Boolean).join(" · ")}
                        </p>
                        <p className="font-body text-xs text-mist/70">
                          {fmtFecha(order.created_at)}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="font-display font-black text-xl text-ink">
                          {fmtCLP(order.total)}
                        </p>
                        <p className="font-body text-xs text-mist">
                          {nItems} {nItems === 1 ? "unidad" : "unidades"}
                        </p>
                        {order.customer_rut && (
                          <p className="font-body text-xs text-mist/70 mt-0.5">
                            {order.customer_rut}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Resumen de productos (primer ítem + ellipsis) */}
                    {order.items?.length > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-lg overflow-hidden bg-sand border border-dust/40 flex-shrink-0"
                            title={item.name}
                          >
                            {item.image && (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <span className="font-body text-xs text-mist">
                            +{order.items.length - 3} más
                          </span>
                        )}
                        <span className="font-body text-xs text-mist ml-1">
                          {order.items.slice(0, 3).map((i) => `${i.name} ×${i.qty}`).join(", ")}
                          {order.items.length > 3 ? "..." : ""}
                        </span>
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-dust/60">
                      {/* Ver detalle */}
                      <button
                        onClick={() => setSelectedId(order.id)}
                        className="font-body font-semibold text-xs text-mist hover:text-ink px-3 py-1.5 rounded-full border border-dust hover:border-ink/30 transition-all"
                      >
                        Ver detalle
                      </button>

                      {/* Cambiar estado — selector único con todos los estados */}
                      <select
                        value={order.status}
                        disabled={updating}
                        onChange={(e) => {
                          const newStatus = e.target.value
                          if (newStatus !== order.status)
                            setConfirmChange({ orderId: order.id, newStatus })
                        }}
                        className="font-body font-semibold text-xs px-3 py-1.5 rounded-full border-2 outline-none cursor-pointer transition-all disabled:opacity-50"
                        style={{
                          borderColor:     st?.colors.border ?? "#ddd0d3",
                          color:           st?.colors.text ?? "#1a2e2b",
                          backgroundColor: st?.colors.bg ?? "white",
                        }}
                      >
                        {STATUS_DISPLAY_ORDER.map((key) => (
                          <option key={key} value={key}>
                            {ORDER_STATUSES[key].label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="font-body text-xs text-mist text-center mt-6">
        Mostrando {filtered.length} de {orders.length} pedidos
      </p>

      {/* Panel de detalle */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedId(null)}
          onRequestChange={(orderId, newStatus) => {
            setSelectedId(null)
            setConfirmChange({ orderId, newStatus })
          }}
        />
      )}

      {/* Modal de confirmación */}
      {confirmChange && (
        <ConfirmModal
          change={confirmChange}
          orders={orders}
          onConfirm={handleConfirmChange}
          onCancel={() => setConfirmChange(null)}
        />
      )}
    </div>
  )
}
