'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  Palette,
  ShoppingCart,
  Trash2,
  Check,
  Plus,
  Minus,
  Save,
  Copy,
  Type,
  Bold,
  Italic,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { personalizableProducts } from '@/data/categories';
import { useCart } from '@/context/CartContext';
import { fetchProductByModelPath, EditorProduct } from '@/lib/data-fetching';
import { getEditorZoomForModelPath } from '@/lib/model-viewer-zoom';
import toast from 'react-hot-toast';
import type { EditorModelViewerExportApi, EditorModelViewerHandle } from '@/components/3d/EditorModelViewer';

// Dynamic import for 3D viewer
const EditorModelViewer = dynamic(() => import('@/components/3d/EditorModelViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
      <div className="animate-pulse text-4xl">🎨</div>
    </div>
  ),
});

// Product colors
const productColors = [
  { name: 'Bijela', value: '#ffffff' },
  { name: 'Crna', value: '#1a1a1a' },
  { name: 'Crvena', value: '#ef4444' },
  { name: 'Plava', value: '#3b82f6' },
  { name: 'Zelena', value: '#10b981' },
  { name: 'Žuta', value: '#f59e0b' },
];

const GARMENT_SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

/** Native select chevron (gray-300 stroke) — avoids browser default arrow spacing issues. */
const SIZE_SELECT_CHEVRON_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;

interface GraphicItem {
  id: string;
  src: string;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  area: 'front' | 'back' | 'rightSleeve' | 'leftSleeve';
}

interface TextItem {
  id: string;
  content: string;
  position: { x: number; y: number };
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  color: string;
  area: 'front' | 'back';
}

// Text colors for the color picker
const textColors = [
  { name: 'Crna', value: '#000000' },
  { name: 'Bijela', value: '#ffffff' },
  { name: 'Crvena', value: '#ef4444' },
  { name: 'Plava', value: '#3b82f6' },
  { name: 'Zelena', value: '#10b981' },
  { name: 'Žuta', value: '#f59e0b' },
  { name: 'Ljubičasta', value: '#8b5cf6' },
  { name: 'Roza', value: '#ec4899' },
];

