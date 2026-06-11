// src/lib/supabase.js
// Cliente Supabase — singleton compartido en toda la app.
//
// ── CONTRASEÑAS Y SEGURIDAD ─────────────────────────────────────────────────
// Supabase Auth maneja automáticamente el cifrado de contraseñas:
//   - Las contraseñas se hashean con bcrypt antes de guardarse.
//   - Se almacenan en la tabla interna auth.users (gestionada por Supabase).
//   - Nunca se guarda la contraseña en texto plano.
//   - Nadie — ni siquiera el equipo de Supabase — puede leer la contraseña original.
// Usando supabase.auth.signUp() y supabase.auth.signInWithPassword()
// todo esto ocurre de forma automática; no se requiere configuración adicional.
//
// ═══════════════════════════════════════════════════════════════════════════
// SQL COMPLETO — ejecutar en Supabase → SQL Editor
// ═══════════════════════════════════════════════════════════════════════════
//
// -- 1. Tabla de pedidos
// create table if not exists public.orders (
//   id             text        primary key,
//   created_at     timestamptz default now() not null,
//   customer       jsonb       not null,
//   items          jsonb       not null,
//   subtotal       integer     not null,
//   shipping       jsonb       not null,
//   total          integer     not null,
//   status         text        not null default 'pending_payment',
//   status_history jsonb       not null default '[]',
//   user_id        uuid        references auth.users(id)
// );
//
// -- Agregar user_id si la tabla ya existe:
// alter table public.orders
//   add column if not exists user_id uuid references auth.users(id);
//
// -- 2. Tabla de correos autorizados como administradores
// create table if not exists public.admin_emails (
//   email      text        primary key,
//   created_at timestamptz default now() not null
// );
//
// -- 3. Activar RLS
// alter table public.orders      enable row level security;
// alter table public.admin_emails enable row level security;
//
// -- 4. Eliminar políticas anteriores (si existían)
// drop policy if exists "insert_open"   on public.orders;
// drop policy if exists "select_open"   on public.orders;
// drop policy if exists "update_open"   on public.orders;
//
// -- 5. Políticas de orders
// create policy "orders_insert" on public.orders
//   for insert with check (true);
//
// create policy "orders_select_own" on public.orders
//   for select using (auth.uid() = user_id);
//
// create policy "orders_select_admin" on public.orders
//   for select using (
//     exists (select 1 from public.admin_emails where email = auth.email())
//   );
//
// create policy "orders_update_admin" on public.orders
//   for update using (
//     exists (select 1 from public.admin_emails where email = auth.email())
//   );
//
// -- 6. Política de admin_emails
// create policy "admin_emails_read" on public.admin_emails
//   for select using (true);
//
// -- 7. Agregar un correo administrador (repetir para cada admin)
// insert into public.admin_emails (email) values ('correo-admin@ejemplo.com');
//
// -- 8. Opcional: desactivar confirmación de correo para registro inmediato
//    Supabase → Authentication → Settings → "Enable email confirmations" → OFF
// ═══════════════════════════════════════════════════════════════════════════

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "[Supabase] Faltan las variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el archivo .env"
  )
}

export const supabase = createClient(supabaseUrl ?? "", supabaseKey ?? "")

// Verifica si un correo está registrado como administrador
export async function checkIsAdmin(email) {
  if (!email) return false
  const { data } = await supabase
    .from("admin_emails")
    .select("email")
    .eq("email", email)
    .maybeSingle()
  return !!data
}

// Traduce los mensajes de error de Supabase Auth al español
export function translateAuthError(message) {
  if (!message) return "Error desconocido. Intenta nuevamente."
  const m = message.toLowerCase()
  if (m.includes("invalid login credentials"))
    return "Correo o contraseña incorrectos."
  if (m.includes("email not confirmed"))
    return "Debes confirmar tu correo antes de ingresar. Revisa tu bandeja de entrada."
  if (m.includes("user already registered"))
    return "Este correo ya tiene una cuenta. Inicia sesión."
  if (m.includes("password should be at least"))
    return "La contraseña debe tener al menos 6 caracteres."
  if (m.includes("unable to validate email"))
    return "Correo inválido. Verifica que esté bien escrito."
  if (m.includes("email rate limit"))
    return "Demasiados intentos. Espera unos minutos e inténtalo de nuevo."
  return "Error al procesar la solicitud. Intenta nuevamente."
}
