'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

// Types
export interface CartItemCustomization {
  text?: string
  textColor?: string
  textFont?: string
  image?: string
  imagePosition?: { x: number; y: number }
  imageScale?: number
  allImages?: string[] // All images used in the design (1-4)
  designCode?: string // Design code for reference
  graphics?: Record<string, unknown> // Full graphics data with positions
  texts?: Record<string, unknown> // Text data with styling
  previewImages?: Array<{ name: string; url: string }>
  printZones?: Array<{ name: string; url: string; widthCm: number; heightCm: number }>
  previewImage?: string
  productType?: '3d'
  /** GLTF path (e.g. /shirt/scene.gltf) — duplicated from cart item.modelPath for order/admin fallback */
  modelPath?: string
}

export interface CartItem {
  id: string // Unique cart item ID
  productId: string
  productName: string
  productImage: string
  productSlug: string
  variant?: {
    name: string
    value: string
  }
  color?: string
  size?: string
  quantity: number
  unitPrice: number
  salePrice?: number
  customization?: CartItemCustomization
  isPersonalized: boolean
  modelPath?: string
  addedAt: number
}

export interface CartCoupon {
  code: string
  type: 'percentage' | 'fixed' | 'free_shipping'
  value: number
  minOrderAmount?: number
  maxDiscount?: number
}

export interface CartTotals {
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  itemCount: number
  savedAmount: number
}

interface CartContextType {
  items: CartItem[]
  coupon: CartCoupon | null
  totals: CartTotals
  isOpen: boolean
  isLoading: boolean
  
  // Cart actions
  addItem: (item: Omit<CartItem, 'id' | 'addedAt'>, options?: { openCart?: boolean }) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  updateCustomization: (itemId: string, customization: CartItemCustomization) => void
  updateItemDesign: (itemId: string, color: string, customization: CartItemCustomization, size?: string) => void
  clearCart: () => void
  
  // Coupon actions
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>
  removeCoupon: () => void
  
