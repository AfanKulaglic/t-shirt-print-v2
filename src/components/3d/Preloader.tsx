'use client'

import { prefetchGltf } from '@/lib/gltf-prefetch'

let didPrefetch = false

interface PreloaderProps {
  enabled?: boolean
  children?: React.ReactNode
}

export default function Preloader({ enabled = true, children }: PreloaderProps) {
  if (typeof window !== 'undefined' && !didPrefetch && enabled) {
    didPrefetch = true
    prefetchGltf('/shirt/scene.gltf')
  }
  return <>{children}</>
}
