// src/components/Layout.jsx
import { useState } from "react";
import { ShoppingBag, User, Menu, X, Heart, Search } from "lucide-react";

/* ── Datos de navegación ─────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Inicio",      href: "#" },
  { label: "Catálogo",    href: "#catalogo" },
  { label: "Novedades",   href: "#novedades" },
  { label: "Acerca de",   href: "#acerca" },
  { label: "Contacto",    href: "#contacto" },
];

/* ─────────────────────────────────────────────────────────────── */
/*  NAVBAR                                                         */
/* ─────────────────────────────────────────────────────────────── */
function Navbar({ cartCount = 0 }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-coquette-cream/90 backdrop-blur-md border-b border-coquette-dust/40 shadow-soft">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="flex flex-col leading-none select-none group">
          <span className="font-script text-2xl text-coquette-burgundy group-hover:text-coquette-mauve transition-colors duration-250">
            Mechitas
          </span>
          <span className="font-display text-[10px] tracking-[0.25em] text-coquette-mist uppercase -mt-1">
            Mechonas
          </span>
        </a>

        {/* Links — desktop */}
        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="font-body text-sm text-coquette-mist hover:text-coquette-burgundy transition-colors duration-250 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-coquette-petal group-hover:w-full transition-all duration-350" />
              </a>
            </li>
          ))}
        </ul>

        {/* Iconos de acción */}
        <div className="flex items-center gap-2">
          {/* Búsqueda */}
          <button
            aria-label="Buscar"
            className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-coquette-mist hover:bg-coquette-blush hover:text-coquette-burgundy transition-all duration-250"
          >
            <Search size={18} />
          </button>

          {/* Favoritos */}
          <button
            aria-label="Favoritos"
            className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-coquette-mist hover:bg-coquette-blush hover:text-coquette-burgundy transition-all duration-250"
          >
            <Heart size={18} />
          </button>

          {/* Cuenta */}
          <button
            aria-label="Mi cuenta"
            className="w-9 h-9 rounded-full flex items-center justify-center text-coquette-mist hover:bg-coquette-blush hover:text-coquette-burgundy transition-all duration-250"
          >
            <User size={18} />
          </button>

          {/* Carrito */}
          <button
            aria-label={`Carrito — ${cartCount} productos`}
            className="relative w-9 h-9 rounded-full flex items-center justify-center bg-coquette-blush text-coquette-burgundy hover:bg-coquette-petal transition-all duration-250 shadow-soft"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[1.1rem] px-1 rounded-full bg-coquette-burgundy text-white text-[10px] font-body font-bold flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menú"
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-coquette-mist hover:bg-coquette-blush transition-all duration-250"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Menú mobile */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-350 ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col px-6 py-4 gap-3 border-t border-coquette-dust/40 bg-coquette-pearl">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-body text-sm text-coquette-ink hover:text-coquette-burgundy transition-colors duration-250"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  FOOTER                                                         */
/* ─────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-coquette-lace border-t border-coquette-dust/40 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Marca */}
          <div className="lg:col-span-1 flex flex-col gap-3">
            <div className="leading-none">
              <p className="font-script text-2xl text-coquette-burgundy">Mechitas</p>
              <p className="font-display text-[10px] tracking-[0.25em] text-coquette-mist uppercase">
                Mechonas
              </p>
            </div>
            <p className="font-body text-sm text-coquette-mist leading-relaxed">
              Accesorios para el cabello hechos con amor 🎀 Cada pieza es única y artesanal.
            </p>
            {/* Redes sociales */}
            <div className="flex gap-2 mt-1">
              {["IG", "FB", "TK"].map((red) => (
                <a
                  key={red}
                  href="#"
                  className="w-8 h-8 rounded-full bg-coquette-blush text-coquette-burgundy flex items-center justify-center font-body text-[10px] font-bold hover:bg-coquette-petal transition-all duration-250"
                >
                  {red}
                </a>
              ))}
            </div>
          </div>

          {/* Tienda */}
          <FooterCol
            title="Tienda"
            links={["Nuevos Productos", "Lazos", "Scrunchies", "Pinches", "Sets"]}
          />

          {/* Ayuda */}
          <FooterCol
            title="Ayuda"
            links={["Preguntas Frecuentes", "Envíos", "Devoluciones", "Contacto"]}
          />

          {/* Newsletter */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-coquette-ink text-base">Únete al club 🌸</h4>
            <p className="font-body text-xs text-coquette-mist leading-relaxed">
              Recibe novedades, descuentos exclusivos y mucho amor rosado.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 min-w-0 rounded-full px-4 py-2 text-xs font-body bg-white border border-coquette-dust/60 focus:outline-none focus:border-coquette-rose text-coquette-ink placeholder:text-coquette-dust"
              />
              <button className="shrink-0 rounded-full px-4 py-2 bg-coquette-burgundy text-white text-xs font-body font-semibold hover:bg-coquette-mauve transition-colors duration-250">
                ¡Sí!
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-coquette-dust/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-2xs font-body text-coquette-mist">
          <p>© {new Date().getFullYear()} Mechitas Mechonas · Todos los derechos reservados.</p>
          <p>Hecho con 🎀 en Chile</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-display text-coquette-ink text-base">{title}</h4>
      <ul className="flex flex-col gap-1.5">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="font-body text-xs text-coquette-mist hover:text-coquette-burgundy transition-colors duration-250"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  LAYOUT                                                         */
/* ─────────────────────────────────────────────────────────────── */
export default function Layout({ children, cartCount = 0 }) {
  return (
    <div className="min-h-screen flex flex-col bg-coquette-cream font-body">
      <Navbar cartCount={cartCount} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