  // UI actions
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  
  // Utility
  getItemById: (itemId: string) => CartItem | undefined
  isInCart: (productId: string, variant?: string, color?: string) => boolean
  getProductQuantity: (productId: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'shirtshop_cart'
const COUPON_STORAGE_KEY = 'shirtshop_coupon'

// Shipping thresholds
const FREE_SHIPPING_THRESHOLD = 100 // Free shipping over 100 KM
const STANDARD_SHIPPING_COST = 7 // 7 KM shipping
const TAX_RATE = 0.17 // 17% PDV

function generateItemId(): string {
  return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function calculateTotals(items: CartItem[], coupon: CartCoupon | null): CartTotals {
  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => {
    const price = item.salePrice ?? item.unitPrice
    return sum + (price * item.quantity)
  }, 0)

  // Calculate saved amount from sale prices
  const savedAmount = items.reduce((sum, item) => {
    if (item.salePrice && item.salePrice < item.unitPrice) {
      return sum + ((item.unitPrice - item.salePrice) * item.quantity)
    }
    return sum
  }, 0)

  // Calculate discount from coupon
  let discount = 0
  if (coupon) {
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      // Coupon doesn't apply
    } else {
      switch (coupon.type) {
        case 'percentage':
          discount = subtotal * (coupon.value / 100)
          if (coupon.maxDiscount) {
            discount = Math.min(discount, coupon.maxDiscount)
          }
          break
        case 'fixed':
          discount = Math.min(coupon.value, subtotal)
          break
        case 'free_shipping':
          // Handled in shipping calculation
          break
      }
    }
  }

  // Calculate shipping
  let shipping = STANDARD_SHIPPING_COST
  if (subtotal >= FREE_SHIPPING_THRESHOLD || coupon?.type === 'free_shipping') {
    shipping = 0
  }

  // Calculate tax on discounted subtotal
  const taxableAmount = subtotal - discount
  const tax = taxableAmount * TAX_RATE

  // Calculate total
  const total = subtotal - discount + shipping + tax

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    savedAmount: Math.round(savedAmount * 100) / 100,
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [coupon, setCoupon] = useState<CartCoupon | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [totals, setTotals] = useState<CartTotals>({
    subtotal: 0,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    itemCount: 0,
    savedAmount: 0,
  })

  // Load cart from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY)
      
      if (savedCart) {
        const parsedItems = JSON.parse(savedCart)
        setItems(parsedItems)
      }
      
      if (savedCoupon) {
        setCoupon(JSON.parse(savedCoupon))
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save cart to localStorage and recalculate totals
  useEffect(() => {
    if (typeof window === 'undefined' || isLoading) return
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    setTotals(calculateTotals(items, coupon))
  }, [items, coupon, isLoading])

  // Save coupon to localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || isLoading) return
    
    if (coupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon))
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY)
    }
  }, [coupon, isLoading])

  const addItem = useCallback((item: Omit<CartItem, 'id' | 'addedAt'>, options?: { openCart?: boolean }) => {
    const openCartAfter = options?.openCart !== false
    setItems(prev => {
      // Check if same product with same variant/color already exists
      const existingIndex = prev.findIndex(i => 
        i.productId === item.productId && 
        i.variant?.value === item.variant?.value &&
        i.color === item.color &&
        i.size === item.size &&
        !i.isPersonalized // Don't merge personalized items
      )

      if (existingIndex > -1 && !item.isPersonalized) {
        // Update quantity of existing item
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity
        }
        return updated
      }

      // Add new item
      return [...prev, {
        ...item,
        id: generateItemId(),
        addedAt: Date.now()
      }]
    })

    if (openCartAfter) {
      setIsOpen(true)
    }
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId))
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(itemId)
      return
    }

    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ))
  }, [removeItem])

  const updateCustomization = useCallback((itemId: string, customization: CartItemCustomization) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, customization: { ...item.customization, ...customization } } : item
    ))
  }, [])

  const updateItemDesign = useCallback((itemId: string, color: string, customization: CartItemCustomization, size?: string) => {
    setItems(prev => prev.map(item =>
      item.id === itemId
        ? {
            ...item,
            color,
            size: size ?? item.size,
            customization: { ...item.customization, ...customization },
          }
        : item
    ))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setCoupon(null)
  }, [])

  const applyCoupon = useCallback(async (code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validate coupon with API
      const response = await fetch(`/api/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${totals.subtotal}`)
      const data = await response.json()

      if (data.success && data.coupon) {
        setCoupon({
          code: data.coupon.code,
          type: data.coupon.discount_type,
          value: data.coupon.discount_value,
          minOrderAmount: data.coupon.min_order_amount,
          maxDiscount: data.coupon.max_discount
        })
        return { success: true }
      }

      return { success: false, error: data.error || 'Nevažeći kupon' }
    } catch (error) {
      return { success: false, error: 'Greška pri provjeri kupona' }
    }
  }, [totals.subtotal])

  const removeCoupon = useCallback(() => {
    setCoupon(null)
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), [])

  const getItemById = useCallback((itemId: string) => {
    return items.find(item => item.id === itemId)
  }, [items])

  const isInCart = useCallback((productId: string, variant?: string, color?: string) => {
    return items.some(item => 
      item.productId === productId &&
      (!variant || item.variant?.value === variant) &&
      (!color || item.color === color)
    )
  }, [items])

  const getProductQuantity = useCallback((productId: string) => {
    return items
      .filter(item => item.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  return (
    <CartContext.Provider value={{
      items,
      coupon,
      totals,
      isOpen,
      isLoading,
      addItem,
      removeItem,
      updateQuantity,
      updateCustomization,
      updateItemDesign,
      clearCart,
      applyCoupon,
      removeCoupon,
      openCart,
      closeCart,
      toggleCart,
      getItemById,
      isInCart,
      getProductQuantity,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
