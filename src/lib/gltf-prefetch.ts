import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

const prefetched = new Set<string>()

export function prefetchGltf(url: string) {
  if (prefetched.has(url)) return
  prefetched.add(url)
  gltfLoader.load(
    url,
    () => {},
    undefined,
    (err) => console.warn('[gltf-prefetch]', url, err),
  )
}

export { gltfLoader, dracoLoader }
