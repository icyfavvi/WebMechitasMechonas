export default function CartOffcanvas({
  open,
  onClose,
  items,
  onRemove,
  onUpdateQty,
  total,
  onCheckout,
}) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Carrito de compras"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 bg-dark text-white border-b border-dark">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-xl tracking-tight">
              Mi Carrito
            </h2>
            {items.length > 0 && (
              <span className="bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {items.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-sm font-semibold text-white/70 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-all"
          >
            Cerrar
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3 bg-neutral-50">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-16">
              <div className="w-20 h-20 bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center mb-2">
                <span className="text-neutral-500 font-display font-bold text-2xl">0</span>
              </div>
              <p className="font-display font-bold text-dark text-xl">
                Tu carrito está vacío
              </p>
              <p className="text-neutral-500 text-sm">
                Explora nuestra colección y añade productos a tu carrito.
              </p>
              <button
                onClick={onClose}
                className="mt-4 bg-primary text-white rounded-full px-8 py-3 font-bold text-sm hover:bg-primary-dark shadow-primary transition-all"
              >
                Ver catálogo
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm hover:shadow-card transition-shadow"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-sm text-dark line-clamp-2 leading-snug">
                    {item.name}
                  </p>
                  <p className="font-body font-bold text-base text-primary mt-1">
                    ${(item.price * item.qty).toLocaleString("es-CL")}
                  </p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      onClick={() => onUpdateQty(item.id, item.qty - 1)}
                      className="w-7 h-7 rounded-full border border-neutral-200 text-neutral-500 hover:border-primary hover:text-primary text-sm font-bold flex items-center justify-center transition-all"
                      aria-label="Disminuir cantidad"
                    >
                      -
                    </button>
                    <span className="font-body font-bold text-sm text-dark min-w-[20px] text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => onUpdateQty(item.id, item.qty + 1)}
                      className="w-7 h-7 rounded-full border border-neutral-200 text-neutral-500 hover:border-primary hover:text-primary text-sm font-bold flex items-center justify-center transition-all"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-[12px] font-semibold text-neutral-500 hover:text-primary px-2 py-1 rounded hover:bg-primary-pale transition-all flex-shrink-0"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-neutral-200 bg-white flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-body text-neutral-500 font-bold text-base">Subtotal</span>
                <span className="font-display font-black text-2xl text-dark">
                  ${total.toLocaleString("es-CL")}
                </span>
              </div>
              {/* Nota de envío */}
              <p className="font-body text-xs text-neutral-500 text-right">
                Costo de envio se calcula al finalizar
              </p>
            </div>

            <button
              onClick={onCheckout}
              id="checkout-button"
              className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-full transition-all shadow-primary-lg hover:-translate-y-0.5"
            >
              Ir a Pagar — ${total.toLocaleString("es-CL")}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
