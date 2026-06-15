// src/components/AdminLocations.jsx
// Gestión de ubicaciones desde el panel admin: crear, editar, eliminar, activar.

import { useState, useEffect, lazy, Suspense } from "react"
import {
  fetchAllLocations, createLocation, updateLocation, deleteLocation,
} from "../lib/catalog"

const LocationPickerMap = lazy(() => import("./LocationPickerMap"))

const EMPTY = {
  name: "", description: "", address: "",
  event_date: "", start_time: "", end_time: "",
  latitude: null, longitude: null, active: true,
}

function fmtFecha(d) {
  if (!d) return "—"
  const [y, m, day] = d.split("-")
  return `${day}/${m}/${y}`
}

export default function AdminLocations() {
  const [locations, setLocations] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [editing,   setEditing]   = useState(null) // null | "new" | location object
  const [form,      setForm]      = useState(EMPTY)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState("")

  const load = () => {
    setLoading(true)
    fetchAllLocations().then(setLocations).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openNew = () => { setForm(EMPTY); setEditing("new"); setError("") }
  const openEdit = (loc) => {
    setForm({
      name: loc.name ?? "", description: loc.description ?? "", address: loc.address ?? "",
      event_date: loc.event_date ?? "", start_time: loc.start_time?.slice(0,5) ?? "",
      end_time: loc.end_time?.slice(0,5) ?? "",
      latitude: loc.latitude, longitude: loc.longitude, active: loc.active,
    })
    setEditing(loc)
    setError("")
  }
  const closeForm = () => { setEditing(null); setForm(EMPTY); setError("") }

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const handlePick = (lat, lng) => setForm((f) => ({ ...f, latitude: lat, longitude: lng }))

  const handleSave = async () => {
    setError("")
    if (!form.name.trim()) { setError("El nombre es obligatorio."); return }
    if (form.latitude == null || form.longitude == null) {
      setError("Debes seleccionar un punto en el mapa."); return
    }
    setSaving(true)
    const payload = {
      name:        form.name.trim(),
      description: form.description.trim(),
      address:     form.address.trim(),
      event_date:  form.event_date || null,
      start_time:  form.start_time || null,
      end_time:    form.end_time || null,
      latitude:    form.latitude,
      longitude:   form.longitude,
      active:      form.active,
    }
    try {
      if (editing === "new") await createLocation(payload)
      else await updateLocation(editing.id, payload)
      closeForm()
      load()
    } catch (e) {
      setError("No se pudo guardar. Verifica tu conexión y permisos de admin.")
    }
    setSaving(false)
  }

  const handleDelete = async (loc) => {
    if (!window.confirm(`¿Eliminar la ubicación "${loc.name}"?`)) return
    try { await deleteLocation(loc.id); load() }
    catch { alert("No se pudo eliminar. Intenta nuevamente.") }
  }

  const toggleActive = async (loc) => {
    try { await updateLocation(loc.id, { active: !loc.active }); load() }
    catch { alert("No se pudo cambiar el estado.") }
  }

  const inp = "w-full bg-white border border-dust rounded-xl px-4 py-2.5 text-sm font-body text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all placeholder:text-mist"

  // ── Formulario (crear/editar) ──────────────────────────────────────────────
  if (editing) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-ink">
            {editing === "new" ? "Nueva ubicación" : "Editar ubicación"}
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
            <label className="font-body text-sm font-semibold text-ink mb-1.5 block">Nombre del evento</label>
            <input className={inp} placeholder="Ej: Feria Artesanal Parque Forestal"
              value={form.name} onChange={(e) => setField("name", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="font-body text-sm font-semibold text-ink mb-1.5 block">Descripción</label>
            <input className={inp} placeholder="Ej: Puesto en la entrada principal"
              value={form.description} onChange={(e) => setField("description", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="font-body text-sm font-semibold text-ink mb-1.5 block">Dirección (opcional)</label>
            <input className={inp} placeholder="Ej: Av. Cardenal José María Caro 123"
              value={form.address} onChange={(e) => setField("address", e.target.value)} />
          </div>
          <div>
            <label className="font-body text-sm font-semibold text-ink mb-1.5 block">Fecha</label>
            <input type="date" className={inp}
              value={form.event_date} onChange={(e) => setField("event_date", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-body text-sm font-semibold text-ink mb-1.5 block">Hora inicio</label>
              <input type="time" className={inp}
                value={form.start_time} onChange={(e) => setField("start_time", e.target.value)} />
            </div>
            <div>
              <label className="font-body text-sm font-semibold text-ink mb-1.5 block">Hora fin</label>
              <input type="time" className={inp}
                value={form.end_time} onChange={(e) => setField("end_time", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Mapa selector */}
        <div>
          <label className="font-body text-sm font-semibold text-ink mb-1.5 block">
            Ubicación en el mapa — haz clic para marcar el punto
          </label>
          <Suspense fallback={
            <div className="bg-sand rounded-2xl border border-dust h-[300px] flex items-center justify-center">
              <p className="font-body text-sm text-mist">Cargando mapa...</p>
            </div>
          }>
            <LocationPickerMap lat={form.latitude} lng={form.longitude} onPick={handlePick} />
          </Suspense>
          {form.latitude != null && (
            <p className="font-body text-xs text-mist mt-2">
              Coordenadas seleccionadas: {form.latitude.toFixed(5)}, {form.longitude.toFixed(5)}
            </p>
          )}
        </div>

        {/* Activo */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.active}
            onChange={(e) => setField("active", e.target.checked)}
            className="w-4 h-4 accent-teal" />
          <span className="font-body text-sm text-ink">
            Visible para clientes (activa)
          </span>
        </label>

        <button onClick={handleSave} disabled={saving}
          className="w-full bg-ink hover:bg-ink/90 disabled:opacity-60 text-white font-bold rounded-full py-3.5 transition-all text-sm">
          {saving ? "Guardando..." : "Guardar ubicación"}
        </button>
      </div>
    )
  }

  // ── Lista de ubicaciones ───────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg text-ink">Ubicaciones</h3>
        <button onClick={openNew}
          className="bg-ink hover:bg-ink/90 text-white font-bold rounded-full px-5 py-2.5 text-sm transition-all">
          Nueva ubicación
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-dust p-12 text-center">
          <p className="font-body text-sm text-mist">Cargando...</p>
        </div>
      ) : locations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dust p-12 text-center">
          <p className="font-display font-bold text-lg text-ink mb-2">Sin ubicaciones</p>
          <p className="font-body text-sm text-mist">Crea tu primera ubicación de feria o evento.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {locations.map((loc) => (
            <div key={loc.id}
              className="bg-white rounded-2xl border border-dust p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-bold text-sm text-ink">{loc.name}</span>
                  <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 border ${
                    loc.active
                      ? "bg-teal-pale text-teal-dark border-teal/30"
                      : "bg-sand text-mist border-dust"
                  }`}>
                    {loc.active ? "Activa" : "Oculta"}
                  </span>
                </div>
                <p className="font-body text-xs text-mist mt-1">
                  {fmtFecha(loc.event_date)}
                  {loc.start_time && ` · ${loc.start_time.slice(0,5)}`}
                  {loc.end_time && ` a ${loc.end_time.slice(0,5)}`}
                  {loc.address && ` · ${loc.address}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(loc)}
                  className="font-body font-semibold text-xs text-mist hover:text-ink px-3 py-1.5 rounded-full border border-dust hover:border-ink/30 transition-all">
                  {loc.active ? "Ocultar" : "Mostrar"}
                </button>
                <button onClick={() => openEdit(loc)}
                  className="font-body font-semibold text-xs text-ink px-3 py-1.5 rounded-full border border-dust hover:border-ink/30 transition-all">
                  Editar
                </button>
                <button onClick={() => handleDelete(loc)}
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
