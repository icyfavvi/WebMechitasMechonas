import { useState } from "react"
import Layout from "./components/Layout"
import Home from "./pages/Home"

export default function App() {
  const [cart, setCart] = useState([])

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Layout cartCount={cartCount}>
      <Home onAddToCart={handleAddToCart} />
    </Layout>
  )
}
