const LINKS = {
  "Pelo 🎀": ["Lazos", "Scrunchies", "Pinches", "Cintillos", "Coronas"],
  "Mascotas 🐾": ["Lazos para Perros", "Pañuelitos", "Coronitas Pet", "Sets Dúo", "Collares"],
  "Ayuda": ["Envíos y despacho", "Devoluciones", "Preguntas frecuentes", "Contáctanos"],
}

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      {/* Curved top */}
      <div className="bg-sand h-10 rounded-b-[50%] w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <img
              src="/logo.png"
              alt="Mechitas Mechonas"
              className="h-14 w-auto object-contain self-start"
            />
            <p className="font-body text-sm text-white/60 leading-relaxed max-w-xs">
              Accesorios artesanales para el pelo y mascotas. Cada pieza
              hecha con amor en Chile. 🇨🇱
            </p>
            <div className="flex gap-2 mt-1">
              {["IG", "FB", "TK"].map(n => (
                <a
                  key={n}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-teal text-white text-xs font-bold flex items-center justify-center transition-all duration-200"
                >
                  {n}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([col, items]) => (
            <div key={col} className="flex flex-col gap-3">
              <h4 className="font-display font-bold text-base text-white">{col}</h4>
              <ul className="flex flex-col gap-2">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="font-body text-sm text-white/50 hover:text-teal-light transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-body text-white/35">
          <p>© {new Date().getFullYear()} Mechitas Mechonas · Todos los derechos reservados.</p>
          <p>Hecho con 🎀 y 🐾 en Chile</p>
        </div>
      </div>
    </footer>
  )
}
