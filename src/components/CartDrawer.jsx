import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react"

export default function CartDrawer({ open, onClose, items, onRemove, total }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-white shadow-lift flex flex-col transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-dust">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-teal" />
            <h2 className="font-display font-bold text-lg text-ink">Mi Carrito</h2>
            {items.length > 0 && (
              <span className="bg-teal text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {items.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-lace flex items-center justify-center text-mist hover:text-ink transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-16">
              <div className="text-5xl">🛍️</div>
              <p className="font-display font-bold text-ink text-lg">Tu carrito está vacío</p>
              <p className="text-mist text-sm">¡Agrega algo lindo!</p>
              <button onClick={onClose} className="mt-2 bg-teal text-white rounded-full px-6 py-2.5 font-bold text-sm hover:bg-teal-dark transition-colors">
                Ver productos
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex items-center gap-3 bg-sand rounded-2xl p-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-teal-pale flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={e => { e.target.parentNode.innerHTML = item.category === "pet" ? "🐾" : "🎀" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-xs text-ink line-clamp-2 leading-snug">{item.name}</p>
                  <p className="font-body font-black text-sm text-teal-dark mt-0.5">
                    ${(item.price * item.qty).toLocaleString("es-CL")}
                    {item.qty > 1 && <span className="font-normal text-mist text-xs"> ×{item.qty}</span>}
                  </p>
                </div>
                <button onClick={() => onRemove(item.id)} className="w-8 h-8 rounded-full hover:bg-rose-blush flex items-center justify-center text-dust hover:text-rose-berry transition-all flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-dust flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="font-body text-mist text-sm">Total</span>
              <span className="font-display font-black text-2xl text-ink">
                ${total.toLocaleString("es-CL")}
              </span>
            </div>
            {total < 15000 && (
              <p className="text-xs text-mist bg-teal-pale rounded-xl px-3 py-2 text-center">
                ¡Te faltan ${(15000 - total).toLocaleString("es-CL")} para envío gratis! 🎀
              </p>
            )}
            {total >= 15000 && (
              <p className="text-xs text-teal-dark bg-teal-pale rounded-xl px-3 py-2 text-center font-semibold">
                ✅ ¡Tienes envío gratis!
              </p>
            )}
            <button className="w-full bg-teal hover:bg-teal-dark text-white font-bold rounded-full py-3.5 flex items-center justify-center gap-2 transition-all hover:shadow-teal">
              Ir a pagar <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  )
}
