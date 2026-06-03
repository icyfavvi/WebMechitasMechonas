import { useState, useEffect } from "react"
import { ShoppingBag, Search, Heart, Menu, X, User } from "lucide-react"

export default function Navbar({ cartCount, onCartClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-teal text-white text-center text-xs font-body font-semibold py-2 tracking-widest uppercase">
        ✨ Envío gratis sobre $15.000 &nbsp;·&nbsp; Todo Chile &nbsp;·&nbsp; Hecho a mano con amor 🎀
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-card border-b border-dust"
          : "bg-sand border-b border-lace"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-[68px]">

          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="Mechitas Mechonas"
              className="h-11 w-auto object-contain"
            />
          </a>

          {/* Nav — desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: "Inicio", href: "#" },
              { label: "Accesorios Pelo 🎀", href: "#pelo" },
              { label: "Para Mascotas 🐾", href: "#mascotas" },
              { label: "Novedades", href: "#novedades" },
              { label: "Nosotros", href: "#nosotros" },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                className="font-body font-semibold text-[13px] text-ink/70 hover:text-teal px-3.5 py-2 rounded-full hover:bg-teal-pale transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button aria-label="Buscar" className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-ink/50 hover:text-teal hover:bg-teal-pale transition-all duration-200">
              <Search size={17} />
            </button>
            <button aria-label="Favoritos" className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-ink/50 hover:text-rose-dark hover:bg-rose-blush transition-all duration-200">
              <Heart size={17} />
            </button>
            <button aria-label="Cuenta" className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-ink/50 hover:text-teal hover:bg-teal-pale transition-all duration-200">
              <User size={17} />
            </button>

            {/* Cart */}
            <button
              onClick={onCartClick}
              aria-label={`Carrito — ${cartCount} productos`}
              className="relative flex items-center gap-2 bg-teal hover:bg-teal-dark text-white rounded-full px-4 py-2 font-semibold text-[13px] transition-all duration-200 hover:shadow-teal"
            >
              <ShoppingBag size={16} />
              <span className="hidden sm:inline">Carrito</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-berry text-white text-[10px] font-bold flex items-center justify-center leading-none border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-ink/60 hover:bg-teal-pale hover:text-teal transition-all duration-200"
              aria-label="Menú"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-64" : "max-h-0"}`}>
          <nav className="flex flex-col px-6 py-4 gap-1 bg-pearl border-t border-dust">
            {[
              { label: "Inicio", href: "#" },
              { label: "Accesorios Pelo 🎀", href: "#pelo" },
              { label: "Para Mascotas 🐾", href: "#mascotas" },
              { label: "Novedades", href: "#novedades" },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-semibold text-sm text-ink/70 hover:text-teal py-2 px-3 rounded-xl hover:bg-teal-pale transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
    </>
  )
}
