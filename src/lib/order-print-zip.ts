import JSZip from 'jszip'

function safeSegment(s: string, max = 48): string {
  return s.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, max) || 'stavka'
}

function extFromUrl(url: string, contentType: string | null): string {
  const lower = url.split('?')[0].toLowerCase()
  if (lower.endsWith('.png')) return 'png'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'jpg'
  if (lower.endsWith('.webp')) return 'webp'
  if (lower.endsWith('.gif')) return 'gif'
  if (lower.endsWith('.svg')) return 'svg'
  if (lower.endsWith('.glb')) return 'glb'
  if (lower.endsWith('.gltf')) return 'gltf'
  if (lower.endsWith('.zip')) return 'zip'
  if (lower.endsWith('.tiff') || lower.endsWith('.tif')) return 'tif'
  if (contentType?.includes('png')) return 'png'
  if (contentType?.includes('jpeg')) return 'jpg'
  if (contentType?.includes('webp')) return 'webp'
  if (contentType?.includes('gltf')) return 'gltf'
  if (contentType?.includes('octet-stream')) return 'bin'
  return 'dat'
}

export type OrderItemForZip = {
  productName: string
  designImages?: string[]
  modelPath?: string | null
}

export async function buildOrderPrintZip(
  orderNumber: string,
  items: OrderItemForZip[]
): Promise<Buffer | null> {
  const zip = new JSZip()
  const root = zip.folder(`narudzba-${safeSegment(orderNumber, 32)}`)
  if (!root) return null

  let fileCount = 0

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const folder = root.folder(
      `${i + 1}-${safeSegment(item.productName)}`
    )
    if (!folder) continue

    const urls = [...(item.designImages || [])]
    if (item.modelPath && /^https?:\/\//i.test(item.modelPath)) {
      urls.push(item.modelPath)
    }

    for (let j = 0; j < urls.length; j++) {
      const url = urls[j]
      if (!url || !/^https?:\/\//i.test(url)) continue
      try {
        const ac = new AbortController()
        const timer = setTimeout(() => ac.abort(), 120_000)
        const res = await fetch(url, { signal: ac.signal }).finally(() =>
          clearTimeout(timer)
        )
        if (!res.ok) continue
        const buf = Buffer.from(await res.arrayBuffer())
        if (buf.length === 0) continue
        const ext = extFromUrl(url, res.headers.get('content-type'))
        folder.file(`print-${j + 1}.${ext}`, buf)
        fileCount++
      } catch (e) {
        console.warn('[order-print-zip] skip URL', url.slice(0, 80), e)
      }
    }
  }

  if (fileCount === 0) return null

  return zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  })
}
