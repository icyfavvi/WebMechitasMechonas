// src/components/LocationsMap.jsx
// Mapa público que muestra todos los marcadores de ubicaciones activas.
// Auto-centra considerando todas las ubicaciones. Sin API key (OpenStreetMap).

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { useEffect } from "react"
import L from "leaflet"

const markerIcon = new L.Icon({
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize:      [25, 41],
  iconAnchor:    [12, 41],
  popupAnchor:   [1, -34],
  shadowSize:    [41, 41],
})

function fmtFecha(d) {
  if (!d) return null
  // d viene como 'YYYY-MM-DD'
  const [y, m, day] = d.split("-")
  return `${day}/${m}/${y}`
}
function fmtHora(t) {
  if (!t) return null
  // t viene como 'HH:MM:SS' → 'HH:MM'
  return t.slice(0, 5)
}

// Ajusta el encuadre del mapa para que se vean todos los marcadores
function FitBounds({ locations }) {
  const map = useMap()
  useEffect(() => {
    if (!locations.length) return
    if (locations.length === 1) {
      map.setView([locations[0].latitude, locations[0].longitude], 15)
    } else {
      const bounds = L.latLngBounds(
        locations.map((l) => [l.latitude, l.longitude])
      )
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
    }
  }, [locations, map])
  return null
}

export default function LocationsMap({ locations }) {
  const center = locations.length
    ? [locations[0].latitude, locations[0].longitude]
    : [-33.4489, -70.6693] // Santiago por defecto

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: "420px", width: "100%", borderRadius: "1.5rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds locations={locations} />
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={markerIcon}>
          <Popup>
            <div style={{ minWidth: "180px" }}>
              <strong style={{ fontSize: "14px" }}>{loc.name}</strong>
              {loc.description && (
                <p style={{ margin: "4px 0", fontSize: "12px", color: "#555" }}>
                  {loc.description}
                </p>
              )}
              {loc.address && (
                <p style={{ margin: "4px 0", fontSize: "12px", color: "#555" }}>
                  {loc.address}
                </p>
              )}
              {loc.event_date && (
                <p style={{ margin: "4px 0 0", fontSize: "12px", fontWeight: 600 }}>
                  {fmtFecha(loc.event_date)}
                  {loc.start_time && ` · ${fmtHora(loc.start_time)}`}
                  {loc.end_time && ` a ${fmtHora(loc.end_time)}`}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
