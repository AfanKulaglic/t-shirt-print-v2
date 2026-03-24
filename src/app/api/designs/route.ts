import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { parseUuidOrNull } from '@/lib/utils'

// Generate a short, readable design code
function generateDesignCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'D'
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// GET - Retrieve a design by code or session
export async function GET(request: NextRequest) {
  const supabase = createSupabaseAdmin()
  const { searchParams } = new URL(request.url)
  
  const code = searchParams.get('code')
  const sessionId = searchParams.get('session')
  
  try {
    if (code) {
      const { data, error } = await supabase
        .from('saved_designs')
        .select('*, product:products(id, name, model_path, base_price, default_color)')
        .eq('session_id', code)
        .single()
      
      if (error) throw error
      
      return NextResponse.json({ success: true, design: data })
    }
    
    if (sessionId) {
      const { data, error } = await supabase
        .from('saved_designs')
        .select('*, product:products(id, name, model_path, base_price)')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      return NextResponse.json({ success: true, designs: data })
    }
    
    return NextResponse.json({ success: false, error: 'Missing code or session' }, { status: 400 })
  } catch (error) {
    console.error('Design fetch error:', error)
    return NextResponse.json({ success: false, error: 'Design not found' }, { status: 404 })
  }
}

// POST - Save a new design
export async function POST(request: NextRequest) {
  const supabase = createSupabaseAdmin()
  
  try {
    const body = await request.json()
    const { productId, modelPath, designData, previewUrl, productName } = body
    
    let designCode = generateDesignCode()
    
    let attempts = 0
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from('saved_designs')
        .select('id')
        .eq('session_id', designCode)
        .single()
      
      if (!existing) break
      designCode = generateDesignCode()
      attempts++
    }
    
    const resolvedProductId = parseUuidOrNull(productId)

    const { data, error } = await supabase
      .from('saved_designs')
      .insert({
        session_id: designCode,
        product_id: resolvedProductId,
        name: productName || 'Majica',
        design_data: designData,
        preview_url: previewUrl || null,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ 
      success: true, 
      design: data,
      code: designCode 
    })
  } catch (error) {
    console.error('Design save error:', error)
    return NextResponse.json({ success: false, error: 'Failed to save design' }, { status: 500 })
  }
}

// PATCH - Update an existing design
export async function PATCH(request: NextRequest) {
  const supabase = createSupabaseAdmin()
  
  try {
    const body = await request.json()
    const { code, designData, previewUrl } = body
    
    if (!code) {
      return NextResponse.json({ success: false, error: 'Missing design code' }, { status: 400 })
    }
    
    const { data, error } = await supabase
      .from('saved_designs')
      .update({
        design_data: designData,
        preview_url: previewUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq('session_id', code)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ success: true, design: data })
  } catch (error) {
    console.error('Design update error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update design' }, { status: 500 })
  }
}
