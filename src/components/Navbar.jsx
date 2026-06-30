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

    if (target === "locations") {
      onNavigate("locations")
      return
    }

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

  const nombreCorto = user?.user_metadata?.nombre?.split(" ")[0] ?? user?.email?.split("@")[0] ?? null

  if (currentView === "admin" || currentView === "account") return null

  return (
    <>
      <div className="bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center text-dark text-[11px] sm:text-xs font-semibold py-2 px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            <span className="tracking-wide">Hecho a mano en Chile con amor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="tracking-wide hidden sm:inline">Envíos a todo Chile</span>
            <span className="tracking-wide sm:hidden">Envíos a todo Chile</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V12m0 0h4.5m-4.5 0v3.75" /></svg>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white border-b border-neutral-100"
      }`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-[88px] relative">

          {/* Navegación izquierda */}
          <nav className="hidden lg:flex items-center gap-7 w-1/3">
            <button onClick={() => handleNav("hero")} className="relative font-body font-bold text-[13px] text-dark hover:text-primary transition-colors">
              Inicio
              {currentView === "shop" && <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-dark rounded-full"></span>}
            </button>
            <button onClick={() => handleNav("nosotros")} className="font-body font-bold text-[13px] text-dark/80 hover:text-dark transition-colors">
              Nosotros
            </button>
            <div className="flex items-center gap-1 cursor-pointer font-body font-bold text-[13px] text-dark/80 hover:text-dark transition-colors" onClick={() => handleNav("catalogo")}>
              Accesorios
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
            </div>
            <button onClick={() => handleNav("locations")} className="font-body font-bold text-[13px] text-dark/80 hover:text-dark transition-colors">
              Ubicaciones
            </button>
            <button onClick={() => handleNav("contacto")} className="font-body font-bold text-[13px] text-dark/80 hover:text-dark transition-colors">
              Contacto
            </button>
          </nav>

          {/* Logo central tipográfico */}
          <a href="#" onClick={(e) => {
            e.preventDefault();
            onNavigate("shop");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex flex-col items-center justify-center text-center py-2 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary mb-[-12px] z-10 relative">
              <path d="M12 13c-2.5-1-5-3-7-1.5.5 3.5 3 5 4 5.5-2 1-4.5 2-4.5 4.5 2.5 1.5 5.5-1.5 7-3 1-1 0-2.5-.5-3.5h2c-.5 1-1.5 2.5-.5 3.5 1.5 1.5 4.5 4.5 7 3 0-2.5-2.5-3.5-4.5-4.5 1-.5 3.5-2 4-5.5-2-1.5-4.5.5-7 1.5z" />
              <circle cx="12" cy="11.5" r="2.5" />
            </svg>
            <span className="font-display text-4xl sm:text-[44px] text-dark leading-[0.75] mt-1 -ml-2">Mechitas</span>
            <span className="font-display text-4xl sm:text-[44px] text-dark leading-[0.75] relative z-10 ml-4">Mechonas</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-primary my-1">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <span className="font-body font-bold text-[7px] sm:text-[8px] text-primary tracking-[0.25em]">ACCESORIOS PARA TI Y TU MASCOTA</span>
          </a>

          {/* Acciones derecha */}
          <div className="flex items-center justify-end gap-4 lg:gap-6 w-1/3">
            <button className="text-dark hover:text-primary transition-colors hidden sm:block">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[22px] h-[22px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>

            <div className="relative hidden sm:block" ref={accountRef}>
              <button onClick={() => setAccountOpen(o => !o)} className="text-dark hover:text-primary transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[22px] h-[22px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-card py-2 min-w-[200px] z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-2 font-body text-xs font-bold text-neutral-500 uppercase tracking-wider">{nombreCorto}</div>
                      <button onClick={() => { setAccountOpen(false); onNavigate("account") }} className="w-full text-left px-4 py-2 font-body text-sm text-dark hover:bg-neutral-50 transition-colors">Mis pedidos</button>
                      {isAdmin && (
                        <button onClick={() => { setAccountOpen(false); onNavigate("admin") }} className="w-full text-left px-4 py-2 font-body text-sm text-dark hover:bg-neutral-50 transition-colors">Panel de administración</button>
                      )}
                      <div className="border-t border-neutral-100 my-1" />
                      <button onClick={() => { setAccountOpen(false); onLogout() }} className="w-full text-left px-4 py-2 font-body text-sm text-neutral-500 hover:text-dark hover:bg-neutral-50 transition-colors">Cerrar sesión</button>
                    </>
                  ) : (
                    <button onClick={() => { setAccountOpen(false); onOpenAuth() }} className="w-full text-left px-4 py-2 font-body text-sm text-dark hover:bg-neutral-50 transition-colors">Ingresar / Registrarse</button>
                  )}
                </div>
              )}
            </div>

            <button onClick={onCartClick} className="relative text-dark hover:text-primary transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[22px] h-[22px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <span className="absolute -top-1.5 -right-2.5 bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {cartCount}
              </span>
            </button>

            {/* Botón menú móvil */}
            <button onClick={() => setMobileOpen(o => !o)} className="lg:hidden text-dark hover:text-primary ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                {mobileOpen 
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-[500px]" : "max-h-0"}`}>
          <nav className="flex flex-col px-6 py-4 gap-1 bg-white border-t border-neutral-100">
            {[{ label: "Inicio", target: "hero" }, { label: "Catálogo", target: "catalogo" }, { label: "Ubicaciones", target: "locations" }, { label: "Nosotros", target: "nosotros" }].map((link) => (
              <button key={link.label} onClick={() => handleNav(link.target)} className="font-bold text-sm text-dark hover:text-primary py-2.5 px-2 rounded-xl hover:bg-neutral-50 transition-all text-left">
                {link.label}
              </button>
            ))}
            <div className="border-t border-neutral-100 mt-2 pt-2">
              {user ? (
                <>
                  <button onClick={() => { setMobileOpen(false); onNavigate("account") }} className="w-full font-body font-bold text-sm text-dark py-2.5 px-2 rounded-xl hover:bg-neutral-50 transition-all text-left">Mis pedidos ({nombreCorto})</button>
                  {isAdmin && (
                     <button onClick={() => { setMobileOpen(false); onNavigate("admin") }} className="w-full font-body font-bold text-sm text-dark py-2.5 px-2 rounded-xl hover:bg-neutral-50 transition-all text-left">Panel de administración</button>
                  )}
                  <button onClick={() => { setMobileOpen(false); onLogout() }} className="w-full font-body text-sm text-neutral-500 py-2.5 px-2 rounded-xl hover:bg-neutral-50 transition-all text-left">Cerrar sesión</button>
                </>
              ) : (
                <button onClick={() => { setMobileOpen(false); onOpenAuth() }} className="w-full font-body font-bold text-sm text-dark py-2.5 px-2 rounded-xl hover:bg-neutral-50 transition-all text-left">Ingresar / Crear cuenta</button>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}
