'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, ShoppingBag, Trash2, Plus, Minus, Tag, 
  ArrowRight, Edit2, AlertCircle
} from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
  const pathname = usePathname()
  const onCheckout = pathname === '/checkout'
  const { 
    items, 
    totals, 
    coupon,
    isOpen, 
    closeCart, 
    removeItem, 
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart
  } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0f0f14] border-l border-gray-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-orange-400" />
                <h2 className="text-lg font-semibold text-white">Korpa</h2>
                <span className="px-2 py-0.5 text-xs bg-orange-500/20 text-orange-400 rounded-full">
                  {totals.itemCount} {totals.itemCount === 1 ? 'artikal' : 'artikala'}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Korpa je prazna</h3>
                  <p className="text-gray-400 mb-6">Dodajte proizvode i počnite kupovinu</p>
                  <Link
                    href="/"
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  >
                    Nazad na početnu
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onRemove={() => removeItem(item.id)}
                    onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                    onClose={closeCart}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-800 p-4 space-y-4">
                {/* Actions */}
                <div className="space-y-2">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-orange-500 to-fuchsia-500 hover:from-orange-600 hover:to-fuchsia-600 text-white font-medium rounded-lg transition-all"
                  >
                    Nastavi
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <div className="flex gap-2">
                    {!onCheckout && (
                      <Link
                        href="/cart"
                        onClick={closeCart}
                        className="flex-1 py-2.5 text-center text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg transition-colors"
                      >
                        Pregledaj korpu
                      </Link>
                    )}
                    <button
                      onClick={clearCart}
                      className={`px-4 py-2.5 text-red-400 hover:bg-red-500/10 border border-gray-700 rounded-lg transition-colors ${onCheckout ? 'flex-1' : ''}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Cart Item Component
function CartItemRow({ 
  item, 
  onRemove, 
  onUpdateQuantity,
  onClose 
}: { 
  item: any
  onRemove: () => void
  onUpdateQuantity: (qty: number) => void
  onClose: () => void
}) {
  return (
    <div className="flex gap-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <div className="min-w-0">
            <span className="font-medium text-white truncate block">
              {item.productName}{item.customization?.designCode ? ` - ${item.customization.designCode}` : ''}
            </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {item.color && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <span 
                    className="w-3 h-3 rounded-full border border-gray-600" 
                    style={{ backgroundColor: item.color }}
                  />
                  Boja
                </span>
              )}
              {item.size && (
                <span className="text-xs text-gray-400">Veličina: {item.size}</span>
              )}
              {item.variant && (
                <span className="text-xs text-gray-400">{item.variant.name}: {item.variant.value}</span>
              )}
            </div>
            {item.isPersonalized && (
              <Link 
                href={`/editor?edit=${item.id}`}
                onClick={onClose}
                className="inline-flex items-center gap-1 mt-1 text-xs text-orange-400 hover:text-purple-300"
              >
                <Edit2 className="w-3 h-3" />
                Uredi dizajn
              </Link>
            )}
          </div>
          <button
            onClick={onRemove}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Quantity */}
        <div className="flex items-center mt-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min="1"
              value={item.quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1) {
                  onUpdateQuantity(val);
                }
              }}
              onBlur={(e) => {
                const val = parseInt(e.target.value, 10);
                if (isNaN(val) || val < 1) {
                  onUpdateQuantity(1);
                }
              }}
              className="w-12 h-8 text-center text-white font-medium bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Coupon Input Component
function CouponInput({ 
  coupon, 
  onApply, 
  onRemove 
}: { 
  coupon: any
  onApply: (code: string) => Promise<{ success: boolean; error?: string }>
  onRemove: () => void
}) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleApply = async () => {
    if (!code.trim()) return
    
    setLoading(true)
    setError('')
    
    const result = await onApply(code.trim().toUpperCase())
    
    if (result.success) {
      setCode('')
    } else {
      setError(result.error || 'Nevažeći kupon')
    }
    
    setLoading(false)
  }

  if (coupon) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-medium">{coupon.code}</span>
          <span className="text-sm text-green-400/70">
            ({coupon.type === 'percentage' ? `${coupon.value}%` : 
              coupon.type === 'fixed' ? 'Fiksni popust' : 
              'Besplatna dostava'})
          </span>
        </div>
        <button
          onClick={onRemove}
          className="p-1 text-green-400 hover:text-red-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="Unesite kupon kod"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm"
        >
          {loading ? '...' : 'Primjeni'}
        </button>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  )
}
