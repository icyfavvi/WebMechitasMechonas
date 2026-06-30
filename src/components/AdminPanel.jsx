// src/components/AdminPanel.jsx
// Contenedor del panel admin con pestañas: Pedidos, Catálogo, Ubicaciones.

import { useState } from "react"
import AdminOrders    from "./AdminOrders"
import AdminCatalog   from "./AdminCatalog"
import AdminLocations from "./AdminLocations"

export default function AdminPanel({ onLogout, onNavigate }) {
  const [tab, setTab] = useState("orders") // "orders" | "catalog" | "locations"

  const tabs = [
    { key: "orders",    label: "Pedidos" },
    { key: "catalog",   label: "Catálogo" },
    { key: "locations", label: "Ubicaciones" },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 font-body">
      {/* Encabezado */}
      <div className="bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
  <button
    onClick={() => onNavigate("shop")}
    className="hover:opacity-80 transition-opacity text-left"
    title="Volver a la tienda"
  >
    <h2 className="font-display font-black text-2xl text-white leading-tight">
      Mechitas<br />Mechonas
    </h2>
  </button>

  <div className="h-6 w-px bg-white/20" />
            <div>
              <h1 className="font-display font-bold text-base text-white leading-tight">
                Panel de Administración
              </h1>
              <p className="font-body text-[11px] text-white/50 uppercase tracking-widest">
                Mechitas Mechonas
              </p>
            </div>
          </div>
          <button onClick={onLogout}
            className="font-body text-sm font-semibold text-white/60 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-all">
            Cerrar sesión
          </button>
        </div>

        {/* Pestañas */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex gap-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`font-body font-semibold text-sm px-5 py-3 transition-all border-b-2 ${
                  tab === t.key
                    ? "text-white border-white"
                    : "text-white/50 border-transparent hover:text-white/80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {tab === "orders"    && <AdminOrders />}
        {tab === "catalog"   && <AdminCatalog />}
        {tab === "locations" && <AdminLocations />}
      </div>
    </div>
  )
}
