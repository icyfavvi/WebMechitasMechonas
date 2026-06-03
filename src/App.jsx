import { useState } from "react"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import CategoryStrip from "./components/CategoryStrip"
import ProductSection from "./components/ProductSection"
import PromoBanner from "./components/PromoBanner"
import Footer from "./components/Footer"
import CartDrawer from "./components/CartDrawer"

export default function App() {
  const [cart, setCart] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id)
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
    setDrawerOpen(true)
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <div className="min-h-screen bg-sand font-body overflow-x-hidden">
      <Navbar cartCount={cartCount} onCartClick={() => setDrawerOpen(true)} />
      <Hero />
      <CategoryStrip />
      <ProductSection type="pelo" onAddToCart={addToCart} />
      <ProductSection type="pet" onAddToCart={addToCart} />
      <PromoBanner />
      <Footer />
      <CartDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        total={cartTotal}
      />
    </div>
  )
}
