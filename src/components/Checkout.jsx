// src/components/Checkout.jsx
// Flujo de compra en 3 pasos: Datos → Resumen → Confirmación
// Guarda todos los datos del cliente en columnas planas en Supabase.

import { useState, useEffect } from "react"
import { SHIPPING_RATES, getShipping } from "../data/shipping"

export default function Checkout({ items, total, onBack, onPlaceOrder, user }) {
  const [step,       setStep]       = useState(1)
  const [orderId,    setOrderId]    = useState(null)
  const [placing,    setPlacing]    = useState(false)
  const [placeError, setPlaceError] = useState("")

  const [form, setForm] = useState({
    nombre:       "",
    email:        "",
    rut:          "",
    phone:        "",
    direccion:    "",
    region:       "",
    comuna:       "",
    observaciones:"",
  })
  const [errors, setErrors] = useState({})

  // Pre-rellenar email si el usuario está autenticado
  useEffect(() => {
    if (user?.email && !form.email) {
      setForm((f) => ({ ...f, email: user.email }))
    }
    if (user?.user_metadata?.nombre && !form.nombre) {
      setForm((f) => ({ ...f, nombre: user.user_metadata.nombre }))
    }
  }, [user])

  // ── Cálculo de envío ────────────────────────────────────────────────────
  const { cost: shippingCost, isFree, rate: shippingRate } = getShipping(form.region, total)
  const grandTotal = total + shippingCost

  // ── Helpers ─────────────────────────────────────────────────────────────
  const setField = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }))
  }

  const validateStep1 = () => {
    const e = {}
    if (!form.nombre.trim())    e.nombre    = "El nombre es obligatorio."
    if (!form.email.trim())     e.email     = "El correo electrónico es obligatorio."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                e.email     = "Ingresa un correo electrónico válido."
    if (!form.rut.trim())       e.rut       = "El RUT es obligatorio."
    if (!form.direccion.trim()) e.direccion = "La dirección es obligatoria."
    if (!form.region)           e.region    = "Selecciona tu región."
    if (!form.comuna.trim())    e.comuna    = "La comuna es obligatoria."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePayment = async () => {
    setPlaceError("")
    if (!onPlaceOrder) {
      alert("Pago pendiente de integración con Webpay.")
      return
    }
    setPlacing(true)
    const newId = await onPlaceOrder({
      // Datos del cliente — columnas planas
      customer_name:    form.nombre.trim(),
      customer_email:   form.email.trim().toLowerCase(),
      customer_rut:     form.rut.trim(),
      customer_phone:   form.phone.trim(),
      customer_address: form.direccion.trim(),
      customer_comuna:  form.comuna.trim(),
      customer_region:  shippingRate?.region ?? form.region,
      notes:            form.observaciones.trim(),
      // Productos y montos
      items,
      subtotal:         total,
      shipping_cost:    shippingCost,
      shipping_region:  shippingRate?.region ?? "",
      shipping_zone:    shippingRate?.zone ?? "",
      shipping_is_free: isFree,
      total:            grandTotal,
    })
    setPlacing(false)

    if (newId) {
      setOrderId(newId)
      setStep(3)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      setPlaceError(
        "No se pudo registrar el pedido. Revisa tu conexión e intenta nuevamente."
      )
    }
  }

  const inp = (field) =>
    `w-full bg-white border ${
      errors[field] ? "border-red-400 focus:ring-red-100" : "border-neutral-200"
    } rounded-xl px-4 py-3 text-sm font-body text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-neutral-500`

  const Err = ({ field }) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1 font-semibold">{errors[field]}</p>
    ) : null

  return (
    <section className="bg-neutral-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Cabecera y pasos */}
        {step < 3 && (
          <div className="mb-8">
            <button
              onClick={() => (step === 2 ? setStep(1) : onBack())}
              className="font-body font-bold text-sm text-primary hover:text-primary-dark transition-colors mb-4 inline-block"
            >
              {step === 2 ? "Volver al paso anterior" : "Volver al catálogo"}
            </button>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-dark">
              Finalizar Compra
            </h1>
            <div className="flex items-center gap-4 mt-4">
              {[
                { n: 1, label: "Datos de Envío" },
                { n: 2, label: "Resumen y Pago" },
              ].map(({ n, label }, i) => (
                <div key={n} className="flex items-center gap-2">
                  {i > 0 && <div className="w-8 h-px bg-neutral-200" />}
                  <div className={`flex items-center gap-2 ${step === n ? "text-dark" : "text-neutral-500"}`}>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        step > n ? "bg-primary text-white" : step === n ? "bg-dark text-white" : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      {step > n ? "OK" : n}
                    </span>
                    <span className="font-body text-sm font-bold">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ PASO 1 — Datos del cliente ════ */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-card">
            <h2 className="font-display font-bold text-xl text-dark mb-6">Datos del Cliente</h2>
            <div className="flex flex-col gap-5">

              {/* Nombre */}
              <div>
                <label className="font-body text-sm font-bold text-dark mb-1.5 block">
                  Nombre completo
                </label>
                <input type="text" placeholder="Ingresa tu nombre completo"
                  value={form.nombre} onChange={(e) => setField("nombre", e.target.value)}
                  className={inp("nombre")} />
                <Err field="nombre" />
              </div>

              {/* Email */}
              <div>
                <label className="font-body text-sm font-bold text-dark mb-1.5 block">
                  Correo electrónico
                </label>
                <input type="email" placeholder="tu@correo.com"
                  value={form.email} onChange={(e) => setField("email", e.target.value)}
                  autoComplete="email"
                  className={inp("email")} />
                <Err field="email" />
              </div>

              {/* RUT y Teléfono en fila */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm font-bold text-dark mb-1.5 block">
                    RUT
                  </label>
                  <input type="text" placeholder="12.345.678-9"
                    value={form.rut} onChange={(e) => setField("rut", e.target.value)}
                    className={inp("rut")} />
                  <Err field="rut" />
                </div>
                <div>
                  <label className="font-body text-sm font-bold text-dark mb-1.5 block">
                    Teléfono <span className="text-neutral-500 font-normal">(opcional)</span>
                  </label>
                  <input type="tel" placeholder="+56 9 1234 5678"
                    value={form.phone} onChange={(e) => setField("phone", e.target.value)}
                    className={inp("phone")} />
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className="font-body text-sm font-bold text-dark mb-1.5 block">
                  Dirección
                </label>
                <input type="text" placeholder="Calle, número, depto."
                  value={form.direccion} onChange={(e) => setField("direccion", e.target.value)}
                  className={inp("direccion")} />
                <Err field="direccion" />
              </div>

              {/* Región */}
              <div>
                <label className="font-body text-sm font-bold text-dark mb-1.5 block">
                  Región
                </label>
                <select value={form.region}
                  onChange={(e) => setField("region", e.target.value)}
                  className={`${inp("region")} cursor-pointer`}
                >
                  <option value="">Selecciona tu región</option>
                  {SHIPPING_RATES.map((r) => (
                    <option key={r.code} value={r.code}>{r.region}</option>
                  ))}
                </select>
                <Err field="region" />

                {/* Preview del costo de envío */}
                {form.region && shippingRate && (
                  <div className={`mt-2 rounded-xl px-4 py-3 text-sm font-body flex items-center justify-between gap-2 border ${
                    isFree
                      ? "bg-primary-pale border-primary/30 text-primary-dark"
                      : "bg-neutral-50 border-neutral-200 text-neutral-500"
                  }`}>
                    <span>
                      {isFree
                        ? "Envío gratis para esta región"
                        : `Costo de envío: $${shippingCost.toLocaleString("es-CL")}`}
                    </span>
                    <span className="text-xs font-bold opacity-70 flex-shrink-0">
                      {shippingRate.days}
                    </span>
                  </div>
                )}
                {form.region && shippingRate && !isFree && shippingRate.freeAbove && (
                  <p className="text-xs text-neutral-500 mt-1.5 font-body">
                    Envío gratis al comprar ${shippingRate.freeAbove.toLocaleString("es-CL")} o más.
                  </p>
                )}
              </div>

              {/* Comuna */}
              <div>
                <label className="font-body text-sm font-bold text-dark mb-1.5 block">
                  Ciudad / Comuna
                </label>
                <input type="text" placeholder="Ingresa tu comuna"
                  value={form.comuna} onChange={(e) => setField("comuna", e.target.value)}
                  className={inp("comuna")} />
                <Err field="comuna" />
              </div>

              {/* Observaciones */}
              <div>
                <label className="font-body text-sm font-bold text-dark mb-1.5 block">
                  Observaciones <span className="text-neutral-500 font-normal">(opcional)</span>
                </label>
                <textarea
                  placeholder="Instrucciones especiales, referencia de dirección, etc."
                  value={form.observaciones}
                  onChange={(e) => setField("observaciones", e.target.value)}
                  rows={2}
                  className={`${inp("observaciones")} resize-none`}
                />
              </div>

              <button onClick={handleNext} id="checkout-next"
                className="w-full bg-dark hover:bg-neutral-800 text-white font-bold rounded-full py-4 transition-all shadow-md mt-2">
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* ════ PASO 2 — Resumen y Pago ════ */}
        {step === 2 && (
          <div className="flex flex-col gap-6">

            {/* Productos */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-card">
              <h2 className="font-display font-bold text-xl text-dark mb-6">Resumen del Pedido</h2>
              <div className="flex flex-col gap-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-neutral-200 last:border-0 last:pb-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-bold text-sm text-dark line-clamp-2">{item.name}</p>
                      <p className="font-body text-xs text-neutral-500 mt-0.5">Cantidad: {item.qty}</p>
                    </div>
                    <p className="font-body font-bold text-sm text-dark flex-shrink-0">
                      ${(item.price * item.qty).toLocaleString("es-CL")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-200 pt-4 flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <span className="font-body text-neutral-500 text-sm">Subtotal</span>
                  <span className="font-body font-bold text-sm text-dark">
                    ${total.toLocaleString("es-CL")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-neutral-500 text-sm">
                    Envío{shippingRate ? ` — ${shippingRate.zone}` : ""}
                  </span>
                  {isFree
                    ? <span className="font-body font-bold text-sm text-primary">GRATIS</span>
                    : <span className="font-body font-bold text-sm text-dark">
                        ${shippingCost.toLocaleString("es-CL")}
                      </span>
                  }
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-neutral-200 mt-1">
                  <span className="font-body font-bold text-base text-dark">Total a pagar</span>
                  <span className="font-display font-black text-2xl text-primary">
                    ${grandTotal.toLocaleString("es-CL")}
                  </span>
                </div>
              </div>
            </div>

            {/* Info de envío */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-card">
              <h3 className="font-display font-bold text-lg text-dark mb-4">Información de Envío</h3>
              {shippingRate ? (
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="font-body font-bold text-sm text-dark">{shippingRate.region}</p>
                    <p className="font-body text-xs text-neutral-500 mt-0.5">Zona {shippingRate.zone}</p>
                  </div>
                  <p className="font-body text-sm text-dark">
                    Entrega estimada: <span className="font-bold">{shippingRate.days}</span>
                  </p>
                  <div className={`rounded-xl px-4 py-3 flex items-center justify-between border ${
                    isFree ? "bg-primary-pale border-primary/30" : "bg-neutral-50 border-neutral-200"
                  }`}>
                    <span className="font-body text-sm font-bold text-dark">
                      {isFree ? "Envío gratis aplicado" : "Costo de envío"}
                    </span>
                    <span className={`font-display font-black text-lg ${isFree ? "text-primary" : "text-dark"}`}>
                      {isFree ? "GRATIS" : `$${shippingCost.toLocaleString("es-CL")}`}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="font-body text-sm text-neutral-500">No se pudo calcular el envío.</p>
              )}
            </div>

            {/* Datos del cliente — resumen */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-card">
              <h3 className="font-display font-bold text-lg text-dark mb-4">Datos del Cliente</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { l: "Nombre",   v: form.nombre },
                  { l: "Correo",   v: form.email },
                  { l: "RUT",      v: form.rut },
                  { l: "Teléfono", v: form.phone || "—" },
                  { l: "Dirección",v: form.direccion },
                  { l: "Región",   v: shippingRate?.region ?? form.region },
                  { l: "Comuna",   v: form.comuna },
                  ...(form.observaciones ? [{ l: "Observaciones", v: form.observaciones }] : []),
                ].map(({ l, v }) => (
                  <div key={l} className={l === "Dirección" || l === "Observaciones" ? "sm:col-span-2" : ""}>
                    <p className="font-body text-xs text-neutral-500 uppercase tracking-wider">{l}</p>
                    <p className="font-body font-bold text-sm text-dark mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {placeError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
                <p className="font-body text-sm font-bold text-red-500">{placeError}</p>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={placing}
              id="pay-webpay"
              className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-full shadow-primary-lg hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 transition-all text-base"
            >
              {placing
                ? "Registrando pedido..."
                : `Pagar $${grandTotal.toLocaleString("es-CL")} con Webpay`}
            </button>
          </div>
        )}

        {/* ════ PASO 3 — Confirmación ════ */}
        {step === 3 && (
          <div className="flex flex-col items-center text-center gap-6 py-8">
            <div className="w-24 h-24 bg-primary-pale rounded-full flex items-center justify-center border-4 border-primary/30">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-dark mb-2">
                ¡Pedido recibido!
              </h1>
              <p className="font-body text-neutral-500 text-sm">
                Gracias por tu compra, <strong className="text-dark">{form.nombre.split(" ")[0]}</strong>
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-card w-full max-w-sm">
              <p className="font-body text-xs text-neutral-500 uppercase tracking-wider mb-1">
                Número de pedido
              </p>
              <p className="font-display font-black text-2xl text-dark mb-4">{orderId}</p>

              <div
                className="flex items-center justify-center rounded-xl px-4 py-2.5 mb-4 border"
                style={{ backgroundColor: "#fff8dc", borderColor: "#f5c842" }}
              >
                <span className="font-body font-bold text-sm" style={{ color: "#a07a10" }}>
                  Pendiente de pago
                </span>
              </div>

              <p className="font-body text-xs text-neutral-500 leading-relaxed">
                Verificaremos tu pago y actualizaremos el estado del pedido.
                Te contactaremos al correo <strong>{form.email}</strong>.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-neutral-200 p-5 shadow-card w-full max-w-sm text-left">
              <p className="font-body text-xs text-neutral-500 uppercase tracking-wider mb-3">Resumen</p>
              <div className="flex flex-col gap-1.5 text-sm font-body">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Dirección</span>
                  <span className="text-dark font-bold text-right max-w-[60%]">
                    {form.direccion}, {form.comuna}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Región</span>
                  <span className="text-dark font-bold">{shippingRate?.region ?? form.region}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-200 pt-2 mt-1">
                  <span className="text-dark font-bold">Total pagado</span>
                  <span className="text-dark font-bold">${grandTotal.toLocaleString("es-CL")}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onBack}
              className="font-body font-bold text-sm text-primary hover:text-primary-dark transition-colors mt-2"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
