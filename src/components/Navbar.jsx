// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react"

export default function Navbar({
  cartCount, onCartClick, onNavigate, currentView,
  user, isAdmin, onOpenAuth, onLogout,
}) {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  useEffect(() => {
    const fn = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target))
        setAccountOpen(false)
    }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  const handleNav = (target) => {
    setMobileOpen(false)
    setAccountOpen(false)
    if (currentView !== "shop") {
      onNavigate("shop")
      setTimeout(() => {
        const el = document.getElementById(target)
        if (el) el.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } else {
      const el = document.getElementById(target)
      if (el) el.scrollIntoView({ behavior: "smooth" })
    }
  }

  const nombreCorto =
    user?.user_metadata?.nombre?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    null

  // Ocultar en paneles con su propio encabezado
  if (currentView === "admin" || currentView === "account") return null

  return (
    <>
      <div className="bg-ink text-white text-center text-[11px] font-body font-semibold py-2.5 tracking-[0.2em] uppercase">
        Envíos disponibles a todo el país &nbsp;&middot;&nbsp; Diseño y confección artesanal
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-dust"
          : "bg-white border-b border-dust/50"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-[72px]">

          {/* Logo */}
          <a href="#" onClick={(e) => {
            e.preventDefault()
            onNavigate("shop")
            window.scrollTo({ top: 0, behavior: "smooth" })
          }} className="flex-shrink-0">
            <img src="/image_11cb63.png" alt="Mechitas Mechonas" className="h-10 w-auto object-contain" />
          </a>

          {/* Navegación — escritorio */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: "Inicio",    target: "hero" },
              { label: "Catálogo",  target: "catalogo" },
              { label: "Nosotros",  target: "nosotros" },
            ].map((link) => (
              <button key={link.label} onClick={() => handleNav(link.target)}
                className="font-body font-semibold text-[13px] text-ink/75 hover:text-ink px-4 py-2 rounded-full hover:bg-sand transition-all duration-300">
                {link.label}
              </button>
            ))}
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-2">

            {/* Cuenta — escritorio */}
            <div className="hidden lg:block relative" ref={accountRef}>
              {user ? (
                <>
                  <button onClick={() => setAccountOpen(o => !o)}
                    className="font-body font-semibold text-[13px] text-ink/75 hover:text-ink px-4 py-2 rounded-full hover:bg-sand transition-all duration-300">
                    {nombreCorto}
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 top-full mt-2 bg-white border border-dust rounded-2xl shadow-lg py-2 min-w-[200px] z-50">
                      <button
                        onClick={() => { setAccountOpen(false); onNavigate("account") }}
                        className="w-full text-left px-4 py-2.5 font-body text-sm text-ink hover:bg-sand transition-colors">
                        Mis pedidos
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => { setAccountOpen(false); onNavigate("admin") }}
                          className="w-full text-left px-4 py-2.5 font-body text-sm text-ink hover:bg-sand transition-colors">
                          Panel de administración
                        </button>
                      )}
                      <div className="border-t border-dust my-1" />
                      <button
                        onClick={() => { setAccountOpen(false); onLogout() }}
                        className="w-full text-left px-4 py-2.5 font-body text-sm text-mist hover:text-ink hover:bg-sand transition-colors">
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button onClick={onOpenAuth}
                  className="font-body font-semibold text-[13px] text-ink/75 hover:text-ink px-4 py-2 rounded-full border border-dust hover:border-ink/40 transition-all duration-300">
                  Ingresar
                </button>
              )}
            </div>

            {/* Carrito */}
            <button onClick={onCartClick} id="cart-button"
              className="relative flex items-center gap-2 bg-ink hover:bg-ink/90 text-white rounded-full px-5 py-2.5 font-semibold text-[13px] transition-all duration-300">
              <span>Carrito</span>
              {cartCount > 0 && (
                <span className="bg-teal-dark text-white text-[11px] font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center leading-none px-1">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Botón menú móvil */}
            <button onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden rounded-full px-4 py-2 text-[13px] font-semibold text-ink/75 hover:text-ink hover:bg-sand transition-all duration-300">
              {mobileOpen ? "Cerrar" : "Menú"}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-[500px]" : "max-h-0"}`}>
          <nav className="flex flex-col px-6 py-4 gap-1 bg-white border-t border-dust">
            {[
              { label: "Inicio",   target: "hero" },
              { label: "Catálogo", target: "catalogo" },
              { label: "Nosotros", target: "nosotros" },
            ].map((link) => (
              <button key={link.label} onClick={() => handleNav(link.target)}
                className="font-semibold text-sm text-ink/75 hover:text-ink py-2.5 px-4 rounded-xl hover:bg-sand transition-all text-left">
                {link.label}
              </button>
            ))}

            <div className="border-t border-dust mt-2 pt-2">
              {user ? (
                <>
                  <button onClick={() => { setMobileOpen(false); onNavigate("account") }}
                    className="w-full font-body font-semibold text-sm text-ink py-2.5 px-4 rounded-xl hover:bg-sand transition-all text-left">
                    Mis pedidos ({nombreCorto})
                  </button>
                  {isAdmin && (
                    <button onClick={() => { setMobileOpen(false); onNavigate("admin") }}
                      className="w-full font-body font-semibold text-sm text-ink py-2.5 px-4 rounded-xl hover:bg-sand transition-all text-left">
                      Panel de administración
                    </button>
                  )}
                  <button onClick={() => { setMobileOpen(false); onLogout() }}
                    className="w-full font-body text-sm text-mist py-2.5 px-4 rounded-xl hover:bg-sand transition-all text-left">
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <button onClick={() => { setMobileOpen(false); onOpenAuth() }}
                  className="w-full font-body font-semibold text-sm text-ink py-2.5 px-4 rounded-xl hover:bg-sand transition-all text-left">
                  Ingresar / Crear cuenta
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}
