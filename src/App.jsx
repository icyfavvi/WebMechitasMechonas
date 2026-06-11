// src/App.jsx
import { useState, useEffect, useCallback } from "react"
import Navbar         from "./components/Navbar"
import Hero           from "./components/Hero"
import ProductCatalog from "./components/ProductCatalog"
import Footer         from "./components/Footer"
import CartOffcanvas  from "./components/CartOffcanvas"
import Checkout       from "./components/Checkout"
import AuthModal      from "./components/AuthModal"
import UserPanel      from "./components/UserPanel"
import AdminPanel     from "./components/AdminPanel"
import { PRODUCTS }   from "./data/products"
import { supabase, checkIsAdmin } from "./lib/supabase"

export default function App() {
  // ── Vistas: "shop" | "checkout" | "account" | "admin" ────────────────────
  const [view, setView] = useState("shop")

  // ── Auth ──────────────────────────────────────────────────────────────────
  const [user,        setUser]        = useState(null)
  const [isAdmin,     setIsAdmin]     = useState(false)
  const [authLoading, setAuthLoading] = useState(true)  // checking initial session
  const [showAuth,    setShowAuth]    = useState(false)  // modal visible

  // ── Carrito ───────────────────────────────────────────────────────────────
  const [cart,       setCart]       = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  // ── Catalogo ──────────────────────────────────────────────────────────────
  const [searchQuery,      setSearchQuery]      = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // ── Inicializar sesion Supabase al montar ─────────────────────────────────
  const handleUserChange = useCallback(async (supabaseUser) => {
    if (!supabaseUser) {
      setUser(null)
      setIsAdmin(false)
      return
    }
    setUser(supabaseUser)
    const admin = await checkIsAdmin(supabaseUser.email)
    setIsAdmin(admin)
  }, [])

  useEffect(() => {
    // Sesion activa al cargar la pagina
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserChange(session?.user ?? null).finally(() => setAuthLoading(false))
    })

    // Escuchar cambios: login, logout, token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleUserChange(session?.user ?? null)
      }
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

  // ── Navegacion ────────────────────────────────────────────────────────────
  const handleNavigate = (target) => {
    // "account" y "admin" requieren estar autenticado
    if (target === "account" && !user) {
      setShowAuth(true)
      return
    }
    if (target === "admin" && !isAdmin) {
      // Si esta logueado pero no es admin, ir a su cuenta
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

  // ── Auth: callback del modal ──────────────────────────────────────────────
  const handleAuthSuccess = async (supabaseUser) => {
    await handleUserChange(supabaseUser)
    // Si es admin, ofrecer ir al panel; si no, ir a cuenta
    // (el usuario puede navegar manualmente)
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setView("shop")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ── Crear pedido en Supabase ──────────────────────────────────────────────
  // INTEGRACION T-08 (A. Zuniga): confirmar pago con Webpay antes de insertar
  const handlePlaceOrder = async (orderData) => {
    const newId = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`
    const newOrder = {
      id:             newId,
      created_at:     new Date().toISOString(),
      customer:       orderData.customer,
      items:          orderData.items,
      subtotal:       orderData.subtotal,
      shipping:       orderData.shipping,
      total:          orderData.total,
      user_id:        user?.id ?? null,   // null para compras de invitados
      status:         "pending_payment",
      status_history: [
        { status: "pending_payment", timestamp: new Date().toISOString(), note: "Pedido recibido via web" },
      ],
    }

    const { error } = await supabase.from("orders").insert([newOrder])
    if (error) {
      console.error("[App] Error al crear pedido:", error)
      return null
    }
    setCart([])
    return newId
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <p className="font-body text-sm text-mist">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand font-body overflow-x-hidden">
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
          <ProductCatalog
            products={PRODUCTS}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onAddToCart={addToCart}
          />
        </>
      )}

      {view === "checkout" && (
        <Checkout
          items={cart}
          total={cartTotal}
          onBack={() => handleNavigate("shop")}
          onPlaceOrder={handlePlaceOrder}
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
        <AdminPanel onLogout={handleLogout} />
      )}

      {/* Footer — oculto en paneles de usuario/admin */}
      {view !== "admin" && view !== "account" && <Footer />}

      {/* Carrito */}
      <CartOffcanvas
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateQty}
        total={cartTotal}
        onCheckout={handleCheckout}
      />

      {/* Modal de autenticacion */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  )
}
