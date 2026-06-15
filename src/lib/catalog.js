// src/lib/catalog.js
// Funciones de acceso a datos para productos y ubicaciones (Supabase).

import { supabase } from "./supabase"

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTOS
// ─────────────────────────────────────────────────────────────────────────────

// Productos visibles en la tienda (solo activos)
export async function fetchPublicProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: true })
  if (error) { console.error("[catalog] fetchPublicProducts", error); return [] }
  return data ?? []
}

// Todos los productos (para el panel admin, incluye inactivos)
export async function fetchAllProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true })
  if (error) { console.error("[catalog] fetchAllProducts", error); return [] }
  return data ?? []
}

export async function createProduct(product) {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select()
    .single()
  if (error) { console.error("[catalog] createProduct", error); throw error }
  return data
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single()
  if (error) { console.error("[catalog] updateProduct", error); throw error }
  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) { console.error("[catalog] deleteProduct", error); throw error }
}

// ─────────────────────────────────────────────────────────────────────────────
// UBICACIONES
// ─────────────────────────────────────────────────────────────────────────────

// Ubicaciones visibles para clientes (solo activas)
export async function fetchPublicLocations() {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("active", true)
    .order("event_date", { ascending: true })
  if (error) { console.error("[catalog] fetchPublicLocations", error); return [] }
  return data ?? []
}

// Todas las ubicaciones (panel admin)
export async function fetchAllLocations() {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("event_date", { ascending: true })
  if (error) { console.error("[catalog] fetchAllLocations", error); return [] }
  return data ?? []
}

export async function createLocation(location) {
  const { data, error } = await supabase
    .from("locations")
    .insert([location])
    .select()
    .single()
  if (error) { console.error("[catalog] createLocation", error); throw error }
  return data
}

export async function updateLocation(id, updates) {
  const { data, error } = await supabase
    .from("locations")
    .update(updates)
    .eq("id", id)
    .select()
    .single()
  if (error) { console.error("[catalog] updateLocation", error); throw error }
  return data
}

export async function deleteLocation(id) {
  const { error } = await supabase.from("locations").delete().eq("id", id)
  if (error) { console.error("[catalog] deleteLocation", error); throw error }
}
