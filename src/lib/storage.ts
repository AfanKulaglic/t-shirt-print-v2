import { createSupabaseClient, createSupabaseAdmin } from './supabase'

export const STORAGE_BUCKET = 'print'

export const STORAGE_FOLDERS = {
  PRODUCT_IMAGES: 'products',
  USER_GRAPHICS: 'graphics',
  MODELS: 'models',
} as const

export type StorageFolder = typeof STORAGE_FOLDERS[keyof typeof STORAGE_FOLDERS]

export function getPublicUrl(path: string): string {
  const supabase = createSupabaseClient()
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function uploadFile(
  file: File,
  folder: StorageFolder,
  customName?: string
): Promise<{ url: string; path: string } | { error: string }> {
  const supabase = createSupabaseClient()
  
  const timestamp = Date.now()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const sanitizedName = customName 
    ? customName.replace(/[^a-zA-Z0-9-_]/g, '-')
    : file.name.replace(/[^a-zA-Z0-9-_.]/g, '-').replace(/\.[^.]+$/, '')
  const fileName = `${sanitizedName}-${timestamp}.${ext}`
  const path = `${folder}/${fileName}`
  
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })
    
    if (error) {
      console.error('Upload error:', error)
      return { error: error.message }
    }
    
    const url = getPublicUrl(data.path)
    return { url, path: data.path }
  } catch (err: any) {
    console.error('Upload exception:', err)
    return { error: err.message || 'Upload failed' }
  }
}

export async function uploadBase64(
  base64Data: string,
  folder: StorageFolder,
  fileName: string,
  contentType: string = 'image/png'
): Promise<{ url: string; path: string } | { error: string }> {
  const supabase = createSupabaseClient()
  
  const base64Content = base64Data.replace(/^data:[^;]+;base64,/, '')
  
  const byteCharacters = atob(base64Content)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: contentType })
  
  const timestamp = Date.now()
  const ext = contentType.split('/')[1] || 'png'
  const path = `${folder}/${fileName}-${timestamp}.${ext}`
  
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, blob, {
        contentType,
        cacheControl: '3600',
        upsert: false,
      })
    
    if (error) {
      console.error('Base64 upload error:', error)
      return { error: error.message }
    }
    
    const url = getPublicUrl(data.path)
    return { url, path: data.path }
  } catch (err: any) {
    console.error('Base64 upload exception:', err)
    return { error: err.message || 'Upload failed' }
  }
}

export async function deleteFile(path: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createSupabaseAdmin()
  
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path])
    
    if (error) {
      console.error('Delete error:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (err: any) {
    console.error('Delete exception:', err)
    return { success: false, error: err.message || 'Delete failed' }
  }
}

export async function listFiles(folder: StorageFolder, limit = 100): Promise<{ files: string[]; error?: string }> {
  const supabase = createSupabaseClient()
  
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(folder, {
        limit,
        sortBy: { column: 'created_at', order: 'desc' },
      })
    
    if (error) {
      console.error('List error:', error)
      return { files: [], error: error.message }
    }
    
    const files = data
      .filter(item => item.name && !item.name.startsWith('.'))
      .map(item => `${folder}/${item.name}`)
    
    return { files }
  } catch (err: any) {
    console.error('List exception:', err)
    return { files: [], error: err.message || 'List failed' }
  }
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase()
  return ext ? allowedTypes.includes(ext) : false
}

export function validateFileSize(file: File, maxSizeMB: number): boolean {
  return file.size <= maxSizeMB * 1024 * 1024
}

export const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
export const ALLOWED_MODEL_TYPES = ['gltf', 'glb']
export const MAX_IMAGE_SIZE_MB = 10
export const MAX_MODEL_SIZE_MB = 50
