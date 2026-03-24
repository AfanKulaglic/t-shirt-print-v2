'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, 
  ArrowLeft, Package, Edit2
} from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const {
    items,
    totals,
    removeItem,
    updateQuantity,
    clearCart
  } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-fuchsia-500/20 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-orange-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Vaša korpa je prazna</h1>
          <p className="text-gray-400 mb-8">
            Izgleda da još niste dodali nijedan proizvod u korpu.
            Pregledajte našu ponudu i pronađite nešto za sebe!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-fuchsia-500 hover:from-orange-600 hover:to-fuchsia-600 text-white font-medium rounded-xl transition-all"
          >
            <Package className="w-5 h-5" />
            Nazad na početnu
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#0f0f18]">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container-custom py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Nazad na početnu
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Korpa</h1>
              <p className="text-gray-400 mt-1">
                {totals.itemCount} {totals.itemCount === 1 ? 'proizvod' : 'proizvoda'} u korpi
              </p>
            </div>
            <button
              onClick={clearCart}
              className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Isprazni korpu
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 sm:p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700"
                >
                  <div className="flex gap-4 sm:gap-6">
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <span className="text-lg font-semibold text-white truncate block">
                            {item.productName}{item.customization?.designCode ? ` - ${item.customization.designCode}` : ''}
                          </span>
                          
                          {/* Variants */}
                          <div className="flex flex-wrap gap-3 mt-2">
                            {item.color && (
                              <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                                <span 
                                  className="w-4 h-4 rounded-full border-2 border-gray-600" 
                                  style={{ backgroundColor: item.color }}
                                />
                                Boja
                              </span>
                            )}
                            {item.size && (
                              <span className="px-2 py-0.5 text-sm text-gray-400 bg-gray-700 rounded">
                                {item.size}
                              </span>
                            )}
                          </div>

                          {/* Edit design link — always 3D editor */}
                          {item.isPersonalized && (
                            <Link 
                              href={`/editor?edit=${item.id}`}
                              className="inline-flex items-center gap-1.5 mt-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Uredi dizajn
                            </Link>
                          )}
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors self-start shrink-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex items-center mt-4 pt-4 border-t border-gray-700">
                        {/* Quantity */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
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
                                updateQuantity(item.id, val);
                              }
                            }}
                            onBlur={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (isNaN(val) || val < 1) {
                                updateQuantity(item.id, 1);
                              }
                            }}
                            className="w-14 h-10 text-center text-white font-semibold text-lg bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700"
              >
                <h2 className="text-xl font-bold text-white mb-6">Pregled narudžbe</h2>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-orange-500 to-fuchsia-500 hover:from-orange-600 hover:to-fuchsia-600 text-white font-semibold rounded-xl transition-all"
                >
                  Nastavi
                  <ArrowRight className="w-5 h-5" />
                </Link>

                {/* Security Info */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <p>
                      Sigurna kupovina. Vaši podaci su zaštićeni SSL enkripcijom.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
