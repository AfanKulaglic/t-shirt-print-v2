import { personalizableProducts } from '@/data/categories'
import type { Product, ProductCategory } from '@/types'

const API_BASE = typeof window !== 'undefined' 
  ? '' 
  : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

function transformProduct(apiProduct: any): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    title: apiProduct.title || apiProduct.name,
    price: apiProduct.price,
    discount: apiProduct.discount,
    originalPrice: apiProduct.discount ? apiProduct.price + apiProduct.discount : undefined,
    description: apiProduct.description,
    shortDescription: apiProduct.shortDescription,
    image: apiProduct.image,
    images: apiProduct.images,
    category: apiProduct.category || {
      id: '0',
      name: 'Majice',
      slug: 'majice',
      productCount: 1
    },
    tags: apiProduct.tags || [],
    status: apiProduct.status || 'in-stock',
    rating: apiProduct.rating,
    reviewCount: apiProduct.reviewCount,
    createdAt: new Date(apiProduct.createdAt),
    colors: apiProduct.colors,
    sizes: apiProduct.sizes,
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE}/api/products?personalizable=true`, {
      next: { revalidate: 60 }
    })
    
    if (!response.ok) return []
    
    const data = await response.json()
    
    if (data.success && data.products?.length > 0) {
      return data.products.map(transformProduct)
    }
    
    return []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export interface HeaderProduct {
  id: string;
  name: string;
  model3d: string;
  modelColor: string;
  zoomHeader: number;
  zoomCard: number;
  zoomEditor: number;
}

export interface PersonalizableProductDB {
  id: string;
  name: string;
  model: string;
  color: string;
  zoom: number;
  zoomCard: number;
  zoomEditor: number;
}

export async function fetchPersonalizableProducts(): Promise<PersonalizableProductDB[]> {
  try {
    const response = await fetch(`${API_BASE}/api/products?personalizable=true&limit=50`, {
      next: { revalidate: 60 }
    })
    
    if (!response.ok) throw new Error('Failed to fetch personalizable products')
    
    const data = await response.json()
    
    if (data.success && data.products?.length > 0) {
      return data.products.map((p: any) => ({
        id: p.id,
        name: p.name,
        model: p.model3d,
        color: p.modelColor || '#ffffff',
        zoom: p.zoomCard || 1,
        zoomCard: p.zoomCard || 1,
        zoomEditor: p.zoomEditor || 1,
      }))
    }
    
    return []
  } catch (error) {
    console.error('Error fetching personalizable products:', error)
    return []
  }
}

export async function fetchHeaderProducts(): Promise<HeaderProduct[]> {
  try {
    const response = await fetch(`${API_BASE}/api/products?header=true&limit=10`, {
      next: { revalidate: 60 }
    })
    
    if (!response.ok) return []
    
    const data = await response.json()
    
    if (data.success && data.products?.length > 0) {
      return data.products.map((p: any) => ({
        id: p.id,
        name: p.name,
        model3d: p.model3d,
        modelColor: p.modelColor || '#ffffff',
        zoomHeader: p.zoomHeader || 1,
        zoomCard: p.zoomCard || 1,
        zoomEditor: p.zoomEditor || 1,
      }))
    }
    
    return []
  } catch (error) {
    console.error('Error fetching header products:', error)
    return []
  }
}

export interface EditorProduct {
  id: string;
  name: string;
  model: string;
  color: string;
  zoomEditor: number;
  price: number;
}

export async function fetchProductByModelPath(modelPath: string): Promise<EditorProduct | null> {
  try {
    const response = await fetch(`${API_BASE}/api/products?personalizable=true&limit=50`, {
      next: { revalidate: 60 }
    })
    
    if (!response.ok) return null
    
    const data = await response.json()
    
    if (data.success && data.products?.length > 0) {
      const product = data.products.find((p: any) => p.model3d === modelPath)
      if (product) {
        return {
          id: product.id,
          name: product.name,
          model: product.model3d,
          color: product.modelColor || '#ffffff',
          zoomEditor: product.zoomEditor || 1,
          price: product.price || 25,
        }
      }
    }
    
    return null
  } catch (error) {
    console.error('Error fetching product by model path:', error)
    return null
  }
}
