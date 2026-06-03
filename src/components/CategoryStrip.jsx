const CATS = [
  { emoji:"🎀", label:"Lazos" },
  { emoji:"🌸", label:"Scrunchies" },
  { emoji:"✨", label:"Pinches" },
  { emoji:"💫", label:"Cintillos" },
  { emoji:"🐶", label:"Perros" },
  { emoji:"🐱", label:"Gatos" },
  { emoji:"💝", label:"Sets Dúo" },
  { emoji:"🆕", label:"Novedades" },
]

export default function CategoryStrip() {
  return (
    <section className="bg-white border-y border-dust/60 py-5 overflow-x-auto scrollbar-none">
      <div className="flex gap-3 px-4 sm:px-10 lg:justify-center lg:flex-wrap min-w-max lg:min-w-0">
        {CATS.map(c => (
          <button
            key={c.label}
            className="flex-shrink-0 flex items-center gap-2 bg-sand hover:bg-teal-pale border border-dust hover:border-teal-light text-ink/70 hover:text-teal-dark font-semibold text-[13px] rounded-full px-5 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
          >
            <span>{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>
    </section>
  )
}
