// src/components/LocationPickerMap.jsx
// Mapa interactivo para el panel admin: clic para colocar/mover el marcador.
// Usa react-leaflet + OpenStreetMap (sin API key).

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
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

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) { onPick(e.latlng.lat, e.latlng.lng) },
  })
  return null
}

function Recenter({ lat, lng }) {
  const map = useMap()
  useEffect(() => {
    if (lat != null && lng != null) map.setView([lat, lng], map.getZoom())
  }, [lat, lng, map])
  return null
}

export default function LocationPickerMap({ lat, lng, onPick }) {
  const defaultCenter = [-33.4489, -70.6693] // Santiago de Chile
  const hasMarker = lat != null && lng != null
  const center = hasMarker ? [lat, lng] : defaultCenter

  return (
    <MapContainer
      center={center}
      zoom={hasMarker ? 15 : 12}
      scrollWheelZoom={true}
      style={{ height: "300px", width: "100%", borderRadius: "1rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onPick={onPick} />
      {hasMarker && (
        <>
          <Marker position={[lat, lng]} icon={markerIcon} />
          <Recenter lat={lat} lng={lng} />
        </>
      )}
    </MapContainer>
  )
}
