export default function CategoriesCircles({ onNavigateToCategory }) {
  const categories = [
    { name: "Turbantes", image: "url(/images/turbantes.jpg)" },
    { name: "Cintillos", image: "url(/images/cintillos.jpg)" },
    { name: "Bandanas", image: "url(/images/bandanas.jpg)" },
    { name: "Coleteros", image: "url(/images/coleteros.jpg)" },
    { name: "Niñas", image: "url(/images/ninas.jpg)" },
    { name: "Universitarias", image: "url(/images/universitarias.jpg)" },
    { name: "Mascotas", image: "url(/images/mascotas.jpg)" },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-body text-[26px] md:text-3xl font-extrabold text-dark mb-3 tracking-wide">
            Encuentra el accesorio perfecto
          </h2>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary mx-auto">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </div>

        <div className="flex flex-wrap justify-center gap-5 lg:gap-10">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => onNavigateToCategory && onNavigateToCategory(cat.name)}
              className="group flex flex-col items-center gap-3 cursor-pointer"
            >
              <div
                className="w-24 h-24 lg:w-[110px] lg:h-[110px] rounded-full bg-cover bg-center transition-all duration-300 group-hover:shadow-card group-hover:-translate-y-1 relative overflow-hidden bg-neutral-100"
                style={{ backgroundImage: cat.image }}
              >
                <div className="absolute inset-0 bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-bold text-dark text-[11px] lg:text-xs px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full leading-none shadow-sm">Ver más</p>
                </div>
              </div>
              <span className="font-body font-extrabold text-dark text-[13px] lg:text-sm group-hover:text-primary transition-colors tracking-wide">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
