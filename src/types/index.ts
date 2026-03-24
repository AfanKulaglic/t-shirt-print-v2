// Product Types
export interface Product {
  id: string;
  name: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  shortDescription?: string;
  image: string;
  images?: string[];
  category: ProductCategory;
  tags: ProductTag[];
  status: ProductStatus;
  rating?: number;
  reviewCount?: number;
  createdAt: Date;
  colors?: string[];
  sizes?: string[];
}

export type ProductStatus = 'in-stock' | 'out-of-stock' | 'limited';

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

export type ProductTag = 'new' | 'sale' | 'hot' | 'featured' | 'bestseller';

export function isInStock(product: Product): boolean {
  return product.status === 'in-stock';
}

// Personalization Types
export interface PersonalizableProduct {
  id: number;
  name: string;
  model: string;
  zoom: number;
  color: string;
  gridArea: string;
  sides?: ProductSide[];
}

export interface ProductSide {
  id: string;
  name: string;
  boundaries: Boundaries;
}

export interface Boundaries {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

// Editor Types
export interface EditorLayer {
  id: string;
  type: 'image' | 'text';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  scale: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export interface EditorState {
  layers: EditorLayer[];
  selectedLayerId: string | null;
  modelPath: string;
  modelColor: string;
  selectedSide: string;
  zoom: number;
  history: EditorHistoryEntry[];
  historyIndex: number;
}

export interface EditorHistoryEntry {
  layers: EditorLayer[];
  timestamp: number;
}

// Navigation Types
export interface NavItem {
  id: number;
  title: string;
  href: string;
  submenu?: NavItem[];
  icon?: string;
}

// Contact Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minPurchase?: number;
  expiresAt: Date;
  usageLimit?: number;
  usedCount: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
  customization?: {
    layers: EditorLayer[];
    color: string;
    side: string;
  };
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
