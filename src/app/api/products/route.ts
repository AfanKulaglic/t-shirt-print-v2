import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const supabase = createSupabaseAdmin()
  const { searchParams } = new URL(request.url)
  
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const search = searchParams.get('search')
  const header = searchParams.get('header')
  const personalizable = searchParams.get('personalizable')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (category) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single()
      
      if (cat) {
        query = query.eq('category_id', cat.id)
      }
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    if (header === 'true') {
      query = query.eq('show_in_header', true).not('model_path', 'is', null)
    }

    if (personalizable === 'true') {
      query = query.not('model_path', 'is', null)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: products, error, count } = await query
      .range(offset, offset + limit - 1)

    if (error) throw error

    const transformedProducts = products.map(p => {
      const basePrice = parseFloat(String(p.base_price || p.price || 0));
      const salePrice = p.sale_price ? parseFloat(String(p.sale_price)) : null;
      return {
        id: p.id,
        name: p.name,
        title: p.name,
        slug: p.slug,
        price: salePrice || basePrice,
        originalPrice: salePrice ? basePrice : undefined,
        discount: salePrice ? Math.round((1 - salePrice / basePrice) * 100) : undefined,
        description: p.description,
        shortDescription: p.short_description,
        image: p.images?.[0] || '/placeholder.jpg',
        images: p.images || [],
        category: p.category,
        tags: p.is_featured ? ['featured'] : [],
        status: (p.stock_quantity ?? 0) > 0 ? 'in-stock' : 'out-of-stock',
        rating: p.rating || 0,
        reviewCount: p.review_count || 0,
        createdAt: p.created_at,
        isPersonalizable: p.is_personalizable,
        showInHeader: p.show_in_header || false,
        model3d: p.model_path,
        zoomHeader: p.zoom_header || 1,
        zoomCard: p.zoom_card || 1,
        zoomEditor: p.zoom_editor || 1,
        modelColor: p.default_color,
      };
    })

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      total: count || products.length
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
