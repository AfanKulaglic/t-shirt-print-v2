import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Browser client (uses anon key)
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  const cleanUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl
  
  return createClient(cleanUrl, supabaseAnonKey)
}

// Server client with service role (for admin operations)
export function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  const cleanUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl
  
  return createClient(cleanUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Singleton for browser
let browserClient: SupabaseClient | null = null

export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    return createSupabaseClient()
  }
  
  if (!browserClient) {
    browserClient = createSupabaseClient()
  }
  
  return browserClient
}

// Database types
export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  category_id: string | null
  base_price: number
  sale_price: number | null
  sku: string | null
  model_path: string | null
  model_bucket_path: string | null
  default_color: string
  zoom_header: number
  zoom_card: number
  zoom_editor: number
  is_personalizable: boolean
  is_active: boolean
  is_featured: boolean
  show_in_header: boolean
  stock_quantity: number
  min_order_quantity: number
  images: string[]
  variants: ProductVariant[]
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  category?: Category
}

export interface ProductVariant {
  name: string
  options: string[]
}

export interface Order {
  id: string
  order_number: string
  guest_email: string
  guest_name: string
  guest_phone: string | null
  status: OrderStatus
  shipping_address: ShippingAddress
  billing_address: ShippingAddress | null
  subtotal: number
  shipping_cost: number
  discount_amount: number
  tax_amount: number
  total: number
  coupon_id: string | null
  coupon_code: string | null
  payment_method: string | null
  payment_status: PaymentStatus
  payment_reference: string | null
  shipping_method: string | null
  tracking_number: string | null
  shipped_at: string | null
  delivered_at: string | null
  customer_notes: string | null
  internal_notes: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
  status_history?: OrderStatusHistory[]
}

export interface ShippingAddress {
  full_name: string
  street: string
  city: string
  postal_code: string
  country: string
  phone: string
  email?: string
  delivery_method?: string
}

export type OrderStatus = 
  | 'pending' | 'confirmed' | 'processing' | 'printing' 
  | 'quality_check' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

export type PaymentStatus = 
  | 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_sku: string | null
  quantity: number
  unit_price: number
  total_price: number
  variant: Record<string, unknown> | null
  is_personalized: boolean
  personalization_data: Record<string, unknown> | null
  design_images: string[]
  design_preview_url: string | null
  model_render_url: string | null
  model_render_data: Record<string, unknown> | null
  model_path: string | null
  design_code: string | null
  created_at: string
}

export interface OrderStatusHistory {
  id: string
  order_id: string
  status: string
  note: string | null
  created_by: string | null
  created_at: string
}

export interface Coupon {
  id: string
  code: string
  description: string | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_amount: number
  max_discount: number | null
  usage_limit: number | null
  usage_count: number
  valid_from: string
  valid_until: string | null
  is_active: boolean
  applicable_categories: string[]
  applicable_products: string[]
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  order_id: string | null
  order_number: string | null
  status: 'new' | 'read' | 'replied' | 'resolved'
  replied_at: string | null
  created_at: string
}

export interface SavedDesign {
  id: string
  session_id: string
  product_id: string | null
  name: string | null
  design_data: Record<string, unknown>
  preview_url: string | null
  model_render_url: string | null
  created_at: string
  updated_at: string
  expires_at: string
}
