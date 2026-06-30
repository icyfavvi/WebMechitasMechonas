// src/App.jsx
import { useState, useEffect, useCallback } from "react"
import Navbar           from "./components/Navbar"
import Hero             from "./components/Hero"
import LocationsSection from "./components/LocationsSection"
import ValoresSection     from "./components/ValoresSection"
import CategoriesCircles  from "./components/CategoriesCircles"
import ProductCatalog   from "./components/ProductCatalog"
import Footer           from "./components/Footer"
import CartOffcanvas    from "./components/CartOffcanvas"
import Checkout         from "./components/Checkout"
import AuthModal        from "./components/AuthModal"
import UserPanel        from "./components/UserPanel"
import AdminPanel       from "./components/AdminPanel"
import { supabase, checkIsAdmin } from "./lib/supabase"

export default function App() {
  const [view,        setView]        = useState("shop")
  const [user,        setUser]        = useState(null)
  const [isAdmin,     setIsAdmin]     = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [showAuth,    setShowAuth]    = useState(false)
  const [cart,        setCart]        = useState([])
  const [drawerOpen,  setDrawerOpen]  = useState(false)
  const [searchQuery,      setSearchQuery]      = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // ── Auth ─────────────────────────────────────────────────────────────────
  const handleUserChange = useCallback(async (supabaseUser) => {
    if (!supabaseUser) { setUser(null); setIsAdmin(false); return }
    setUser(supabaseUser)
    const admin = await checkIsAdmin(supabaseUser.email)
    setIsAdmin(admin)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserChange(session?.user ?? null).finally(() => setAuthLoading(false))
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => { handleUserChange(session?.user ?? null) }
    )
    return () => subscription.unsubscribe()
  }, [handleUserChange])

  // ── Carrito ───────────────────────────────────────────────────────────────
  const addToCart = (product) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === product.id)
      if (ex) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
    setDrawerOpen(true)
  }
  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id))
  const updateQty = (id, newQty) => {
    if (newQty <= 0) { removeFromCart(id); return }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: newQty } : i)))
  }
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  // ── Navegación ────────────────────────────────────────────────────────────
  const handleNavigate = (target) => {
    if (target === "account" && !user) { setShowAuth(true); return }
    if (target === "admin" && !isAdmin) {
      if (user) setView("account")
      else setShowAuth(true)
      return
    }
    setView(target)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCheckout = () => {
    setDrawerOpen(false)
    setView("checkout")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleAuthSuccess = async (supabaseUser) => {
    await handleUserChange(supabaseUser)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setView("shop")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ── Crear pedido en Supabase ──────────────────────────────────────────────
  // Recibe un objeto plano desde Checkout y añade los campos de servidor.
  const handlePlaceOrder = async (orderData) => {
    const newId = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`
    const now   = new Date().toISOString()

    const newOrder = {
      id: newId,
      // Datos del cliente (columnas planas)
      customer_name:    orderData.customer_name,
      customer_email:   orderData.customer_email,
      customer_rut:     orderData.customer_rut,
      customer_phone:   orderData.customer_phone ?? "",
      customer_address: orderData.customer_address,
      customer_comuna:  orderData.customer_comuna,
      customer_region:  orderData.customer_region,
      notes:            orderData.notes ?? "",
      // Productos y montos
      items:            orderData.items,
      subtotal:         orderData.subtotal,
      shipping_cost:    orderData.shipping_cost,
      shipping_region:  orderData.shipping_region,
      shipping_zone:    orderData.shipping_zone,
      shipping_is_free: orderData.shipping_is_free,
      total:            orderData.total,
      // Estado inicial
      user_id:          user?.id ?? null,
      status:           "pending_payment",
      status_history: [
        {
          status:    "pending_payment",
          timestamp: now,
          note:      "Pedido recibido vía web",
        },
      ],
      created_at: now,
      updated_at: now,
    }

    const { error } = await supabase.from("orders").insert([newOrder])
    if (error) { console.error("[App] Error al crear pedido:", error); return null }
    setCart([])
    return newId
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <p className="font-body text-sm text-mist">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-body overflow-x-hidden">
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setDrawerOpen(true)}
        onNavigate={handleNavigate}
        currentView={view}
        user={user}
        isAdmin={isAdmin}
        onOpenAuth={() => setShowAuth(true)}
        onLogout={handleLogout}
      />

      {view === "shop" && (
        <>
          <Hero onNavigate={handleNavigate} />
          <ValoresSection />
          <CategoriesCircles onNavigateToCategory={(cat) => {
            setSearchQuery(cat);
            setSelectedCategory("all");
            const el = document.getElementById("catalogo");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }} />
          <ProductCatalog
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onAddToCart={addToCart}
          />
        </>
      )}

      {/* Página independiente de Ubicaciones */}
      {view === "locations" && <LocationsSection />}

      {view === "checkout" && (
        <Checkout
          items={cart}
          total={cartTotal}
          onBack={() => handleNavigate("shop")}
          onPlaceOrder={handlePlaceOrder}
          user={user}
        />
      )}

      {view === "account" && user && (
        <UserPanel
          user={user}
          isAdmin={isAdmin}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {view === "admin" && isAdmin && (
        <AdminPanel onLogout={handleLogout} onNavigate={handleNavigate} />
      )}

      {view !== "admin" && view !== "account" && <Footer />}

      <CartOffcanvas
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateQty}
        total={cartTotal}
        onCheckout={handleCheckout}
      />

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  )
}
