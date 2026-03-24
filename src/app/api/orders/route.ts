import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { sendMail, emailTemplates } from '@/lib/mail'
import { parseUuidOrNull } from '@/lib/utils'
import { buildOrderPrintZip } from '@/lib/order-print-zip'
import { getOrderNotifyRecipients } from '@/lib/app-settings'

// Generate order number
function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SS${year}${month}${day}-${random}`
}

export async function POST(request: NextRequest) {
  console.log('=== ORDER API CALLED ===')
  
  try {
    const supabase = createSupabaseAdmin()
    
    const orderData = await request.json()
    console.log('Received order data:', JSON.stringify(orderData, null, 2))
    
    const { items, shipping, payment, totals, coupon } = orderData
    const shippingMethod = shipping?.deliveryMethod || 'delivery'
    const isPickup = shippingMethod === 'pickup_ariamall' || shippingMethod === 'pickup_scc'

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Korpa je prazna' },
        { status: 400 }
      )
    }

    // Validate required shipping info
    if (!shipping?.firstName || !shipping?.lastName || !shipping?.email || !shipping?.phone) {
      return NextResponse.json(
        { error: 'Nepotpuni podaci za dostavu' },
        { status: 400 }
      )
    }

    if (!isPickup && (!shipping?.address || !shipping?.city)) {
      return NextResponse.json(
        { error: 'Nepotpuni podaci za dostavu' },
        { status: 400 }
      )
    }

    const pickupLocation = shippingMethod === 'pickup_ariamall'
      ? 'Preuzimanje - Aria Mall'
      : shippingMethod === 'pickup_scc'
        ? 'Preuzimanje - SCC'
        : null

    const orderNumber = generateOrderNumber()

    const shippingAddress = {
      full_name: `${shipping.firstName} ${shipping.lastName}`,
      street: pickupLocation || shipping.address,
      city: isPickup ? 'Sarajevo' : shipping.city,
      postal_code: isPickup ? '' : (shipping.postalCode || ''),
      country: shipping.country || 'Bosna i Hercegovina',
      phone: shipping.phone,
      email: shipping.email,
      delivery_method: shippingMethod,
    }

    const orderPayload = {
      order_number: orderNumber,
      guest_email: shipping.email,
      guest_name: `${shipping.firstName} ${shipping.lastName}`,
      guest_phone: shipping.phone,
      status: 'pending',
      shipping_address: shippingAddress,
      billing_address: shippingAddress,
      company_name: shipping.companyName || null,
      company_id: shipping.companyId || null,
      pdv_number: shipping.pdvNumber || null,
      subtotal: totals.subtotal,
      shipping_cost: totals.shipping,
      discount_amount: totals.discount || 0,
      tax_amount: totals.tax,
      total: totals.total,
      coupon_code: coupon?.code || null,
      shipping_method: shippingMethod,
      payment_method: payment?.method || 'inquiry',
      payment_status: 'pending',
      customer_notes: shipping.notes || null
    }

    console.log('Creating order with payload:', JSON.stringify(orderPayload, null, 2))

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        { error: `Greška pri kreiranju narudžbe: ${orderError.message}` },
        { status: 500 }
      )
    }

    console.log('Order created successfully:', order.id)

    const orderItems = items.map((item: any) => {
      const c = item.customization || {}
      const resolvedModelPath = item.modelPath ?? c.modelPath ?? null
      const personalization_data =
        item.customization || resolvedModelPath || item.color || item.size
          ? {
              ...c,
              ...(resolvedModelPath ? { modelPath: resolvedModelPath } : {}),
              ...(item.color ? { color: item.color } : {}),
              ...(item.size ? { size: item.size } : {}),
            }
          : null

      return {
        order_id: order.id,
        product_id: parseUuidOrNull(item.productId),
        product_name: item.productName,
        product_sku: null,
        quantity: item.quantity,
        unit_price: item.salePrice ?? item.unitPrice,
        total_price: (item.salePrice ?? item.unitPrice) * item.quantity,
        variant: item.color || item.size ? { color: item.color, size: item.size } : null,
        is_personalized: item.isPersonalized || false,
        personalization_data,
        design_images: item.designImages || [],
        design_preview_url: item.designPreviewUrl || null,
        model_render_url: item.modelRenderUrl || item.designPreviewUrl || null,
        model_render_data: item.modelRenderData || null,
        model_path: resolvedModelPath,
        design_code: item.designCode || null,
        editor_type: '3d',
      }
    })

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items error:', itemsError)
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        {
          error: `Greška pri spremanju stavki narudžbe: ${itemsError.message}`,
        },
        { status: 500 }
      )
    }

    // Add initial status to history
    await supabase
      .from('order_status_history')
      .insert({
        order_id: order.id,
        status: 'pending',
        note: 'Narudžba kreirana',
        created_by: 'system'
      })

    // Send email notification to workers
    try {
      const getColorName = (color: string | undefined): string => {
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
      };

      const getAreaName = (area: string | undefined): string => {
        switch (area) {
          case 'front': return 'Prednja strana';
          case 'back': return 'Zadnja strana';
          case 'leftSleeve': return 'Lijevi rukav';
          case 'rightSleeve': return 'Desni rukav';
          default: return area || '';
        }
      };

      const emailItems = items.map((item: any) => {
        const areas: string[] = [];
        if (item.customization?.graphics) {
          Object.values(item.customization.graphics).forEach((g: any) => {
            if (g?.area) areas.push(getAreaName(g.area));
          });
        }

        const texts: Array<{
          content: string;
          area: string;
          fontSize: number;
          fontFamily: string;
          fontWeight: string;
          fontStyle: string;
          color: string;
        }> = [];
        if (item.customization?.texts) {
          Object.values(item.customization.texts).forEach((t: any) => {
            if (t?.content) {
              texts.push({
                content: t.content,
                area: t.area,
                fontSize: t.fontSize,
                fontFamily: t.fontFamily,
                fontWeight: t.fontWeight,
                fontStyle: t.fontStyle,
                color: t.color,
              });
            }
          });
        }

        const imgs: string[] = item.designImages || []
        const previewUrl =
          (item.designPreviewUrl as string | undefined) ||
          (imgs.length > 0 ? imgs[0] : undefined)

        return {
          productName: item.productName,
          quantity: item.quantity,
          color: getColorName(item.color),
          designImages: imgs,
          previewUrl,
          designCode: item.designCode || undefined,
          size: item.size || undefined,
          areas: areas.length > 0 ? areas : undefined,
          texts: texts.length > 0 ? texts : undefined,
          editorType: '3d',
        };
      });

      const workerEmail = emailTemplates.workerNotification({
        orderNumber: orderNumber,
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        customerEmail: shipping.email,
        customerPhone: shipping.phone,
        address: shipping.address,
        city: shipping.city,
        postalCode: shipping.postalCode || '',
        country: shipping.country || 'Bosna i Hercegovina',
        deliveryMethod: shippingMethod,
        companyName: shipping.companyName || undefined,
        companyId: shipping.companyId || undefined,
        pdvNumber: shipping.pdvNumber || undefined,
        customerNotes: shipping.notes || undefined,
        items: emailItems,
      });

      let zipBuffer: Buffer | null = null
      try {
        zipBuffer = await buildOrderPrintZip(
          orderNumber,
          items.map((item: any) => ({
            productName: item.productName || 'stavka',
            designImages: item.designImages || [],
            modelPath:
              item.modelPath ||
              item.customization?.modelPath ||
              item.customization?.model_path ||
              null,
          }))
        )
      } catch (zipErr) {
        console.error('Order print ZIP failed:', zipErr)
      }

      const notifyTo = await getOrderNotifyRecipients()

      await sendMail({
        to: notifyTo,
        ...workerEmail,
        ...(zipBuffer && zipBuffer.length > 0
          ? {
              attachments: [
                {
                  filename: `shirtshop-${orderNumber}-print.zip`,
                  content: zipBuffer,
                  contentType: 'application/zip',
                },
              ],
            }
          : {}),
      });

      console.log('Worker notification email sent for order:', orderNumber);
    } catch (emailError) {
      console.error('Failed to send worker notification email:', emailError);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: orderNumber
    })

  } catch (error: any) {
    console.error('Order API error:', error)
    return NextResponse.json(
      { error: `Interna greška servera: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}

// Get order by order number (for tracking)
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseAdmin()
    
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Broj narudžbe je obavezan' },
        { status: 400 }
      )
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        status_history:order_status_history (*)
      `)
      .eq('order_number', orderNumber.toUpperCase())
      .single()

    if (error || !order) {
      return NextResponse.json(
        { error: 'Narudžba nije pronađena' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order: {
        order_number: order.order_number,
        status: order.status,
        payment_status: order.payment_status,
        shipping_address: order.shipping_address,
        subtotal: order.subtotal,
        shipping_cost: order.shipping_cost,
        discount_amount: order.discount_amount,
        total: order.total,
        tracking_number: order.tracking_number,
        shipped_at: order.shipped_at,
        delivered_at: order.delivered_at,
        created_at: order.created_at,
        items: order.order_items?.map((item: any) => ({
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          variant: item.variant,
          is_personalized: item.is_personalized,
          design_preview_url: item.design_preview_url,
          model_render_url: item.model_render_url
        })),
        status_history: order.status_history?.map((h: any) => ({
          status: h.status,
          note: h.note,
          created_at: h.created_at
        })).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }
    })

  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json(
      { error: 'Interna greška servera' },
      { status: 500 }
    )
  }
}
