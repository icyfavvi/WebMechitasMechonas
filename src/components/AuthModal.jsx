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

  const inp = `w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm font-body text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-neutral-500`

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-dark/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl border border-neutral-200 shadow-2xl w-full max-w-sm overflow-hidden">

        {/* Cabecera */}
        <div className="px-8 pt-8 pb-0 text-center">
          <h2 className="font-display font-black text-2xl text-dark mb-5 leading-tight">
            Mechitas<br />Mechonas
          </h2>
          {/* Pestañas */}
          <div className="flex border-b border-neutral-200 mb-6">
            {[
              { key: "login",    label: "Iniciar sesión" },
              { key: "register", label: "Crear cuenta" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => switchTab(t.key)}
                className={`flex-1 pb-3 font-body font-bold text-sm transition-all ${
                  tab === t.key
                    ? "text-dark border-b-2 border-dark -mb-px"
                    : "text-neutral-500 hover:text-dark"
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
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="font-body text-xs text-red-500 font-bold">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <p className="font-body text-xs text-green-600 font-bold">{success}</p>
            </div>
          )}

          {/* ── Iniciar sesión ── */}
          {tab === "login" && (
            <>
              <div>
                <label className="font-body text-sm font-bold text-dark mb-1.5 block">
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
                <label className="font-body text-sm font-bold text-dark mb-1.5 block">
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
                className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-bold rounded-full py-3.5 transition-all text-sm mt-1 shadow-primary"
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
              <button
                onClick={() => switchTab("register")}
                className="text-center font-body text-sm text-neutral-500 hover:text-primary transition-colors font-bold"
              >
                ¿No tienes cuenta? Crea una aquí
              </button>
            </>
          )}

          {/* ── Crear cuenta ── */}
          {tab === "register" && (
            <>
              <div>
                <label className="font-body text-sm font-bold text-dark mb-1.5 block">
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
                <label className="font-body text-sm font-bold text-dark mb-1.5 block">
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
                <label className="font-body text-sm font-bold text-dark mb-1.5 block">
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
                <label className="font-body text-sm font-bold text-dark mb-1.5 block">
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
                className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-bold rounded-full py-3.5 transition-all text-sm mt-1 shadow-primary"
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
              <button
                onClick={() => switchTab("login")}
                className="text-center font-body text-sm text-neutral-500 hover:text-primary transition-colors font-bold"
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
