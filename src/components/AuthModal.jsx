// src/components/AuthModal.jsx
// Modal de autenticación — inicio de sesión y creación de cuentas con Supabase Auth.
// Las contraseñas se cifran automáticamente con bcrypt en Supabase; no se almacenan
// en texto plano en ningún momento.

import { useState } from "react"
import { supabase, translateAuthError } from "../lib/supabase"

export default function AuthModal({ onClose, onAuthSuccess }) {
  const [tab,     setTab]     = useState("login")
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState("")
  const [success, setSuccess] = useState("")

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPass,  setLoginPass]  = useState("")

  const [regNombre,  setRegNombre]  = useState("")
  const [regEmail,   setRegEmail]   = useState("")
  const [regPass,    setRegPass]    = useState("")
  const [regConfirm, setRegConfirm] = useState("")

  const clear = () => { setError(""); setSuccess("") }
  const switchTab = (t) => { setTab(t); clear() }

  // ── Iniciar sesión ─────────────────────────────────────────────────────────
  const handleLogin = async () => {
    clear()
    if (!loginEmail.trim() || !loginPass) {
      setError("Completa todos los campos.")
      return
    }
    setLoading(true)
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email:    loginEmail.trim().toLowerCase(),
      password: loginPass,
    })
    setLoading(false)
    if (err) { setError(translateAuthError(err.message)); return }
    onAuthSuccess(data.user)
    onClose()
  }

  // ── Crear cuenta ───────────────────────────────────────────────────────────
  const handleRegister = async () => {
    clear()
    if (!regNombre.trim()) { setError("Ingresa tu nombre."); return }
    if (!regEmail.trim())  { setError("Ingresa tu correo electrónico."); return }
    if (regPass.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }
    if (regPass !== regConfirm) {
      setError("Las contraseñas no coinciden.")
      return
    }
    setLoading(true)
    // Supabase hashea la contraseña con bcrypt automáticamente antes de guardarla.
    const { data, error: err } = await supabase.auth.signUp({
      email:    regEmail.trim().toLowerCase(),
      password: regPass,
      options: { data: { nombre: regNombre.trim() } },
    })
    setLoading(false)
    if (err) { setError(translateAuthError(err.message)); return }
    if (data.user && data.session) {
      onAuthSuccess(data.user)
      onClose()
      return
    }
    // Si la confirmación de correo está activada en Supabase
    setSuccess(
      "¡Cuenta creada! Revisa tu correo electrónico y confirma tu cuenta para poder ingresar."
    )
  }

  const inp = `w-full bg-white border border-dust rounded-xl px-4 py-3 text-sm font-body text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all placeholder:text-mist`

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl border border-dust shadow-2xl w-full max-w-sm overflow-hidden">

        {/* Cabecera */}
        <div className="px-8 pt-8 pb-0 text-center">
          <img
            src="/image_11cb63.png"
            alt="Mechitas Mechonas"
            className="h-10 w-auto object-contain mx-auto mb-5"
          />
          {/* Pestañas */}
          <div className="flex border-b border-dust mb-6">
            {[
              { key: "login",    label: "Iniciar sesión" },
              { key: "register", label: "Crear cuenta" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => switchTab(t.key)}
                className={`flex-1 pb-3 font-body font-semibold text-sm transition-all ${
                  tab === t.key
                    ? "text-ink border-b-2 border-ink -mb-px"
                    : "text-mist hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-8 pb-8 flex flex-col gap-4">

          {/* Mensajes */}
          {error && (
            <div className="bg-rose-blush border border-rose-berry/30 rounded-xl px-4 py-3">
              <p className="font-body text-xs text-rose-berry font-semibold">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-teal-pale border border-teal/30 rounded-xl px-4 py-3">
              <p className="font-body text-xs text-teal-dark font-semibold">{success}</p>
            </div>
          )}

          {/* ── Iniciar sesión ── */}
          {tab === "login" && (
            <>
              <div>
                <label className="font-body text-sm font-semibold text-ink mb-1.5 block">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={loginEmail}
                  autoComplete="email"
                  onChange={(e) => { setLoginEmail(e.target.value); clear() }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className={inp}
                />
              </div>
              <div>
                <label className="font-body text-sm font-semibold text-ink mb-1.5 block">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Tu contraseña"
                  value={loginPass}
                  autoComplete="current-password"
                  onChange={(e) => { setLoginPass(e.target.value); clear() }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className={inp}
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-ink hover:bg-ink/90 disabled:opacity-60 text-white font-bold rounded-full py-3.5 transition-all text-sm mt-1"
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
              <button
                onClick={() => switchTab("register")}
                className="text-center font-body text-sm text-mist hover:text-ink transition-colors"
              >
                ¿No tienes cuenta? Crea una aquí
              </button>
            </>
          )}

          {/* ── Crear cuenta ── */}
          {tab === "register" && (
            <>
              <div>
                <label className="font-body text-sm font-semibold text-ink mb-1.5 block">
                  Nombre completo
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={regNombre}
                  autoComplete="name"
                  onChange={(e) => { setRegNombre(e.target.value); clear() }}
                  className={inp}
                />
              </div>
              <div>
                <label className="font-body text-sm font-semibold text-ink mb-1.5 block">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={regEmail}
                  autoComplete="email"
                  onChange={(e) => { setRegEmail(e.target.value); clear() }}
                  className={inp}
                />
              </div>
              <div>
                <label className="font-body text-sm font-semibold text-ink mb-1.5 block">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={regPass}
                  autoComplete="new-password"
                  onChange={(e) => { setRegPass(e.target.value); clear() }}
                  className={inp}
                />
              </div>
              <div>
                <label className="font-body text-sm font-semibold text-ink mb-1.5 block">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={regConfirm}
                  autoComplete="new-password"
                  onChange={(e) => { setRegConfirm(e.target.value); clear() }}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                  className={inp}
                />
              </div>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-ink hover:bg-ink/90 disabled:opacity-60 text-white font-bold rounded-full py-3.5 transition-all text-sm mt-1"
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
              <button
                onClick={() => switchTab("login")}
                className="text-center font-body text-sm text-mist hover:text-ink transition-colors"
              >
                ¿Ya tienes cuenta? Inicia sesión aquí
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
