import { useState } from "react"
import { supabase } from "../lib/supabase"
export default function Checkout({ items, total, onBack }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    comuna: "",
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep1 = () => {
    const newErrors = {}
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio"
    if (!form.rut.trim()) newErrors.rut = "El RUT es obligatorio"
    if (!form.direccion.trim())
      newErrors.direccion = "La dirección es obligatoria"
    if (!form.comuna.trim()) newErrors.comuna = "La comuna es obligatoria"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

 const handlePayment = async () => {
  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        customer_name: form.nombre,
        customer_email: form.rut,
        total: total,
        status: "pendiente"
      }
    ])

  console.log("INSERT DATA:", data)
  console.log("INSERT ERROR:", error)

  if (error) {
    alert("Error al guardar pedido")
    return
  }

  alert("Pedido guardado correctamente")
}
  const inputClasses = (field) =>
    `w-full bg-white border ${
      errors[field] ? "border-rose-berry" : "border-dust"
    } rounded-xl px-4 py-3 text-sm font-body text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all placeholder:text-mist`

  return (
    <section className="bg-sand min-h-screen py-10 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => {
              if (step === 2) {
                setStep(1)
              } else {
                onBack()
              }
            }}
            className="font-body font-semibold text-sm text-teal-dark hover:text-teal transition-colors mb-4 inline-block"
          >
            {step === 2 ? "Volver al paso anterior" : "Volver al catálogo"}
          </button>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-ink">
            Finalizar Compra
          </h1>

          {/* Step indicator — text only */}
          <div className="flex items-center gap-4 mt-4">
            <div
              className={`flex items-center gap-2 ${
                step === 1 ? "text-ink" : "text-mist"
              }`}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === 1
                    ? "bg-ink text-white"
                    : "bg-teal text-white"
                }`}
              >
                {step > 1 ? "OK" : "1"}
              </span>
              <span className="font-body text-sm font-semibold">
                Datos de Envío
              </span>
            </div>
            <div className="w-8 h-px bg-dust" />
            <div
              className={`flex items-center gap-2 ${
                step === 2 ? "text-ink" : "text-mist"
              }`}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === 2 ? "bg-ink text-white" : "bg-dust text-mist"
                }`}
              >
                2
              </span>
              <span className="font-body text-sm font-semibold">
                Resumen y Pago
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Customer Data */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-dust p-6 sm:p-8 shadow-card animate-fade-up">
            <h2 className="font-display font-bold text-xl text-ink mb-6">
              Datos del Cliente
            </h2>

            <div className="flex flex-col gap-5">
              {/* Nombre */}
              <div>
                <label
                  htmlFor="checkout-nombre"
                  className="font-body text-sm font-semibold text-ink mb-1.5 block"
                >
                  Nombre completo
                </label>
                <input
                  id="checkout-nombre"
                  type="text"
                  placeholder="Ingresa tu nombre"
                  value={form.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  className={inputClasses("nombre")}
                />
                {errors.nombre && (
                  <p className="text-rose-berry text-xs mt-1 font-semibold">
                    {errors.nombre}
                  </p>
                )}
              </div>

              {/* RUT */}
              <div>
                <label
                  htmlFor="checkout-rut"
                  className="font-body text-sm font-semibold text-ink mb-1.5 block"
                >
                  RUT
                </label>
                <input
                  id="checkout-rut"
                  type="text"
                  placeholder="12.345.678-9"
                  value={form.rut}
                  onChange={(e) => handleChange("rut", e.target.value)}
                  className={inputClasses("rut")}
                />
                {errors.rut && (
                  <p className="text-rose-berry text-xs mt-1 font-semibold">
                    {errors.rut}
                  </p>
                )}
              </div>

              {/* Dirección */}
              <div>
                <label
                  htmlFor="checkout-direccion"
                  className="font-body text-sm font-semibold text-ink mb-1.5 block"
                >
                  Dirección
                </label>
                <input
                  id="checkout-direccion"
                  type="text"
                  placeholder="Calle, número, depto."
                  value={form.direccion}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                  className={inputClasses("direccion")}
                />
                {errors.direccion && (
                  <p className="text-rose-berry text-xs mt-1 font-semibold">
                    {errors.direccion}
                  </p>
                )}
              </div>

              {/* Comuna */}
              <div>
                <label
                  htmlFor="checkout-comuna"
                  className="font-body text-sm font-semibold text-ink mb-1.5 block"
                >
                  Comuna
                </label>
                <input
                  id="checkout-comuna"
                  type="text"
                  placeholder="Ingresa tu comuna"
                  value={form.comuna}
                  onChange={(e) => handleChange("comuna", e.target.value)}
                  className={inputClasses("comuna")}
                />
                {errors.comuna && (
                  <p className="text-rose-berry text-xs mt-1 font-semibold">
                    {errors.comuna}
                  </p>
                )}
              </div>

              {/* Next button */}
              <button
                onClick={handleNext}
                id="checkout-next"
                className="w-full bg-ink hover:bg-ink/90 text-white font-bold rounded-full py-4 transition-all shadow-md mt-2"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Order Summary & Payment */}
        {step === 2 && (
          <div className="flex flex-col gap-6 animate-fade-up">
            {/* Order summary card */}
            <div className="bg-white rounded-3xl border border-dust p-6 sm:p-8 shadow-card">
              <h2 className="font-display font-bold text-xl text-ink mb-6">
                Resumen del Pedido
              </h2>

              {/* Items list */}
              <div className="flex flex-col gap-4 mb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 pb-4 border-b border-dust/50 last:border-0 last:pb-0"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-sand flex-shrink-0 border border-dust/30">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-sm text-ink line-clamp-2">
                        {item.name}
                      </p>
                      <p className="font-body text-xs text-mist mt-0.5">
                        Cantidad: {item.qty}
                      </p>
                    </div>
                    <p className="font-body font-bold text-sm text-ink flex-shrink-0">
                      ${(item.price * item.qty).toLocaleString("es-CL")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div className="flex justify-between items-center pt-4 border-t border-dust">
                <span className="font-body text-mist text-base">
                  Subtotal
                </span>
                <span className="font-display font-black text-2xl text-ink">
                  ${total.toLocaleString("es-CL")}
                </span>
              </div>
            </div>

            {/* Shipping notice — text only, no prices */}
            <div className="bg-white rounded-3xl border border-dust p-6 sm:p-8 shadow-card">
              <h3 className="font-display font-bold text-lg text-ink mb-2">
                Información de Envío
              </h3>
              <p className="font-body text-sm text-mist leading-relaxed">
                Contamos con envíos disponibles a distintas comunas. Los detalles
                del despacho serán coordinados una vez confirmada tu compra.
              </p>
            </div>

            {/* Customer data summary */}
            <div className="bg-white rounded-3xl border border-dust p-6 sm:p-8 shadow-card">
              <h3 className="font-display font-bold text-lg text-ink mb-4">
                Datos del Cliente
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Nombre", value: form.nombre },
                  { label: "RUT", value: form.rut },
                  { label: "Dirección", value: form.direccion },
                  { label: "Comuna", value: form.comuna },
                ].map((field) => (
                  <div key={field.label}>
                    <p className="font-body text-xs text-mist uppercase tracking-wider">
                      {field.label}
                    </p>
                    <p className="font-body font-semibold text-sm text-ink mt-0.5">
                      {field.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment button */}
            <button
              onClick={handlePayment}
              id="pay-webpay"
              className="w-full bg-teal hover:bg-teal-dark text-white font-bold rounded-full py-4 transition-all shadow-teal text-base"
            >
              Pagar con Webpay
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