// Font families available
const fontFamilies = [
  { name: 'Arial', value: 'Arial' },
  { name: 'Times New Roman', value: 'Times New Roman' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Verdana', value: 'Verdana' },
  { name: 'Courier New', value: 'Courier New' },
  { name: 'Cursive', value: 'cursive' },
  { name: 'Brush Script', value: 'Brush Script MT, cursive' },
  { name: 'Comic Sans', value: 'Comic Sans MS, cursive' },
];

// Shirt print areas
const shirtPrintAreas = [
  { id: 'front', name: 'Prednja', icon: '👕' },
  { id: 'back', name: 'Zadnja', icon: '🔙' },
  { id: 'leftSleeve', name: 'L rukav', icon: '💪' },
  { id: 'rightSleeve', name: 'D rukav', icon: '💪' },
];

const MODEL_PATH = '/shirt/scene.gltf';

export default function EditorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const loadDesignCode = searchParams.get('code');

  // Fallback to static data
  const staticProduct = personalizableProducts[0];
  
  // Database product state
  const [dbProduct, setDbProduct] = useState<EditorProduct | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  
  // Fetch product from database on mount
  useEffect(() => {
    async function loadProduct() {
      const product = await fetchProductByModelPath(MODEL_PATH);
      setDbProduct(product);
      // Loading a saved design by ?code= sets color from design_data — don't overwrite with DB default
      if (product?.color && !loadDesignCode) {
        setProductColor(product.color);
      }
      setLoadingProduct(false);
    }
    loadProduct();
  }, [loadDesignCode]);
  
  // Use database zoom if available, otherwise fall back to static
  const editorZoom = dbProduct?.zoomEditor || getEditorZoomForModelPath(MODEL_PATH);
  const currentProductName = dbProduct?.name || staticProduct?.name || 'Majica';
  const currentProductId = dbProduct?.id || staticProduct?.id;
  const currentProductPrice = dbProduct?.price || 25;

  // State - graphics stored by area
  const [graphics, setGraphics] = useState<Partial<Record<'front' | 'back' | 'rightSleeve' | 'leftSleeve', GraphicItem>>>({});
  // State - texts stored by area (only front/back support text)
  const [texts, setTexts] = useState<Partial<Record<'front' | 'back', TextItem>>>({});
  const [productColor, setProductColor] = useState(staticProduct?.color || '#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedArea, setSelectedArea] = useState<'front' | 'back' | 'rightSleeve' | 'leftSleeve'>('front');
  // Delete menu state
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  // Text editing state
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [editingText, setEditingText] = useState<TextItem | null>(null);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);
  // Positioning mode: which element is being positioned on the grid
  const [positioningMode, setPositioningMode] = useState<'image' | 'text'>('image');
  
  // Track mobile keyboard visibility via visualViewport
  useEffect(() => {
    if (!showTextEditor) {
      setKeyboardHeight(0);
      return;
    }
    const vv = window.visualViewport;
    if (!vv) {
      setViewportHeight(window.innerHeight);
      return;
    }
    
    const onResize = () => {
      const kbH = window.innerHeight - vv.height;
      setKeyboardHeight(kbH > 50 ? kbH : 0);
      setViewportHeight(vv.height);
    };
    
    vv.addEventListener('resize', onResize);
    vv.addEventListener('scroll', onResize);
    onResize();
    
    return () => {
      vv.removeEventListener('resize', onResize);
      vv.removeEventListener('scroll', onResize);
    };
  }, [showTextEditor]);

  // Lock body scroll on iOS Safari when text editor is open
  useEffect(() => {
    if (!showTextEditor) return;
    const origOverflow = document.body.style.overflow;
    const origPosition = document.body.style.position;
    const origTop = document.body.style.top;
    const origWidth = document.body.style.width;
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    return () => {
      document.body.style.overflow = origOverflow;
      document.body.style.position = origPosition;
      document.body.style.top = origTop;
      document.body.style.width = origWidth;
      window.scrollTo(0, scrollY);
    };
  }, [showTextEditor]);

  // Auto-scroll focused input into view on iOS Safari
  useEffect(() => {
    if (!showTextEditor) return;
    const onFocusIn = () => {
      setTimeout(() => {
        const el = document.activeElement as HTMLElement;
        if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, [showTextEditor]);

  // Check if current area supports text (only front/back)
  const areaSupportsText = selectedArea === 'front' || selectedArea === 'back';
  
  // Get current area's text
  const currentText = areaSupportsText ? texts[selectedArea as 'front' | 'back'] : null;
  
  // Target rotation based on selected area
  const areaRotations: Record<string, { x: number; y: number }> = {
    'front': { x: 0, y: 0 },
    'back': { x: 0, y: Math.PI },
    'leftSleeve': { x: 0, y: Math.PI / 2 },
    'rightSleeve': { x: 0, y: -Math.PI / 2 },
  };
  const targetRotation = areaRotations[selectedArea];
  
  // Get current area's graphic
  const currentGraphic = graphics[selectedArea] || null;
  
  const gridRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewerRef = useRef<EditorModelViewerHandle>(null);
  const exportApiRef = useRef<EditorModelViewerExportApi | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [designCode, setDesignCode] = useState<string | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  
  // Cart context
  const { addItem, getItemById, updateItemDesign } = useCart();
  
  // Edit mode - when editing an existing cart item
  const editItemId = searchParams.get('edit');
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Prevent body scroll on mobile (but allow sliders and interactive elements)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.top = '0';
      document.body.style.left = '0';
      const preventScroll = (e: TouchEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('input, button, [role="slider"]')) {
          return;
        }
        e.preventDefault();
      };
      document.body.addEventListener('touchmove', preventScroll, { passive: false });
      return () => {
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.removeEventListener('touchmove', preventScroll);
      };
    }
    return () => {};
  }, []);
  
  /** Dedupes dev Strict Mode double effect + identical re-runs (same ?code=). */
  const designLoadedFromUrlRef = useRef<string | null>(null);

  // Load cart item design when editing
  useEffect(() => {
    if (!editItemId) return;
    const cartItem = getItemById(editItemId);
    if (!cartItem) return;
    if (cartItem.customization) {
      if (cartItem.customization.graphics) {
        setGraphics(cartItem.customization.graphics as Partial<Record<'front' | 'back' | 'rightSleeve' | 'leftSleeve', GraphicItem>>);
      }
      if (cartItem.customization.texts) {
        setTexts(cartItem.customization.texts as Partial<Record<'front' | 'back', TextItem>>);
      }
      if (cartItem.color) {
        setProductColor(cartItem.color);
      }
      if (cartItem.size) {
        setSelectedSize(cartItem.size);
      }
      if (cartItem.customization.designCode) {
        setDesignCode(cartItem.customization.designCode);
      }
      setIsEditMode(true);
    }
  }, [editItemId, getItemById]);
  
  // Scroll lock when delete menu or text editor is open
  useEffect(() => {
    if (showDeleteMenu || showTextEditor) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [showDeleteMenu, showTextEditor]);
  
  const loadSavedDesign = async (code: string) => {
    try {
      const response = await fetch(`/api/designs?code=${code}`);
      const data = await response.json();
      
      if (data.success && data.design) {
        const designData = data.design.design_data;
        if (designData.graphics) {
          setGraphics(designData.graphics);
        }
        if (designData.texts) {
          setTexts(designData.texts);
        }
        if (designData.color) {
          setProductColor(designData.color);
        }
        if (designData.size) {
          setSelectedSize(designData.size);
        }
        setDesignCode(code);
        toast.success('Dizajn učitan!');
      }
    } catch (error) {
      console.error('Failed to load design:', error);
      toast.error('Greška pri učitavanju dizajna');
    }
  };

  useEffect(() => {
    if (!loadDesignCode) {
      designLoadedFromUrlRef.current = null;
      return;
    }
    if (designLoadedFromUrlRef.current === loadDesignCode) return;
    designLoadedFromUrlRef.current = loadDesignCode;
    void loadSavedDesign(loadDesignCode);
  }, [loadDesignCode]);

  // Handle image upload - saves to Supabase storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Molimo izaberite sliku');
      input.value = '';
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'graphics');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const newGraphic: GraphicItem = {
          id: Date.now().toString(),
          src: data.url,
          position: { x: 50, y: 50 },
          scale: 1,
          rotation: 0,
          area: selectedArea,
        };
        setGraphics(prev => ({ ...prev, [selectedArea]: newGraphic }));
        setPositioningMode('image');
      } else {
        console.warn('Upload failed, using local data URL:', data.error);
        const reader = new FileReader();
        reader.onload = (event) => {
          const newGraphic: GraphicItem = {
            id: Date.now().toString(),
            src: event.target?.result as string,
            position: { x: 50, y: 50 },
            scale: 1,
            rotation: 0,
            area: selectedArea,
          };
          setGraphics(prev => ({ ...prev, [selectedArea]: newGraphic }));
          setPositioningMode('image');
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Upload error:', error);
      const reader = new FileReader();
      reader.onload = (event) => {
        const newGraphic: GraphicItem = {
          id: Date.now().toString(),
          src: event.target?.result as string,
          position: { x: 50, y: 50 },
          scale: 1,
          rotation: 0,
          area: selectedArea,
        };
        setGraphics(prev => ({ ...prev, [selectedArea]: newGraphic }));
        setPositioningMode('image');
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
      input.value = '';
    }
  };

  // Update area when changed
  const handleAreaChange = (area: 'front' | 'back' | 'rightSleeve' | 'leftSleeve') => {
    setSelectedArea(area);
  };

  // Handle drag on grid
  const handleGridMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (positioningMode === 'image' && !currentGraphic) return;
    if (positioningMode === 'text' && !currentText) return;
    setIsDragging(true);
    updatePositionFromEvent(e);
  };

  const handleGridMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    if (positioningMode === 'image' && !currentGraphic) return;
    if (positioningMode === 'text' && !currentText) return;
    updatePositionFromEvent(e);
  };

  const handleGridMouseUp = () => {
    setIsDragging(false);
  };

  const updatePositionFromEvent = (e: React.MouseEvent | React.TouchEvent) => {
    if (!gridRef.current) return;
    
    const rect = gridRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    
    if (positioningMode === 'image' && currentGraphic) {
      setGraphics(prev => ({
        ...prev,
        [selectedArea]: { ...prev[selectedArea]!, position: { x, y } }
      }));
    } else if (positioningMode === 'text' && currentText) {
      setTexts(prev => ({
        ...prev,
        [selectedArea as 'front' | 'back']: { ...prev[selectedArea as 'front' | 'back']!, position: { x, y } }
      }));
    }
  };

  // Scale controls
  const increaseScale = () => {
    if (positioningMode === 'image') {
      if (!currentGraphic) return;
      setGraphics(prev => ({
        ...prev,
        [selectedArea]: {
          ...prev[selectedArea]!,
          scale: Math.min(7, prev[selectedArea]!.scale + 0.1),
        },
      }));
    } else if (positioningMode === 'text') {
      if (!areaSupportsText || !currentText) return;
      const newSize = Math.min(72, currentText.fontSize + 2);
      updateText({ fontSize: newSize });
    }
  };

  const decreaseScale = () => {
    if (positioningMode === 'image') {
      if (!currentGraphic) return;
      setGraphics(prev => ({
        ...prev,
        [selectedArea]: {
          ...prev[selectedArea]!,
          scale: Math.max(0.2, prev[selectedArea]!.scale - 0.1),
        },
      }));
    } else if (positioningMode === 'text') {
      if (!areaSupportsText || !currentText) return;
      const newSize = Math.max(8, currentText.fontSize - 2);
      updateText({ fontSize: newSize });
    }
  };

  // Show delete menu (instead of directly deleting)
  const handleDeleteClick = () => {
    const hasGraphic = !!currentGraphic;
    const hasText = !!currentText;
    
    if (hasGraphic && hasText) {
      setShowDeleteMenu(true);
    } else if (hasGraphic) {
      deleteGraphic();
    } else if (hasText) {
      deleteText();
    }
  };

  // Delete graphic for current area
  const deleteGraphic = () => {
    setGraphics(prev => {
      const newGraphics = { ...prev };
      delete newGraphics[selectedArea];
      return newGraphics;
    });
    setShowDeleteMenu(false);
    if (currentText) {
      setPositioningMode('text');
    }
    toast.success('Slika obrisana');
  };
  
  // Delete text for current area
  const deleteText = () => {
    if (!areaSupportsText) return;
    setTexts(prev => {
      const newTexts = { ...prev };
      delete newTexts[selectedArea as 'front' | 'back'];
      return newTexts;
    });
    setShowDeleteMenu(false);
    if (currentGraphic) {
      setPositioningMode('image');
    }
    toast.success('Tekst obrisan');
  };
  
  // Add new text
  const addText = () => {
    if (!areaSupportsText) return;
    
    const isBlackProduct = productColor.toLowerCase() === '#000000' || 
                           productColor.toLowerCase() === '#1a1a1a' ||
                           productColor.toLowerCase() === 'black';
    const defaultTextColor = isBlackProduct ? '#ffffff' : '#000000';
    
    const newText: TextItem = {
      id: Date.now().toString(),
      content: '',
      position: { x: 50, y: 50 },
      fontSize: 24,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fontStyle: 'normal',
      color: defaultTextColor,
      area: selectedArea as 'front' | 'back',
    };
    
    setTexts(prev => ({ ...prev, [selectedArea]: newText }));
    setEditingText(newText);
    setShowTextEditor(true);
    setPositioningMode('text');
  };
  
  // Update text properties
  const updateText = (updates: Partial<TextItem>) => {
    if (!areaSupportsText || !currentText) return;
    const updatedText = { ...currentText, ...updates };
    setTexts(prev => ({ ...prev, [selectedArea]: updatedText }));
    setEditingText(updatedText);
  };

  const uploadGeneratedImage = useCallback(async (dataUrl: string, fileName: string, maxSizeMB = 80) => {
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `${fileName}.png`, { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'graphics');
    formData.append('maxSizeMB', String(maxSizeMB));

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Upload failed');
    }

    return data.url as string;
  }, []);

  const buildDesignAssets = useCallback(async () => {
    const exportApi = exportApiRef.current;
    if (!exportApi) {
      return { previewUrl: null, previewImages: [], printZones: [] };
    }

    const [previewCaptures, printZoneCaptures] = await Promise.all([
      exportApi.exportPreviewImages(),
      exportApi.exportPrintZones(),
    ]);

    const uploadedPreviewImages = await Promise.all(
      previewCaptures.map(async (capture) => ({
        name: capture.name,
        url: await uploadGeneratedImage(capture.dataUrl, `preview-${capture.name}-${Date.now()}`, 20),
      }))
    );

    const uploadedPrintZones = await Promise.all(
      printZoneCaptures.map(async (zone) => ({
        name: zone.name,
        widthCm: zone.widthCm,
        heightCm: zone.heightCm,
        url: await uploadGeneratedImage(zone.dataUrl, `print-zone-${zone.name}-${Date.now()}`, 80),
      }))
    );

    const previewUrl = uploadedPreviewImages.find((image) => image.name === 'front')?.url
      || uploadedPreviewImages[0]?.url
      || null;

    return {
      previewUrl,
      previewImages: uploadedPreviewImages,
      printZones: uploadedPrintZones,
    };
  }, [uploadGeneratedImage]);

  // Go to checkout
  const goToCheckout = async () => {
    if (!selectedSize) {
      toast.error('Veličina je obavezna.');
      return;
    }

    setSaving(true);
    try {
      const assets = await buildDesignAssets();

      const designData = {
        graphics,
        texts,
        color: productColor,
        modelPath: MODEL_PATH,
        selectedArea,
        size: selectedSize,
        previewImages: assets.previewImages,
        printZones: assets.printZones,
      };

      const response = await fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: currentProductId || null,
          modelPath: MODEL_PATH,
          productName: currentProductName,
          designData,
          previewUrl: assets.previewUrl,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        const allGraphicImages = Object.values(graphics)
          .filter((g): g is GraphicItem => g !== undefined && g !== null)
          .map(g => g.src);
        
        const customization = {
          image: assets.previewUrl || allGraphicImages[0],
          previewImage: assets.previewUrl || allGraphicImages[0],
          allImages: allGraphicImages,
          designCode: data.code,
          graphics: graphics,
          texts: texts,
          previewImages: assets.previewImages,
          printZones: assets.printZones,
          productType: '3d' as const,
          modelPath: MODEL_PATH,
        };
        
        if ((isEditMode || editItemId) && editItemId) {
          updateItemDesign(editItemId, productColor, customization, selectedSize);
          toast.success('Dizajn ažuriran!');
        } else {
          addItem(
            {
              productId: String(currentProductId || 'custom'),
              productName: currentProductName || 'Majica',
              productImage: '/placeholder.jpg',
              productSlug: 'majica',
              color: productColor,
              size: selectedSize,
              quantity: 1,
              unitPrice: currentProductPrice,
              isPersonalized: true,
              modelPath: MODEL_PATH,
              customization,
            },
            { openCart: false }
          );
          toast.success('Proizvod dodan u korpu!');
        }
        
        router.push('/checkout');
      } else {
        toast.error('Greška pri spremanju dizajna');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Greška pri procesuiranju');
    } finally {
      setSaving(false);
    }
  };

  // Handle export ready callback
  const handleExportReady = useCallback((exportApi: EditorModelViewerExportApi) => {
    exportApiRef.current = exportApi;
  }, []);

  // Save model design
  const handleSave = async () => {
    setSaving(true);
    try {
      const assets = await buildDesignAssets();
      const designData = {
        graphics,
        texts,
        color: productColor,
        modelPath: MODEL_PATH,
        selectedArea,
        size: selectedSize || undefined,
        previewImages: assets.previewImages,
        printZones: assets.printZones,
      };

      if (designCode) {
        const response = await fetch('/api/designs', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: designCode,
            designData,
            previewUrl: assets.previewUrl,
          }),
        });
        
        const data = await response.json();
        if (data.success) {
          toast.success('Dizajn ažuriran!');
          setShowCodeModal(true);
        } else {
          toast.error('Greška pri ažuriranju dizajna');
        }
      } else {
        const response = await fetch('/api/designs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: currentProductId || null,
            modelPath: MODEL_PATH,
            productName: currentProductName,
            designData,
            previewUrl: assets.previewUrl,
          }),
        });
        
        const data = await response.json();
        if (data.success && data.code) {
          setDesignCode(data.code);
          setShowCodeModal(true);
          toast.success('Dizajn sačuvan!');
        } else {
          toast.error('Greška pri spremanju dizajna');
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Greška pri spremanju');
    } finally {
      setSaving(false);
    }
  };
  
  // Copy design code to clipboard
  const copyCodeToClipboard = () => {
    if (designCode) {
      navigator.clipboard.writeText(designCode);
      toast.success('Kod kopiran!');
    }
  };

  return (
    <div className="h-[100dvh] md:h-[calc(100vh-5rem)] bg-[#0a0a0f] flex flex-col lg:flex-row overflow-hidden">
      {/* 3D Preview - Top on mobile, right side on desktop */}
      <div className="flex-1 relative order-1 lg:order-2 min-h-0">
        <EditorModelViewer
          ref={viewerRef}
          modelPath={MODEL_PATH}
          color={productColor}
          zoom={editorZoom}
          autoRotate={false}
          interactive={false}
          dragToRotate={true}
          showShadow={false}
          className="w-full h-full"
          onExportReady={handleExportReady}
          targetRotation={targetRotation}
          decals={Object.values(graphics).filter(Boolean).map(g => ({
            texture: g!.src,
            position: g!.position,
            scale: g!.scale,
            rotation: g!.rotation,
            area: g!.area,
          }))}
          texts={Object.values(texts).filter(Boolean).map(t => ({
            id: t!.id,
            content: t!.content,
            position: t!.position,
            fontSize: t!.fontSize,
            fontFamily: t!.fontFamily,
            fontWeight: t!.fontWeight,
            fontStyle: t!.fontStyle,
            color: t!.color,
            area: t!.area,
          }))}
        />
        
        {/* Top bar with product name */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-white font-semibold bg-black/30 backdrop-blur-sm px-4 py-2 rounded">
              {currentProductName}
              {designCode && (
                <span className="ml-2 text-xs text-orange-300">({designCode})</span>
              )}
            </h1>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={`p-2 rounded transition-colors ${
                showColorPicker 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-black/30 backdrop-blur-sm text-white hover:bg-black/50'
              }`}
              title="Boja proizvoda"
            >
              <Palette className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="bg-white/10 hover:bg-white/15 text-white rounded disabled:opacity-50 border border-white/10"
              title="Sačuvaj dizajn"
            >
              <Save className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{saving ? 'Čuvam...' : 'Sačuvaj'}</span>
            </Button>
            <Button 
              onClick={goToCheckout}
              disabled={saving}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{saving ? 'Čekajte...' : (isEditMode || editItemId) ? 'Ažuriraj' : 'Naruči'}</span>
            </Button>
          </div>
        </div>

        {/* Color picker overlay */}
        {showColorPicker && (
          <div className="absolute bottom-4 left-4 right-4 lg:bottom-8 lg:left-8 lg:right-auto bg-black/80 backdrop-blur-lg rounded-2xl p-4 z-20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">Boja proizvoda</span>
              <button 
                onClick={() => setShowColorPicker(false)}
                className="text-white/60 hover:text-white"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    setProductColor(color.value);
                    setShowColorPicker(false);
                  }}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    productColor === color.value
                      ? 'border-orange-500 ring-2 ring-orange-500/50 scale-110'
                      : 'border-white/20 hover:border-white/50'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Position Graphics Panel - Bottom on mobile, left on desktop */}
      <div className="order-2 lg:order-1 bg-[#111118] flex-1 lg:flex-none lg:w-[350px] flex flex-col min-h-0 max-h-[50%] lg:max-h-full lg:h-full overflow-hidden">
        {/* Print area selector */}
        <div className="px-3 py-2 border-b border-white/10">
          <span className="text-gray-400 text-xs mb-1 block">Zona za print:</span>
          <div className="flex gap-1 items-center">
            {shirtPrintAreas.map((area) => (
              <button
                key={area.id}
                onClick={() => handleAreaChange(area.id as any)}
                className={`flex-1 py-1.5 px-2 rounded text-[11px] font-medium transition-colors ${
                  selectedArea === area.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/15'
                }`}
              >
                <span>{area.name}</span>
              </button>
            ))}
            {(currentGraphic || currentText) && (
              <button
                onClick={handleDeleteClick}
                className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex-shrink-0"
                title="Obriši"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Grid canvas - flexible height */}
        <div className="flex-1 p-3 min-h-0">
          {/* Mode toggle when both image and text exist */}
          {currentGraphic && currentText && (
            <div className="flex gap-1 mb-2">
              <button
                onClick={() => setPositioningMode('image')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  positioningMode === 'image'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/15'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Uređivanje slike</span>
              </button>
              <button
                onClick={() => setPositioningMode('text')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  positioningMode === 'text'
                    ? 'bg-fuchsia-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/15'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Uređivanje teksta</span>
              </button>
            </div>
          )}
          
          <div
            ref={gridRef}
            className={`relative w-full ${currentGraphic && currentText ? 'h-[calc(100%-2.5rem)]' : 'h-full'} bg-white/5 rounded-xl overflow-hidden cursor-crosshair select-none`}
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
            onMouseDown={handleGridMouseDown}
            onMouseMove={handleGridMouseMove}
            onMouseUp={handleGridMouseUp}
            onMouseLeave={handleGridMouseUp}
            onTouchStart={handleGridMouseDown}
            onTouchMove={handleGridMouseMove}
            onTouchEnd={handleGridMouseUp}
          >
            {/* Image position indicator (crosshair) on grid */}
            {currentGraphic && (
              <div
                className={`absolute pointer-events-none transition-opacity ${positioningMode === 'image' ? 'opacity-100' : 'opacity-40'}`}
                style={{
                  left: `${currentGraphic.position.x}%`,
                  top: `${currentGraphic.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="relative w-8 h-8">
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-orange-500 -translate-x-1/2" />
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-orange-500 -translate-y-1/2" />
                  <div className="absolute left-1/2 top-1/2 w-3 h-3 border-2 border-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2 bg-orange-500/30" />
                </div>
              </div>
            )}
            
            {/* Text position indicator on grid */}
            {currentText && (
              <div
                className={`absolute pointer-events-none transition-opacity ${positioningMode === 'text' ? 'opacity-100' : 'opacity-40'}`}
                style={{
                  left: `${currentText.position.x}%`,
                  top: `${currentText.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="relative w-8 h-8">
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-fuchsia-500 -translate-x-1/2" />
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-fuchsia-500 -translate-y-1/2" />
                  <div className="absolute left-1/2 top-1/2 w-5 h-5 border-2 border-fuchsia-500 rounded -translate-x-1/2 -translate-y-1/2 bg-fuchsia-500/30 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-fuchsia-200">T</span>
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!currentGraphic && !currentText && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500 text-xs text-center px-4">
                  Dodaj sliku ili tekst da započneš dizajniranje
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Controls - always visible */}
        <div className="p-3 space-y-3 border-t border-white/10">
          {/* Add Photo and Text buttons */}
          <div className="flex gap-2 min-w-0">
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              title="Veličina (obavezno)"
              className="w-full min-w-0 shrink basis-0 flex-1 py-2.5 pl-3 pr-10 bg-white/10 border border-white/10 rounded text-white text-sm appearance-none cursor-pointer focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
              style={{
                backgroundImage: SIZE_SELECT_CHEVRON_BG,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.65rem center',
                backgroundSize: '1rem 1rem',
              }}
            >
              <option value="">Veličina*</option>
              {GARMENT_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="min-w-0 shrink basis-0 flex-1 py-2.5 px-2 sm:px-3 bg-orange-500 hover:bg-orange-600 text-white rounded font-medium flex items-center justify-center gap-1.5 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Učitavanje...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" />
                  <span>Slika</span>
                </>
              )}
            </button>
            {/* Add Text button - only show for front/back areas */}
            {areaSupportsText && (
              <button
                onClick={() => {
                  if (currentText) {
                    setEditingText(currentText);
                    setShowTextEditor(true);
                  } else {
                    addText();
                  }
                }}
                className="min-w-0 shrink basis-0 flex-1 py-2.5 px-2 sm:px-3 bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-300 hover:text-white rounded font-medium flex items-center justify-center gap-1.5 transition-colors text-sm border border-fuchsia-500/30"
              >
                <Type className="w-4 h-4 shrink-0" />
                <span className="truncate">{currentText ? 'Uredi tekst' : 'Tekst'}</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />

          {/* Scale slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Veličina</span>
              <span className="text-xs font-mono text-white">
                {positioningMode === 'image'
                  ? currentGraphic
                    ? `${currentGraphic.scale.toFixed(1)}x`
                    : '1.0x'
                  : currentText
                    ? `${currentText.fontSize}pt`
                    : '24pt'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={decreaseScale}
                disabled={
                  (positioningMode === 'image' && !currentGraphic) ||
                  (positioningMode === 'text' && !currentText)
                }
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="range"
                min={positioningMode === 'image' ? '0.2' : '12'}
                max={positioningMode === 'image' ? '7' : '72'}
                step={positioningMode === 'image' ? '0.1' : '2'}
                value={
                  positioningMode === 'image'
                    ? currentGraphic?.scale || 1
                    : currentText?.fontSize || 24
                }
                onChange={(e) => {
                  if (positioningMode === 'image') {
                    const newScale = parseFloat(e.target.value);
                    if (currentGraphic) {
                      setGraphics(prev => ({
                        ...prev,
                        [selectedArea]: { ...prev[selectedArea]!, scale: newScale },
                      }));
                    }
                  } else if (positioningMode === 'text') {
                    const newSize = parseInt(e.target.value, 10);
                    if (areaSupportsText && currentText) {
                      updateText({ fontSize: newSize });
                    }
                  }
                }}
                disabled={
                  (positioningMode === 'image' && !currentGraphic) ||
                  (positioningMode === 'text' && !currentText)
                }
                className="flex-1 h-2 bg-white/10 rounded-full cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-orange-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
              />
              <button
                onClick={increaseScale}
                disabled={
                  (positioningMode === 'image' && !currentGraphic) ||
                  (positioningMode === 'text' && !currentText)
                }
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Design Code Modal */}
      {showCodeModal && designCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111118] rounded-2xl p-6 max-w-md w-full mx-4 border border-orange-500/20"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dizajn sačuvan!</h3>
              <p className="text-gray-400 mb-6">
                Koristite ovaj kod da nastavite uređivanje dizajna kasnije:
              </p>
              
              <div className="bg-[#0a0a0f] rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-2xl font-mono font-bold text-orange-400 tracking-wider">
                    {designCode}
                  </span>
                  <button
                    onClick={copyCodeToClipboard}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors"
                    title="Kopiraj kod"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-6">
                Kod vrijedi 30 dana. Posjetite editor sa kodom: <br />
                <code className="text-orange-400">/editor?code={designCode}</code>
              </p>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowCodeModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/15 text-white"
                >
                  Nastavi uređivanje
                </Button>
                <Button
                  onClick={() => {
                    setShowCodeModal(false);
                    goToCheckout();
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {(isEditMode || editItemId) ? 'Ažuriraj' : 'Naruči'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Delete Menu Modal */}
      <AnimatePresence>
        {showDeleteMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteMenu(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#111118] rounded-2xl p-6 max-w-sm w-full mx-4 border border-orange-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Šta želite obrisati?</h3>
                <p className="text-gray-400 mb-6">
                  Izaberite šta želite ukloniti sa ove strane
                </p>
                
                <div className="flex flex-col gap-3">
                  {currentGraphic && (
                    <button
                      onClick={deleteGraphic}
                      className="w-full py-3 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <ImageIcon className="w-5 h-5" />
                      Obriši sliku
                    </button>
                  )}
                  {currentText && (
                    <button
                      onClick={deleteText}
                      className="w-full py-3 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Type className="w-5 h-5" />
                      Obriši tekst
                    </button>
                  )}
                  <button
                    onClick={() => setShowDeleteMenu(false)}
                    className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-colors"
                  >
                    Odustani
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Text Editor Modal */}
      <AnimatePresence>
        {showTextEditor && editingText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            style={{
              height: keyboardHeight > 0 ? `${viewportHeight}px` : '100%',
            }}
            onClick={() => setShowTextEditor(false)}
          >
            <div className="w-full h-full flex items-end sm:items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="bg-[#111118] rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 w-full sm:max-w-md sm:mx-4 border-t sm:border border-orange-500/20 overflow-y-auto modal-scroll-content"
                style={{
                  maxHeight: `${viewportHeight - 16}px`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Uredi tekst</h3>
                <button
                  onClick={() => setShowTextEditor(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Text input */}
              <div className="mb-3">
                <textarea
                  value={editingText.content}
                  onChange={(e) => updateText({ content: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none overflow-hidden"
                  placeholder="Unesite tekst..."
                  rows={1}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
              </div>
              
              {/* Font family + B/I/Color in one row */}
              <div className="mb-3 flex items-center gap-2">
                <select
                  value={editingText.fontFamily}
                  onChange={(e) => updateText({ fontFamily: e.target.value })}
                  className="flex-1 min-w-0 px-2 pr-8 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
                >
                  {fontFamilies.map((font) => (
                    <option key={font.value} value={font.value}>{font.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => updateText({ fontWeight: editingText.fontWeight === 'bold' ? 'normal' : 'bold' })}
                  className={`p-2.5 rounded-lg transition-colors flex-shrink-0 ${
                    editingText.fontWeight === 'bold'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/15'
                  }`}
                  title="Bold"
                >
                  <Bold className="w-5 h-5" />
                </button>
                <button
                  onClick={() => updateText({ fontStyle: editingText.fontStyle === 'italic' ? 'normal' : 'italic' })}
                  className={`p-2.5 rounded-lg transition-colors flex-shrink-0 ${
                    editingText.fontStyle === 'italic'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/15'
                  }`}
                  title="Italic"
                >
                  <Italic className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowTextColorPicker(prev => !prev)}
                  className={`p-2.5 rounded-lg transition-colors flex-shrink-0 relative ${
                    showTextColorPicker
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/15'
                  }`}
                  title="Boja teksta"
                >
                  <Palette className="w-5 h-5" />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-gray-800"
                    style={{ backgroundColor: editingText.color }}
                  />
                </button>
              </div>

              {/* Color palette (collapsible) */}
              <AnimatePresence>
                {showTextColorPicker && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mb-3"
                  >
                    <div className="grid grid-cols-6 gap-1.5 p-2 bg-[#0a0a0f] rounded-lg border border-white/10">
                      {textColors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => {
                            updateText({ color: color.value });
                            setShowTextColorPicker(false);
                          }}
                          className={`w-full aspect-square rounded-lg border-2 transition-all ${
                            editingText.color === color.value
                              ? 'border-orange-500 ring-1 ring-orange-500/50 scale-110'
                              : 'border-white/10 hover:border-gray-500'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Font size */}
              <div className="mb-3">
                <label className="text-xs text-gray-400 block mb-1">Veličina: {editingText.fontSize}pt</label>
                <input
                  type="range"
                  min="8"
                  max="72"
                  step="2"
                  value={editingText.fontSize}
                  onChange={(e) => updateText({ fontSize: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>
              
              {/* Preview */}
              <div 
                className={`mb-4 p-4 rounded-xl border ${
                  editingText.color === '#000000' 
                    ? 'bg-white border-gray-300' 
                    : 'bg-[#0a0a0f] border-white/10'
                }`}
              >
                <p className={`text-xs mb-2 ${editingText.color === '#000000' ? 'text-gray-600' : 'text-gray-500'}`}>Pregled:</p>
                <p
                  style={{
                    fontFamily: editingText.fontFamily,
                    fontSize: `${Math.min(editingText.fontSize, 32)}pt`,
                    fontWeight: editingText.fontWeight,
                    fontStyle: editingText.fontStyle,
                    color: editingText.color,
                    whiteSpace: 'pre-wrap',
                  }}
                  className="break-words"
                >
                  {editingText.content || 'Vaš tekst'}
                </p>
              </div>
              
              {/* Done button */}
              <button
                onClick={() => setShowTextEditor(false)}
                className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
              >
                Gotovo
              </button>
            </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
