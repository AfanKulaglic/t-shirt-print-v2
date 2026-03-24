'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Package, Truck, CheckCircle, Clock, 
  AlertCircle, MapPin, Calendar,
  Printer, Eye, Ship
} from 'lucide-react';
import { Button } from '@/components/ui';

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  variant: { color?: string; size?: string } | null;
  is_personalized: boolean;
  design_preview_url: string | null;
  model_render_url: string | null;
}

interface StatusHistoryItem {
  status: string;
  note: string | null;
  created_at: string;
}

interface Order {
  order_number: string;
  status: string;
  payment_status: string;
  shipping_address: {
    full_name: string;
    street: string;
    city: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total: number;
  tracking_number: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  items: OrderItem[];
  status_history: StatusHistoryItem[];
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Na čekanju', color: 'text-yellow-400 bg-yellow-400/10', icon: <Clock className="w-5 h-5" /> },
  confirmed: { label: 'Potvrđeno', color: 'text-blue-400 bg-blue-400/10', icon: <CheckCircle className="w-5 h-5" /> },
  processing: { label: 'U obradi', color: 'text-orange-400 bg-orange-400/10', icon: <Package className="w-5 h-5" /> },
  printing: { label: 'U izradi', color: 'text-fuchsia-400 bg-fuchsia-400/10', icon: <Printer className="w-5 h-5" /> },
  quality_check: { label: 'Kontrola kvalitete', color: 'text-cyan-400 bg-cyan-400/10', icon: <Eye className="w-5 h-5" /> },
  shipped: { label: 'Poslano', color: 'text-orange-400 bg-orange-400/10', icon: <Ship className="w-5 h-5" /> },
  delivered: { label: 'Dostavljeno', color: 'text-green-400 bg-green-400/10', icon: <CheckCircle className="w-5 h-5" /> },
  cancelled: { label: 'Otkazano', color: 'text-red-400 bg-red-400/10', icon: <AlertCircle className="w-5 h-5" /> },
  refunded: { label: 'Refundirano', color: 'text-gray-400 bg-gray-400/10', icon: <AlertCircle className="w-5 h-5" /> },
};

const orderSteps = ['pending', 'confirmed', 'processing', 'printing', 'quality_check', 'shipped', 'delivered'];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber.trim()) {
      setError('Unesite broj narudžbe');
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await fetch(`/api/orders?orderNumber=${encodeURIComponent(orderNumber.trim())}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Narudžba nije pronađena');
        return;
      }

      setOrder(data.order);
    } catch (err) {
      setError('Greška pri pretraživanju. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    if (order.status === 'cancelled' || order.status === 'refunded') return -1;
    return orderSteps.indexOf(order.status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bs-BA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#0f0f18]">
      <section className="pt-12 pb-8">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-orange-500/20 flex items-center justify-center">
              <Truck className="w-8 h-8 text-orange-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Praćenje{' '}
              <span className="bg-gradient-to-r from-orange-400 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
                narudžbe
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Unesite broj narudžbe da biste vidjeli status i detalje vaše narudžbe.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-8">
        <div className="container-custom max-w-2xl">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 p-6"
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Broj narudžbe
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  placeholder="npr. SS260121-A1B2"
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-fuchsia-500 hover:from-orange-600 hover:to-fuchsia-600 border-0 px-6"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Pretraži'
                )}
              </Button>
            </div>
            {error && (
              <p className="mt-3 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
            <p className="text-gray-500 text-sm mt-3">
              Broj narudžbe ste dobili putem emaila nakon što ste napravili narudžbu.
            </p>
          </motion.form>
        </div>
      </section>

      {order && (
        <section className="pb-16">
          <div className="container-custom max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Status Banner */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Narudžba</p>
                    <h2 className="text-2xl font-bold text-white">{order.order_number}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Kreirana {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${statusConfig[order.status]?.color || 'text-gray-400 bg-gray-400/10'}`}>
                    {statusConfig[order.status]?.icon}
                    <span className="font-medium">{statusConfig[order.status]?.label || order.status}</span>
                  </div>
                </div>

                {order.status !== 'cancelled' && order.status !== 'refunded' && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-700">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-500 to-fuchsia-500 transition-all duration-500"
                          style={{ width: `${(getCurrentStepIndex() / (orderSteps.length - 1)) * 100}%` }}
                        />
                      </div>
                      
                      {orderSteps.map((step, index) => {
                        const isCompleted = index <= getCurrentStepIndex();
                        const isCurrent = index === getCurrentStepIndex();
                        return (
                          <div key={step} className="relative flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all ${
                              isCompleted 
                                ? 'bg-gradient-to-r from-orange-500 to-fuchsia-500 text-white' 
                                : 'bg-gray-700 text-gray-400'
                            } ${isCurrent ? 'ring-4 ring-orange-500/30' : ''}`}>
                              {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                            </div>
                            <span className={`text-xs mt-2 whitespace-nowrap hidden sm:block ${isCompleted ? 'text-orange-400' : 'text-gray-500'}`}>
                              {statusConfig[step]?.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {order.tracking_number && (
                  <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <p className="text-orange-400 text-sm font-medium mb-1">Broj za praćenje pošiljke</p>
                    <p className="text-white font-mono text-lg">{order.tracking_number}</p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-400" />
                  Stavke narudžbe
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-800/50 rounded-lg">
                      {(item.model_render_url || item.design_preview_url) && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                          <img 
                            src={item.model_render_url || item.design_preview_url || ''} 
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{item.product_name}</h4>
                        <div className="text-sm text-gray-400 mt-1 flex flex-wrap gap-3">
                          <span>Količina: {item.quantity}</span>
                          {item.variant?.color && (
                            <span className="flex items-center gap-1">
                              Boja: <span className="inline-block w-3 h-3 rounded-full border border-gray-600" style={{ backgroundColor: item.variant.color }}></span>
                            </span>
                          )}
                          {item.variant?.size && (
                            <span>Veličina: {item.variant.size}</span>
                          )}
                          {item.is_personalized && (
                            <span className="text-orange-400">✨ Personalizirano</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  Adresa dostave
                </h3>
                <div className="text-gray-300">
                  <p className="font-medium text-white">{order.shipping_address.full_name}</p>
                  <p>{order.shipping_address.street}</p>
                  <p>{order.shipping_address.postal_code} {order.shipping_address.city}</p>
                  <p>{order.shipping_address.country}</p>
                  <p className="mt-2 text-gray-400">Tel: {order.shipping_address.phone}</p>
                </div>
              </div>

              {/* Status History */}
              {order.status_history && order.status_history.length > 0 && (
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-400" />
                    Historija statusa
                  </h3>
                  <div className="space-y-4">
                    {order.status_history.map((history, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className={`w-3 h-3 rounded-full mt-1.5 ${statusConfig[history.status]?.color.split(' ')[0] || 'bg-gray-400'}`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="font-medium text-white">
                              {statusConfig[history.status]?.label || history.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatDate(history.created_at)}
                            </span>
                          </div>
                          {history.note && (
                            <p className="text-gray-400 text-sm mt-1">{history.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
