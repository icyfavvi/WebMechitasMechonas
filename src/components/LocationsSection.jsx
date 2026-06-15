// src/components/LocationsSection.jsx
// Sección pública "Aquí estamos" — lista de eventos próximos + mapa.
// El mapa Leaflet se carga de forma diferida (lazy) para no pesar el bundle inicial.

import { useState, useEffect, lazy, Suspense } from "react"
import { fetchPublicLocations } from "../lib/catalog"

// Carga diferida del mapa (Leaflet solo se descarga cuando esta sección se usa)
const LocationsMap = lazy(() => import("./LocationsMap"))

function fmtFecha(d) {
  if (!d) return null
  const [y, m, day] = d.split("-")
  return `${day}/${m}/${y}`
}
function fmtHora(t) {
  if (!t) return null
  return t.slice(0, 5)
}

export default function LocationsSection() {
  const [locations, setLocations] = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    fetchPublicLocations()
      .then(setLocations)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="aqui-estamos" className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Encabezado */}
        <div className="flex flex-col gap-2 mb-8">
          <p className="font-body text-xs font-bold uppercase tracking-[.15em] text-teal-dark">
            Dónde encontrarnos
          </p>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-ink leading-tight">
            Aquí estamos
          </h2>
          <p className="font-body text-mist text-sm max-w-lg">
            Visítanos en nuestras próximas ferias y eventos. Aquí te mostramos
            dónde estaremos con nuestro puesto.
          </p>
        </div>

        {loading ? (
          <div className="bg-sand rounded-3xl border border-dust p-16 text-center">
            <p className="font-body text-sm text-mist">Cargando ubicaciones...</p>
          </div>
        ) : locations.length === 0 ? (
          <div className="bg-sand rounded-3xl border border-dust p-16 text-center">
            <p className="font-display font-bold text-xl text-ink mb-2">
              Sin eventos programados
            </p>
            <p className="font-body text-sm text-mist">
              Pronto anunciaremos dónde nos podrás encontrar. ¡Síguenos en redes!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Lista de eventos */}
            <div className="lg:col-span-2 flex flex-col gap-3 order-2 lg:order-1">
              <p className="font-body text-xs text-mist uppercase tracking-wider mb-1">
                Próximos eventos
              </p>
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="bg-sand rounded-2xl border border-dust p-4 hover:shadow-card transition-all"
                >
                  <h3 className="font-display font-bold text-base text-ink">{loc.name}</h3>
                  {loc.description && (
                    <p className="font-body text-sm text-mist mt-1">{loc.description}</p>
                  )}
                  {loc.address && (
                    <p className="font-body text-xs text-mist mt-2">{loc.address}</p>
                  )}
                  {loc.event_date && (
                    <div className="mt-3 inline-flex items-center gap-2 bg-teal-pale border border-teal/30 rounded-full px-3 py-1.5">
                      <span className="font-body text-xs font-semibold text-teal-dark">
                        {fmtFecha(loc.event_date)}
                        {loc.start_time && ` · ${fmtHora(loc.start_time)}`}
                        {loc.end_time && ` a ${fmtHora(loc.end_time)}`}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mapa */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <Suspense
                fallback={
                  <div className="bg-sand rounded-3xl border border-dust h-[420px] flex items-center justify-center">
                    <p className="font-body text-sm text-mist">Cargando mapa...</p>
                  </div>
                }
              >
                <LocationsMap locations={locations} />
              </Suspense>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
