import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

const BUCKET = '3dmodel'
const MAX_GRAPHICS_MB = 100

function mimeFromExt(ext: string | undefined): string {
  if (!ext) return 'application/octet-stream'
  const e = ext.toLowerCase()
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    tiff: 'image/tiff',
    tif: 'image/tiff',
  }
  return map[e] ?? 'application/octet-stream'
}

export const maxDuration = 300

export async function POST(request: NextRequest) {
  const supabase = createSupabaseAdmin()

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string | null
    const maxSizeOverride = Number(formData.get('maxSizeMB') || '')

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!folder) {
      return NextResponse.json(
        { success: false, error: 'No folder specified' },
        { status: 400 }
      )
    }

    const validFolders = ['products', 'graphics', 'models']
    if (!validFolders.includes(folder)) {
      return NextResponse.json(
        { success: false, error: 'Invalid folder' },
        { status: 400 }
      )
    }

    const ext = file.name.split('.').pop()?.toLowerCase()

    const allowedImages = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'tiff', 'tif']
    const allowedModels = ['gltf', 'glb']

    if (folder === 'models') {
      if (!ext || !allowedModels.includes(ext)) {
        return NextResponse.json(
          { success: false, error: 'Invalid model file type. Allowed: gltf, glb' },
          { status: 400 }
        )
      }
    } else {
      if (!ext || !allowedImages.includes(ext)) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Invalid image file type. Allowed: jpg, jpeg, png, gif, webp, svg, tiff, tif',
          },
          { status: 400 }
        )
      }
    }

    const defaultMaxSizeMB = folder === 'models' ? 50 : 10
    let maxSizeMB = defaultMaxSizeMB
    if (Number.isFinite(maxSizeOverride) && maxSizeOverride > defaultMaxSizeMB) {
      maxSizeMB = Math.min(maxSizeOverride, MAX_GRAPHICS_MB)
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: `File too large. Max size: ${maxSizeMB}MB` },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let contentType = file.type?.trim() || mimeFromExt(ext)
    const outputExt = ext ?? 'bin'

    const timestamp = Date.now()
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9-_.]/g, '-')
      .replace(/\.[^.]+$/, '')
    const fileName = `${sanitizedName}-${timestamp}.${outputExt}`
    const path = `${folder}/${fileName}`

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType,
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(data.path)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
      fileName: fileName,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    console.error('Upload exception:', error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = createSupabaseAdmin()

  try {
    const body = await request.json()
    const { path } = body as { path?: string }

    if (!path) {
      return NextResponse.json(
        { success: false, error: 'No path provided' },
        { status: 400 }
      )
    }

    const { error } = await supabase.storage.from(BUCKET).remove([path])

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Delete failed'
    console.error('Delete exception:', error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
