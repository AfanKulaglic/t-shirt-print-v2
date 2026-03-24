'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Truck, MapPin,
  User, Mail, Phone, Building2, ChevronDown, Check,
  Package, CheckCircle, Copy
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'

function getColorName(color: string | undefined): string {
  if (!color) return '';
  const colorMap: Record<string, string> = {
    '#ffffff': 'Bijela',
    '#1a1a1a': 'Crna',
    '#ef4444': 'Crvena',
    '#3b82f6': 'Plava',
    '#10b981': 'Zelena',
    '#f59e0b': 'Žuta',
  };
  return colorMap[color.toLowerCase()] || color;
}

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  deliveryMethod: '' | 'pickup_ariamall' | 'pickup_scc' | 'delivery'
  address: string
  city: string
  postalCode: string
  country: string
  notes: string
  companyName: string
  companyId: string
  pdvNumber: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totals, clearCart, closeCart } = useCart()
  
  const [loading, setLoading] = useState(false)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    deliveryMethod: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Bosna i Hercegovina',
    notes: '',
    companyName: '',
    companyId: '',
    pdvNumber: ''
  })
  const [errors, setErrors] = useState<Partial<ShippingInfo> & { pickupOrDelivery?: string }>({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const requiresDeliveryAddress = shippingInfo.deliveryMethod === 'delivery'

  useEffect(() => {
    closeCart()
  }, [closeCart])

  useEffect(() => {
    if (items.length === 0 && !showSuccessModal) {
      router.push('/cart')
    }
  }, [items, router, showSuccessModal])

  const validateShippingInfo = (): boolean => {
    const newErrors: Partial<ShippingInfo> & { pickupOrDelivery?: string } = {}

    if (!shippingInfo.firstName.trim()) newErrors.firstName = 'Ime je obavezno'
    if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Prezime je obavezno'
    if (!shippingInfo.email.trim()) {
      newErrors.email = 'Email je obavezan'
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = 'Unesite ispravnu email adresu'
    }
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = 'Telefon je obavezan'
    } else if (!/^[\d\s+()-]{9,}$/.test(shippingInfo.phone)) {
      newErrors.phone = 'Unesite ispravan broj telefona'
    }
    if (!shippingInfo.deliveryMethod) {
      newErrors.pickupOrDelivery = 'Odaberite način preuzimanja ili dostave'
    }
    if (requiresDeliveryAddress) {
      if (!shippingInfo.address.trim()) newErrors.address = 'Adresa je obavezna'
      if (!shippingInfo.city.trim()) newErrors.city = 'Grad je obavezan'
      if (!shippingInfo.postalCode.trim()) newErrors.postalCode = 'Poštanski broj je obavezan'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitOrder = () => {
    // All items are shirts — size is always required
    const missingSize = items.find((item) => !item.size)
    if (missingSize) {
      toast.error('Veličina je obavezna za sve majice u narudžbi.')
      return
    }

    if (validateShippingInfo()) {
      handlePlaceOrder()
    }
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.salePrice ?? item.unitPrice,
          color: item.color,
          size: item.size,
          variant: item.variant,
          customization: item.customization,
          isPersonalized: item.isPersonalized,
          designImages: item.customization?.allImages || (item.customization?.image ? [item.customization.image] : []),
          designPreviewUrl: item.customization?.previewImage || item.customization?.image || null,
          modelRenderUrl: item.customization?.previewImages?.[0]?.url || item.customization?.previewImage || null,
          modelPath: item.modelPath,
          designCode: item.customization?.designCode || null,
          editorType: '3d',
        })),
        shipping: shippingInfo,
        payment: {
          method: 'inquiry'
        },
        totals: {
          subtotal: totals.subtotal,
          discount: 0,
          shipping: totals.shipping,
          tax: totals.tax,
          total: totals.total
        }
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const { orderNumber } = await response.json()
      
      setCompletedOrderNumber(orderNumber)
      clearCart()
      setShowSuccessModal(true)
      
    } catch (error) {
      console.error('Order error:', error)
      toast.error('Došlo je do greške prilikom kreiranja narudžbe. Molimo pokušajte ponovo.')
    } finally {
      setLoading(false)
    }
  }

  const copyOrderNumber = () => {
    if (completedOrderNumber) {
      navigator.clipboard.writeText(completedOrderNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (items.length === 0 && !showSuccessModal) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#0f0f18]">
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && completedOrderNumber && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500 to-fuchsia-500 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                Narudžba uspješna!
              </h2>
              <p className="text-gray-400 mb-6">
                Hvala vam na povjerenju. Vaša narudžba je primljena i bit će obrađena.
              </p>
              
              <div className="mb-6 p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                <p className="text-sm text-gray-400 mb-1">Broj narudžbe</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-2xl font-bold text-orange-400">#{completedOrderNumber}</p>
                  <button
                    onClick={copyOrderNumber}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                    title="Kopiraj broj"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Sačuvajte ovaj broj za praćenje narudžbe
                </p>
              </div>
              
              <div className="space-y-3">
                <Link
                  href={`/track-order?order=${completedOrderNumber}`}
                  className="block w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-fuchsia-500 hover:from-orange-600 hover:to-fuchsia-600 text-white font-medium rounded-xl transition-all"
                >
                  <Package className="w-5 h-5 inline mr-2" />
                  Prati narudžbu
                </Link>
                <Link
                  href="/"
                  className="block w-full py-3 px-4 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium rounded-xl transition-all"
                >
                  Nazad na početnu
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container-custom py-6">
          <h1 className="text-2xl font-bold text-white text-center">Završi narudžbu</h1>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Podaci</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Način preuzimanja / dostave *
                  </label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={shippingInfo.deliveryMethod}
                      onChange={(e) => {
                        const v = e.target.value as ShippingInfo['deliveryMethod']
                        setShippingInfo({
                          ...shippingInfo,
                          deliveryMethod: v,
                          address: v === 'delivery' ? shippingInfo.address : '',
                          city: v === 'delivery' ? shippingInfo.city : '',
                          postalCode: v === 'delivery' ? shippingInfo.postalCode : '',
                        })
                      }}
                      className={`w-full pl-11 pr-4 py-3 bg-gray-800 border ${errors.pickupOrDelivery ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    >
                      <option value="">Odaberi način preuzimanja ili dostave</option>
                      <option value="pickup_ariamall">Preuzimanje u Aria Mall</option>
                      <option value="pickup_scc">Preuzimanje u SCC</option>
                      <option value="delivery">Dostava</option>
                    </select>
                    {errors.pickupOrDelivery && (
                      <p className="text-red-400 text-sm mt-1">{errors.pickupOrDelivery}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ime *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                      className={`w-full pl-11 pr-4 py-3 bg-gray-800 border ${errors.firstName ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="Vaše ime"
                    />
                  </div>
                  {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Prezime *</label>
                  <input
                    type="text"
                    value={shippingInfo.lastName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-800 border ${errors.lastName ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="Vaše prezime"
                  />
                  {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      className={`w-full pl-11 pr-4 py-3 bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="email@primjer.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Telefon *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className={`w-full pl-11 pr-4 py-3 bg-gray-800 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="+387 61 123 456"
                    />
                  </div>
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>

                {requiresDeliveryAddress ? (
                  <>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Adresa *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                          className={`w-full pl-11 pr-4 py-3 bg-gray-800 border ${errors.address ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                          placeholder="Ulica i broj"
                        />
                      </div>
                      {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Grad *</label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className={`w-full px-4 py-3 bg-gray-800 border ${errors.city ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        placeholder="Sarajevo"
                      />
                      {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Poštanski broj *</label>
                      <input
                        type="text"
                        value={shippingInfo.postalCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                        className={`w-full px-4 py-3 bg-gray-800 border ${errors.postalCode ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        placeholder="71000"
                      />
                      {errors.postalCode && <p className="text-red-400 text-sm mt-1">{errors.postalCode}</p>}
                    </div>
                  </>
                ) : (
                  shippingInfo.deliveryMethod && (
                    <div className="sm:col-span-2 rounded-xl border border-orange-500/20 bg-orange-500/10 p-4 text-sm text-orange-100">
                      Lokaciju preuzimanja ste odabrali iznad. Tim će vas kontaktirati kada narudžba bude spremna.
                    </div>
                  )
                )}

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Država</label>
                  <select
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Bosna i Hercegovina">Bosna i Hercegovina</option>
                    <option value="Srbija">Srbija</option>
                    <option value="Hrvatska">Hrvatska</option>
                    <option value="Crna Gora">Crna Gora</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Napomena (opcionalno)</label>
                  <textarea
                    value={shippingInfo.notes}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    placeholder="Dodatne napomene za dostavu..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ime firme</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={shippingInfo.companyName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, companyName: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Naziv firme"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">ID broj firme (opcionalno)</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={shippingInfo.companyId}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, companyId: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="ID broj firme"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">PDV broj firme (opcionalno)</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={shippingInfo.pdvNumber}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, pdvNumber: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="PDV broj"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-gray-700 bg-gray-800/60 p-4 text-sm text-gray-300">
                Rok isporuke je 24 do 72 h. Za veće narudžbe bit ćete obaviješteni o roku isporuke i cijeni.
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={loading}
                className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-fuchsia-500 hover:from-orange-600 hover:to-fuchsia-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Slanje...
                  </>
                ) : (
                  <>
                    Pošalji Upit
                    <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700">
                <h2 className="text-lg font-bold text-white mb-4">Vaša narudžba</h2>

                <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-sm font-medium text-white">
                        {item.productName}{item.customization?.designCode ? ` - ${item.customization.designCode}` : ''}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                        {item.color && (
                          <span>Boja: <span className="text-gray-300">{getColorName(item.color)}</span></span>
                        )}
                        {item.size && (
                          <span>Veličina: <span className="text-gray-300">{item.size}</span></span>
                        )}
                        <span>Količina: <span className="text-gray-300">{item.quantity}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-gray-800 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <p className="text-xs text-gray-400">
                  Vaši podaci su sigurni i zaštićeni.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
