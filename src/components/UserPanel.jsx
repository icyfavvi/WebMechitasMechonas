// src/components/UserPanel.jsx
// Panel del usuario — muestra sus pedidos con columnas planas de Supabase.

import { useState, useEffect, useCallback } from "react"
import { supabase } from "../lib/supabase"
import { ORDER_STATUSES } from "../data/orderStatuses"

function fmtFechaHora(d) {
  if (!d) return "—"
  return new Date(d).toLocaleString("es-CL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}
function fmtCLP(n) { return `$${Number(n ?? 0).toLocaleString("es-CL")}` }

function StatusBadge({ statusKey }) {
  const st = ORDER_STATUSES[statusKey]
  if (!st) return null
  return (
    <span
      className="inline-flex items-center rounded-full font-body font-semibold border px-2.5 py-1 text-xs"
      style={{ backgroundColor: st.colors.bg, color: st.colors.text, borderColor: st.colors.border }}
    >
      {st.short}
    </span>
  )
}

function StatusTimeline({ history }) {
  if (!history?.length) return null
  return (
    <div className="flex flex-col mt-4">
      {[...history].reverse().map((entry, i, arr) => {
        const st = ORDER_STATUSES[entry.status]
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center flex-shrink-0 pt-1">
              <div
                className="w-2 h-2 rounded-full border-2 flex-shrink-0"
                style={{ backgroundColor: st?.colors.bg ?? "#eee", borderColor: st?.colors.border ?? "#ccc" }}
              />
              {i < arr.length - 1 && <div className="w-px flex-1 mt-1 mb-1 bg-dust" />}
            </div>
            <div className="pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-body font-semibold text-xs text-ink">{st?.label ?? entry.status}</span>
                <span className="font-body text-xs text-mist">
                  {new Date(entry.timestamp).toLocaleString("es-CL", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
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

function OrderCard({ order }) {
  const [open, setOpen] = useState(false)
  const nItems = (order.items ?? []).reduce((s, i) => s + i.qty, 0)

  return (
    <div className="bg-white rounded-2xl border border-dust shadow-card overflow-hidden">
      <div className="flex">
        <div
          className="w-1 flex-shrink-0"
          style={{ backgroundColor: ORDER_STATUSES[order.status]?.colors.border ?? "#ddd" }}
        />
        <div className="flex-1 p-4 sm:p-5">
          {/* Cabecera */}
          <div className="flex flex-wrap items-start gap-3 justify-between">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-bold text-sm text-ink">{order.id}</span>
                <StatusBadge statusKey={order.status} />
              </div>
              <p className="font-body text-xs text-mist">{fmtFechaHora(order.created_at)}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-display font-black text-xl text-ink">{fmtCLP(order.total)}</p>
              <p className="font-body text-xs text-mist">
                {nItems} {nItems === 1 ? "unidad" : "unidades"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            className="mt-3 font-body font-semibold text-xs text-mist hover:text-ink px-3 py-1.5 rounded-full border border-dust hover:border-ink/30 transition-all"
          >
            {open ? "Ocultar detalle" : "Ver detalle"}
          </button>

          {open && (
            <div className="mt-4 border-t border-dust pt-4 flex flex-col gap-4">
              {/* Productos */}
              <div>
                <p className="font-body text-xs text-mist uppercase tracking-wider mb-2">Productos</p>
                <div className="flex flex-col gap-2">
                  {(order.items ?? []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {item.image && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-sand flex-shrink-0 border border-dust/30">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-semibold text-xs text-ink line-clamp-1">{item.name}</p>
                        <p className="font-body text-xs text-mist">{fmtCLP(item.price)} × {item.qty}</p>
                      </div>
                      <p className="font-body font-bold text-xs text-ink flex-shrink-0">
                        {fmtCLP(item.price * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className="flex flex-col gap-1.5 text-xs font-body border-t border-dust pt-3">
                <div className="flex justify-between">
                  <span className="text-mist">Subtotal</span>
                  <span className="text-ink font-semibold">{fmtCLP(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">Envío</span>
                  {order.shipping_is_free
                    ? <span className="text-teal-dark font-semibold">GRATIS</span>
                    : <span className="text-ink font-semibold">{fmtCLP(order.shipping_cost)}</span>
                  }
                </div>
                <div className="flex justify-between font-bold text-sm border-t border-dust pt-1.5 mt-1">
                  <span className="text-ink">Total</span>
                  <span className="text-ink">{fmtCLP(order.total)}</span>
                </div>
              </div>

              {/* Envío */}
              <div>
                <p className="font-body text-xs text-mist uppercase tracking-wider mb-1">
                  Información de envío
                </p>
                {order.shipping_region && (
                  <p className="font-body text-xs text-ink font-semibold">{order.shipping_region}</p>
                )}
                <p className="font-body text-xs text-mist">
                  {[order.customer_address, order.customer_comuna].filter(Boolean).join(", ")}
                </p>
              </div>

              {/* Observaciones */}
              {order.notes && (
                <div>
                  <p className="font-body text-xs text-mist uppercase tracking-wider mb-1">
                    Observaciones
                  </p>
                  <p className="font-body text-xs text-ink">{order.notes}</p>
                </div>
              )}

              {/* Historial */}
              <div>
                <p className="font-body text-xs text-mist uppercase tracking-wider">
                  Historial de estado
                </p>
                <StatusTimeline history={order.status_history ?? []} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function UserPanel({ user, isAdmin, onNavigate, onLogout }) {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const nombre =
    user?.user_metadata?.nombre ??
    user?.email?.split("@")[0] ??
    "Usuario"

  const loadOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
    if (err) {
      setError("No se pudieron cargar tus pedidos. Intenta nuevamente.")
      console.error("[UserPanel]", err)
    } else {
      setOrders(data ?? [])
    }
    setLoading(false)
  }, [user.id])

  useEffect(() => { loadOrders() }, [loadOrders])

  return (
    <div className="min-h-screen bg-sand font-body">
      {/* Encabezado */}
      <div className="bg-ink text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <img
              src="/image_11cb63.png"
              alt="Mechitas Mechonas"
              className="h-8 w-auto object-contain opacity-90 cursor-pointer"
              onClick={() => onNavigate("shop")}
            />
            <div className="h-6 w-px bg-white/20" />
            <div>
              <h1 className="font-display font-bold text-base text-white leading-tight">Mi Cuenta</h1>
              <p className="font-body text-[11px] text-white/50">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {isAdmin && (
              <button
                onClick={() => onNavigate("admin")}
                className="font-body text-sm font-semibold text-white/60 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-all"
              >
                Panel de administración
              </button>
            )}
            <button
              onClick={() => onNavigate("shop")}
              className="font-body text-sm font-semibold text-white/60 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-all"
            >
              Ir a la tienda
            </button>
            <button
              onClick={onLogout}
              className="font-body text-sm font-semibold text-white/60 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-all"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="mb-8">
          <h2 className="font-display font-bold text-2xl text-ink mb-1">Hola, {nombre}</h2>
          <p className="font-body text-sm text-mist">Aquí puedes revisar el estado de tus pedidos.</p>
        </div>

        {error && (
          <div className="bg-rose-blush border border-rose-berry/30 rounded-2xl px-5 py-4 mb-6">
            <p className="font-body font-semibold text-sm text-rose-berry">{error}</p>
            <button onClick={loadOrders} className="font-body text-xs text-rose-berry underline mt-1">
              Reintentar
            </button>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-3xl border border-dust p-12 text-center">
            <p className="font-body text-sm text-mist">Cargando tus pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dust p-12 text-center">
            <p className="font-display font-bold text-xl text-ink mb-2">Sin pedidos aún</p>
            <p className="font-body text-sm text-mist mb-6">
              Cuando realices una compra, aparecerán aquí.
            </p>
            <button
              onClick={() => onNavigate("shop")}
              className="bg-ink hover:bg-ink/90 text-white font-bold rounded-full px-8 py-3 text-sm transition-all"
            >
              Ir al catálogo
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
