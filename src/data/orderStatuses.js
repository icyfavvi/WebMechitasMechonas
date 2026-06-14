// src/data/orderStatuses.js
// Definición centralizada de estados de pedido — Mechitas Mechonas
// Todos los cambios de estados, colores o transiciones van aquí.

const COLORS = {
  gold:    { bg: "#fff8dc", text: "#a07a10", border: "#f5c842" },
  amber:   { bg: "#fef3c7", text: "#92400e", border: "#fbbf24" },
  teal:    { bg: "#e4f7f5", text: "#2a7068", border: "#5DBFB0" },
  blue:    { bg: "#eff6ff", text: "#1d4ed8", border: "#93c5fd" },
  green:   { bg: "#d1fae5", text: "#065f46", border: "#34d399" },
  emerald: { bg: "#f0fdf4", text: "#15803d", border: "#86efac" },
  rose:    { bg: "#fde8ec", text: "#9b4f60", border: "#f29eab" },
  gray:    { bg: "#f0f0f0", text: "#557570", border: "#ddd0d3" },
}

export const ORDER_STATUSES = {
  pending_payment: {
    key:         "pending_payment",
    label:       "Pendiente de pago",
    short:       "Pendiente",
    description: "El cliente completó el pedido. Esperando confirmación del pago.",
    colors:      COLORS.gold,
    next:        ["reviewing_payment", "cancelled"],
  },
  reviewing_payment: {
    key:         "reviewing_payment",
    label:       "En revisión de pago",
    short:       "En revisión",
    description: "El equipo está verificando la transacción con Webpay.",
    colors:      COLORS.amber,
    next:        ["payment_confirmed", "cancelled"],
  },
  payment_confirmed: {
    key:         "payment_confirmed",
    label:       "Pago confirmado",
    short:       "Confirmado",
    description: "El pago fue verificado y aprobado correctamente.",
    colors:      COLORS.teal,
    next:        ["preparing", "cancelled"],
  },
  preparing: {
    key:         "preparing",
    label:       "Preparando pedido",
    short:       "Preparando",
    description: "El pedido está siendo empaquetado para despacho.",
    colors:      COLORS.blue,
    next:        ["shipped"],
  },
  shipped: {
    key:         "shipped",
    label:       "Enviado",
    short:       "Enviado",
    description: "El pedido fue despachado al transportista.",
    colors:      COLORS.green,
    next:        ["delivered"],
  },
  delivered: {
    key:         "delivered",
    label:       "Entregado",
    short:       "Entregado",
    description: "El pedido fue entregado con éxito al cliente.",
    colors:      COLORS.emerald,
    next:        [],
  },
  cancelled: {
    key:         "cancelled",
    label:       "Cancelado",
    short:       "Cancelado",
    description: "El pedido fue cancelado. Si hay pago recibido, procesar reembolso.",
    colors:      COLORS.rose,
    next:        ["refunded"],
  },
  refunded: {
    key:         "refunded",
    label:       "Reembolsado",
    short:       "Reembolsado",
    description: "El monto fue devuelto al cliente.",
    colors:      COLORS.gray,
    next:        [],
  },
}

// Orden de presentación en filtros y estadísticas
export const STATUS_DISPLAY_ORDER = [
  "pending_payment",
  "reviewing_payment",
  "payment_confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]

export function getStatus(key) {
  return ORDER_STATUSES[key] ?? null
}

export function getNextStatuses(currentKey) {
  const current = ORDER_STATUSES[currentKey]
  if (!current) return []
  return current.next.map((k) => ORDER_STATUSES[k])
}
