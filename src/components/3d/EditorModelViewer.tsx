'use client';

import React, { Suspense, useRef, useState, useEffect, useMemo, useCallback, forwardRef, useImperativeHandle, useReducer, Component, ErrorInfo, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Html, Center } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { Loader2 } from 'lucide-react';
import { EDITOR_TEXTURE_PREVIEW_SIZE, EMBED_TEXTURE_PREVIEW_SIZE } from '@/components/3d/editor-model-constants';

export { EDITOR_TEXTURE_PREVIEW_SIZE, EMBED_TEXTURE_PREVIEW_SIZE };

// Error boundary for catching 3D loading errors
interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onError?: () => void;
}

class ModelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('3D Model loading error:', error.message);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface DecalConfig {
  texture: string | null;
  position: { x: number; y: number }; // 0-100 grid position
  scale: number;
  rotation: number;
  area?: 'front' | 'back' | 'rightSleeve' | 'leftSleeve';
}

interface TextConfig {
  id: string;
  content: string;
  position: { x: number; y: number }; // 0-100 grid position
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  color: string;
  area: 'front' | 'back';
}

interface ModelWithDecalProps {
  modelPath: string;
  color?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  dragRotate?: boolean;
  rotationRef?: React.MutableRefObject<{ x: number; y: number }>;
  targetRotation?: { x: number; y: number };
  initialRotation?: { x: number; y: number };
  decals?: DecalConfig[];
  texts?: TextConfig[];
  onSceneReady?: (scene: THREE.Object3D) => void;
  onTextureCanvasReady?: (canvas: HTMLCanvasElement | null) => void;
  texturePreviewSize?: number;
}

// Export handle type for external use
export interface EditorModelViewerExportApi {
  exportGLTF: () => void;
  exportPreviewImages: () => Promise<Array<{ name: string; dataUrl: string }>>;
  exportPrintZones: () => Promise<Array<{ name: string; dataUrl: string; widthCm: number; heightCm: number }>>;
}

export interface EditorModelViewerHandle extends EditorModelViewerExportApi {}

// UV bounding boxes for print areas (uMin, vMin, uMax, vMax) in 0-1 UV space
// Different models have different UV layouts
const MODEL_UV_PRINT_AREAS: Record<string, Record<string, { uMin: number; vMin: number; uMax: number; vMax: number }>> = {
  '/shirt/scene.gltf': {
    'front':       { uMin: 0.1804, vMin: 0.5036, uMax: 0.4663, vMax: 0.8460 },
    'back':        { uMin: 0.6499, vMin: 0.4786, uMax: 0.9318, vMax: 0.8380 },
    'rightSleeve': { uMin: 0.7334, vMin: 0.2417, uMax: 0.8820, vMax: 0.3640 },
    'leftSleeve':  { uMin: 0.1466, vMin: 0.2134, uMax: 0.2915, vMax: 0.3403 },
  },
  '/badge/scene.gltf': {
    // Front face is in the top half of UV space (V: 0.5 to 1.0)
    'front':       { uMin: 0.05, vMin: 0.52, uMax: 0.95, vMax: 0.97 },
  },
  '/cup/scene.gltf': {
    'front':       { uMin: 0.375, vMin: 0.32103097438812256, uMax: 0.625, vMax: 0.6652200222015381 },
  },
  '/lighter/scene.gltf': {
    'front':       { uMin: 0.0036730000283569098, vMin: 0.25281697511672974, uMax: 0.9981309771537781, vMax: 0.9391890168190002 },
  },
  '/cap/scene.gltf': {
    'front':       { uMin: 0.10974899679422379, vMin: 0.0064550042152404785, uMax: 0.8119750022888184, vMax: 0.8898209929466248 },
  },
  '/pen/scene.gltf': {
    'front':       { uMin: 0.10543300211429596, vMin: 0.05636197328567505, uMax: 0.3930619955062866, vMax: 0.8954920172691345 },
  },
  '/bag/scene.gltf': {
    'front':       { uMin: 0.3649, vMin: 0.6563, uMax: 0.6323, vMax: 0.9684 },
    'back':        { uMin: 0.0381, vMin: 0.6552, uMax: 0.3055, vMax: 0.9673 },
  },
  '/hoodie/scene.gltf': {
    'front':       { uMin: 0.1951, vMin: 0.6065, uMax: 0.3583, vMax: 0.7717 },
    'back':        { uMin: 0.5662, vMin: 0.5974, uMax: 0.7790, vMax: 0.8134 },
    'leftSleeve':  { uMin: 0.3875, vMin: 0.1365, uMax: 0.4695, vMax: 0.1904 },
    'rightSleeve': { uMin: 0.5134, vMin: 0.1265, uMax: 0.5902, vMax: 0.1809 },
  },
};

// Default fallback for models without specific UV mapping
const DEFAULT_UV_PRINT_AREA = { uMin: 0.1, vMin: 0.1, uMax: 0.9, vMax: 0.9 };

// Per-model per-area flip overrides for UV orientation.
// Default behaviour (when not listed here) is { flipX: false, flipY: true } — vertical flip only.
// Set flipX / flipY to control how the decal/text is drawn in each print area.
const MODEL_UV_FLIP: Record<string, Record<string, { flipX: boolean; flipY: boolean }>> = {
  '/bag/scene.gltf': {
    'front': { flipX: true, flipY: false }, // Bag front UV is horizontally mirrored
  },
};

const DEFAULT_FLIP = { flipX: false, flipY: true };

// Per-model per-area extra rotation (in radians) applied when drawing decals/text.
// Use this when a UV island is oriented differently from the model surface (e.g. sleeves).
const MODEL_UV_EXTRA_ROTATION: Record<string, Record<string, number>> = {
  '/hoodie/scene.gltf': {
    'leftSleeve':  Math.PI / 2,  // 90° to align with sleeve direction
    'rightSleeve': -Math.PI / 2,
  },
};

// Per-model per-area position remapping to correct drag direction when UV is rotated.
// swapXY: swap x/y axes, invertX/invertY: invert after swap.
interface PositionRemap { swapXY: boolean; invertX: boolean; invertY: boolean }
const MODEL_UV_POSITION_REMAP: Record<string, Record<string, PositionRemap>> = {
  '/hoodie/scene.gltf': {
    'leftSleeve':  { swapXY: true, invertX: true, invertY: false },
    'rightSleeve': { swapXY: true, invertX: false, invertY: true },
  },
};

// Models where the non-print area should have a different color than the base color
// backgroundColor is the color for the rest of the model, baseColor goes to print area
const MODEL_BACKGROUND_COLORS: Record<string, string> = {
  '/lighter/scene.gltf': '#808080', // Gray for the body, black for the print area
};

const PRINT_ZONE_DIMENSIONS_CM: Record<string, { widthCm: number; heightCm: number }> = {
  front: { widthCm: 40, heightCm: 40 },
  back: { widthCm: 40, heightCm: 40 },
  leftSleeve: { widthCm: 5, heightCm: 10 },
  rightSleeve: { widthCm: 5, heightCm: 10 },
};

const PREVIEW_CAPTURE_ROTATIONS: Record<string, { x: number; y: number }> = {
  front: { x: 0.08, y: -0.35 },
  back: { x: 0.08, y: Math.PI + 0.35 },
  leftSleeve: { x: 0.12, y: Math.PI / 2 - 0.28 },
  rightSleeve: { x: 0.12, y: -Math.PI / 2 + 0.28 },
};

/** Multiplier for WebGL buffer size when exporting preview PNGs (A4 sheet / storage). */
const PREVIEW_EXPORT_PIXEL_SCALE = 2.5

const PRINT_EXPORT_DPI = 300;

/** Offscreen atlas for print-zone export — keep higher so crop → 300 DPI stays sharp. */
const PRINT_ATLAS_SOURCE_SIZE = 2048;

// Creates a canvas texture with multiple decals and texts baked at correct UV positions
function useDecalTexture(
  decals: DecalConfig[] | undefined,
  texts: TextConfig[] | undefined,
  baseColor: string,
  modelPath: string,
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void,
  texturePreviewSize: number = EDITOR_TEXTURE_PREVIEW_SIZE,
): THREE.CanvasTexture | null {
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const [imagesLoaded, setImagesLoaded] = useState(0);
  /** Refs set in an effect do not re-render; bump so we return the CanvasTexture from the hook on the next render (otherwise map stays null until e.g. orbit drag). */
  const [, commitTextureToReact] = useReducer((n: number) => n + 1, 0);
  const invalidate = useThree((s) => s.invalidate);
  // Parent often passes an inline callback; must not be an effect dep — it would re-run every
  // render, reset canvas dimensions (clearing pixels) without re-triggering the draw effect → black model.
  const onCanvasReadyRef = useRef(onCanvasReady);
  onCanvasReadyRef.current = onCanvasReady;

  // Create / resize canvas and texture (only when preview size changes)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    canvasRef.current.width = texturePreviewSize;
    canvasRef.current.height = texturePreviewSize;
    if (!textureRef.current) {
      textureRef.current = new THREE.CanvasTexture(canvasRef.current);
      textureRef.current.flipY = false;
      textureRef.current.colorSpace = THREE.SRGBColorSpace;
      onCanvasReadyRef.current?.(canvasRef.current);
      commitTextureToReact();
    } else {
      textureRef.current.needsUpdate = true;
    }
  }, [texturePreviewSize]);

  // Load images for all decals
  useEffect(() => {
    // If no decals, just clear and return
    if (!decals || decals.length === 0) {
      imagesRef.current.clear();
      // Trigger a re-render + draw pass when only text (or no images) — prev===0 noop was a bug
      setImagesLoaded(Date.now());
      return;
    }

    // Load each unique texture
    const texturesToLoad = decals
      .filter(d => d.texture)
      .map(d => ({ area: d.area || 'front', texture: d.texture! }));

    let loadedCount = 0;
    
    texturesToLoad.forEach(({ area, texture }) => {
      // Skip if already loaded with same URL
      const existingImg = imagesRef.current.get(area);
      if (existingImg && existingImg.src === texture) {
        loadedCount++;
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imagesRef.current.set(area, img);
        // Use a unique timestamp to force re-render
        setImagesLoaded(Date.now());
      };
      img.src = texture;
    });

    // Remove images for areas that no longer have decals
    const activeAreas = new Set(texturesToLoad.map(t => t.area));
    imagesRef.current.forEach((_, area) => {
      if (!activeAreas.has(area as any)) {
        imagesRef.current.delete(area);
      }
    });
  }, [decals]);

  // Create stable dependency string for decal positions/properties
  const decalsDeps = useMemo(() => {
    if (!decals) return '';
    return decals.map(d => 
      `${d.area}:${d.texture}:${d.position.x}:${d.position.y}:${d.scale}:${d.rotation}`
    ).join('|');
  }, [decals]);

  // Create stable dependency string for text properties
  const textsDeps = useMemo(() => {
    if (!texts) return '';
    return texts.map(t => 
      `${t.area}:${t.content}:${t.position.x}:${t.position.y}:${t.fontSize}:${t.fontFamily}:${t.fontWeight}:${t.fontStyle}:${t.color}`
    ).join('|');
  }, [texts]);

  // Draw to canvas whenever anything changes
  useEffect(() => {
    if (!canvasRef.current || !textureRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check if this model has a different background color
    const backgroundOverride = MODEL_BACKGROUND_COLORS[modelPath];
    
    // Clear and fill with background color (or base color if no override)
    ctx.fillStyle = backgroundOverride || baseColor;
    ctx.fillRect(0, 0, texturePreviewSize, texturePreviewSize);
    
    // If model has background override, fill the print area with base color
    if (backgroundOverride) {
      const modelAreas = MODEL_UV_PRINT_AREAS[modelPath];
      if (modelAreas) {
        Object.values(modelAreas).forEach(area => {
          const pixelLeft = area.uMin * texturePreviewSize;
          const pixelTop = (1 - area.vMax) * texturePreviewSize;
          const pixelWidth = (area.uMax - area.uMin) * texturePreviewSize;
          const pixelHeight = (area.vMax - area.vMin) * texturePreviewSize;
          ctx.fillStyle = baseColor;
          ctx.fillRect(pixelLeft, pixelTop, pixelWidth, pixelHeight);
        });
      }
    }

    // Draw all decals
    if (decals) {
      decals.forEach(decal => {
        const area = decal.area || 'front';
        const img = imagesRef.current.get(area);
        if (img && decal.texture) {
          drawDecalToCanvas(ctx, img, decal, modelPath);
        }
      });
    }

    // Draw all texts
    if (texts) {
      texts.forEach(text => {
        drawTextToCanvas(ctx, text, modelPath);
      });
    }

    textureRef.current.needsUpdate = true;
    invalidate();
  }, [decalsDeps, textsDeps, baseColor, imagesLoaded, modelPath, texturePreviewSize, invalidate]);

  return textureRef.current;
}

// Draw the decal image onto the canvas at the correct UV position
function drawDecalToCanvas(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  decal: DecalConfig,
  modelPath: string
) {
  const canvas = ctx.canvas;

  // Get the UV bounds for the selected area based on model
  const modelAreas = MODEL_UV_PRINT_AREAS[modelPath] || MODEL_UV_PRINT_AREAS['/shirt/scene.gltf'];
  const area = modelAreas[decal.area || 'front'] || DEFAULT_UV_PRINT_AREA;
  
  // Convert UV bounds to pixel coordinates
  const uvWidth = area.uMax - area.uMin;
  const uvHeight = area.vMax - area.vMin;
  
  const pixelLeft = area.uMin * canvas.width;
  const pixelTop = (1 - area.vMax) * canvas.height; // Flip V for canvas (0,0 is top-left)
  const pixelWidth = uvWidth * canvas.width;
  const pixelHeight = uvHeight * canvas.height;

  // Determine flip behaviour for this model + area
  const areaKey = decal.area || 'front';
  const flip = MODEL_UV_FLIP[modelPath]?.[areaKey] ?? DEFAULT_FLIP;

  // Remap position for rotated UV areas (e.g. sleeves)
  const remap = MODEL_UV_POSITION_REMAP[modelPath]?.[areaKey];
  let posX = decal.position.x;
  let posY = decal.position.y;
  if (remap) {
    const origX = posX, origY = posY;
    if (remap.swapXY) { posX = origY; posY = origX; }
    if (remap.invertX) posX = 100 - posX;
    if (remap.invertY) posY = 100 - posY;
  }

  // Map the 0-100 grid position to position within the print area
  const normalizedX = flip.flipX
    ? 1 - (posX / 100)    // Mirror X
    : posX / 100;
  const normalizedY = flip.flipY
    ? 1 - (posY / 100)    // Mirror Y (default for most models)
    : posY / 100;

  // Calculate decal size based on scale (base size is 40% of print area)
  const baseDecalSize = Math.min(pixelWidth, pixelHeight) * 0.4;
  const decalSize = baseDecalSize * decal.scale;

  // Calculate decal center position within the print area
  const decalCenterX = pixelLeft + normalizedX * pixelWidth;
  const decalCenterY = pixelTop + normalizedY * pixelHeight;

  // Save context and create clipping region to constrain decal within print area
  ctx.save();
  ctx.beginPath();
  ctx.rect(pixelLeft, pixelTop, pixelWidth, pixelHeight);
  ctx.clip();

  ctx.translate(decalCenterX, decalCenterY);
  const scaleX = flip.flipX ? -1 : 1;
  const scaleY = flip.flipY ? -1 : 1;
  ctx.scale(scaleX, scaleY);
  const extraRotation = MODEL_UV_EXTRA_ROTATION[modelPath]?.[areaKey] ?? 0;
  ctx.rotate(-(decal.rotation * Math.PI) / 180 + extraRotation);
  
  // Maintain aspect ratio
  const aspectRatio = img.width / img.height;
  let drawWidth = decalSize;
  let drawHeight = decalSize;
  if (aspectRatio > 1) {
    drawHeight = decalSize / aspectRatio;
  } else {
    drawWidth = decalSize * aspectRatio;
  }
  
  ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  ctx.restore();
}

// Draw text onto the canvas at the correct UV position
function drawTextToCanvas(
  ctx: CanvasRenderingContext2D,
  text: TextConfig,
  modelPath: string
) {
  const canvas = ctx.canvas;

  // Get the UV bounds for the selected area based on model
  const modelAreas = MODEL_UV_PRINT_AREAS[modelPath] || MODEL_UV_PRINT_AREAS['/shirt/scene.gltf'];
  const area = modelAreas[text.area] || DEFAULT_UV_PRINT_AREA;
  
  // Convert UV bounds to pixel coordinates
  const uvWidth = area.uMax - area.uMin;
  const uvHeight = area.vMax - area.vMin;
  
  const pixelLeft = area.uMin * canvas.width;
  const pixelTop = (1 - area.vMax) * canvas.height;
  const pixelWidth = uvWidth * canvas.width;
  const pixelHeight = uvHeight * canvas.height;

  // Determine flip behaviour for this model + area
  const flip = MODEL_UV_FLIP[modelPath]?.[text.area] ?? DEFAULT_FLIP;

  // Remap position for rotated UV areas (e.g. sleeves)
  const remap = MODEL_UV_POSITION_REMAP[modelPath]?.[text.area];
  let posX = text.position.x;
  let posY = text.position.y;
  if (remap) {
    const origX = posX, origY = posY;
    if (remap.swapXY) { posX = origY; posY = origX; }
    if (remap.invertX) posX = 100 - posX;
    if (remap.invertY) posY = 100 - posY;
  }

  // Map the 0-100 grid position to position within the print area
  const normalizedX = flip.flipX
    ? 1 - (posX / 100)
    : posX / 100;
  const normalizedY = flip.flipY
    ? 1 - (posY / 100)
    : posY / 100;

  // Calculate text center position within the print area
  const textCenterX = pixelLeft + normalizedX * pixelWidth;
  const textCenterY = pixelTop + normalizedY * pixelHeight;

  // Scale font size relative to canvas/print area
  // Base font size is relative to the print area height
  const scaledFontSize = (text.fontSize / 100) * pixelHeight * 0.8;

  // Build font string
  const fontWeight = text.fontWeight === 'bold' ? 'bold' : 'normal';
  const fontStyle = text.fontStyle === 'italic' ? 'italic' : 'normal';
  const fontString = `${fontStyle} ${fontWeight} ${scaledFontSize}px ${text.fontFamily}`;

  // Save context and create clipping region to constrain text within print area
  ctx.save();
  ctx.beginPath();
  ctx.rect(pixelLeft, pixelTop, pixelWidth, pixelHeight);
  ctx.clip();

  ctx.translate(textCenterX, textCenterY);
  const scaleX = flip.flipX ? -1 : 1;
  const scaleY = flip.flipY ? -1 : 1;
  ctx.scale(scaleX, scaleY);
  const extraRotation = MODEL_UV_EXTRA_ROTATION[modelPath]?.[text.area] ?? 0;
  if (extraRotation) ctx.rotate(extraRotation);
  
  ctx.font = fontString;
  ctx.fillStyle = text.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw the text - handle multi-line text
  const lines = text.content.split('\n');
  const lineHeight = scaledFontSize * 1.2; // 1.2x font size for line spacing
  const totalHeight = (lines.length - 1) * lineHeight;
  const startY = -totalHeight / 2;
  
  lines.forEach((line, index) => {
    ctx.fillText(line, 0, startY + index * lineHeight);
  });
  ctx.restore();
}

function ModelWithDecal({ 
  modelPath, 
  color = '#d1d1cf', 
  autoRotate = true, 
  rotationSpeed = 0.01,
  dragRotate = false,
  rotationRef,
  targetRotation,
  initialRotation,
  decals,
  texts,
  onSceneReady,
  onTextureCanvasReady,
  texturePreviewSize = EDITOR_TEXTURE_PREVIEW_SIZE,
}: ModelWithDecalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath, '/draco/');
  const [isSnapping, setIsSnapping] = useState(false);
  const lastTargetRef = useRef<{ x: number; y: number } | undefined>(undefined);
  
  // Detect when target rotation changes and start snapping
  useEffect(() => {
    if (targetRotation && 
        (lastTargetRef.current?.x !== targetRotation.x || 
         lastTargetRef.current?.y !== targetRotation.y)) {
      setIsSnapping(true);
      lastTargetRef.current = { ...targetRotation };
    }
  }, [targetRotation]);
  
  // Create the baked texture with all decals and texts
  const bakedTexture = useDecalTexture(decals, texts, color, modelPath, onTextureCanvasReady, texturePreviewSize);

  // Clone and configure the scene with the baked texture
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    
    // Apply material with baked texture to all meshes
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = new THREE.MeshStandardMaterial({
          color: bakedTexture ? '#ffffff' : new THREE.Color(color),
          map: bakedTexture || null,
          roughness: 0.5,
          metalness: 0.1,
        });
        mesh.material = material;
      }
    });
    
    // Calculate bounding box and center the model
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    clone.position.sub(center);
    
    return clone;
  }, [scene, color, bakedTexture]);

  // Notify parent when scene is ready for export
  useEffect(() => {
    if (onSceneReady && clonedScene) {
      onSceneReady(clonedScene);
    }
  }, [onSceneReady, clonedScene]);

  useFrame(() => {
    if (groupRef.current) {
      if (dragRotate && rotationRef) {
        // Smoothly interpolate to target rotation when snapping
        if (isSnapping && targetRotation) {
          const lerpFactor = 0.1;
          rotationRef.current.x += (targetRotation.x - rotationRef.current.x) * lerpFactor;
          rotationRef.current.y += (targetRotation.y - rotationRef.current.y) * lerpFactor;
          
          // Stop snapping once we're close enough to target
          const distX = Math.abs(targetRotation.x - rotationRef.current.x);
          const distY = Math.abs(targetRotation.y - rotationRef.current.y);
          if (distX < 0.01 && distY < 0.01) {
            setIsSnapping(false);
          }
        }
        groupRef.current.rotation.y = rotationRef.current.y;
        groupRef.current.rotation.x = rotationRef.current.x;
      } else if (autoRotate) {
        groupRef.current.rotation.y += rotationSpeed;
      } else if (initialRotation) {
        // Apply static initial rotation
        groupRef.current.rotation.x = initialRotation.x;
        groupRef.current.rotation.y = initialRotation.y;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

/** No useProgress here — it updates during other suspense loads (e.g. Environment) and triggers "setState during render" warnings. */
function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <span className="text-sm text-gray-500">Učitavanje...</span>
      </div>
    </Html>
  );
}

function CameraController({
  zoom,
  cameraY = 0,
  distanceMultiplier = 1,
  fov = 50,
  /** Look-at X in scene units (default 0). Shifts framing left/right. */
  lookAtX,
  /** Look-at Y (default: same as cameraY — legacy vertical pan). */
  lookAtY,
}: {
  zoom: number;
  cameraY?: number;
  /** >1 pulls camera back (farther) — useful for small embed cards vs full editor. */
  distanceMultiplier?: number;
  fov?: number;
  lookAtX?: number;
  lookAtY?: number;
}) {
  const { camera } = useThree();
  const distance = Math.max(0.1, (2.5 / Math.max(zoom, 0.01)) * distanceMultiplier);
  const lx = lookAtX ?? 0;
  const ly = lookAtY !== undefined ? lookAtY : cameraY;

  useEffect(() => {
    const p = camera as THREE.PerspectiveCamera;
    if (p.isPerspectiveCamera && Math.abs(p.fov - fov) > 0.01) {
      p.fov = fov;
    }
  }, [camera, fov]);

  /** Keep position + orientation in sync every frame (fixes stale lookAt after distance changes; works at any canvas DPR/size). */
  useFrame(() => {
    const p = camera as THREE.PerspectiveCamera;
    if (p.isPerspectiveCamera && Math.abs(p.fov - fov) > 0.01) {
      p.fov = fov;
    }
    camera.position.set(0, cameraY, distance);
    camera.lookAt(lx, ly, 0);
    camera.updateProjectionMatrix();
  });

  return null;
}

interface EditorModelViewerProps {
  modelPath: string;
  color?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  zoom?: number;
  cameraY?: number;
  className?: string;
  showShadow?: boolean;
  interactive?: boolean;
  enableZoom?: boolean;
  dragToRotate?: boolean;
  backgroundColor?: string;
  decals?: DecalConfig[];
  texts?: TextConfig[];
  targetRotation?: { x: number; y: number };
  initialRotation?: { x: number; y: number };
  onExportReady?: (exportApi: EditorModelViewerExportApi) => void;
  /** Baked decal atlas resolution; editor default 1024, smaller embeds can use {@link EMBED_TEXTURE_PREVIEW_SIZE}. */
  texturePreviewSize?: number;
  /** WebGL backing store scale; use `[1,1]` for small embeds. */
  canvasDpr?: number | [number, number];
  /** Multiplies camera distance from model (default 1). Use >1 for cramped admin embeds. */
  cameraDistanceMultiplier?: number;
  /** Vertical field of view (degrees). Slightly higher (e.g. 56–60) shows more of tall garments in embeds. */
  cameraFov?: number;
  /** Optional camera look-at target (scene units). Use for admin embed framing when bbox center ≠ visual center. */
  cameraLookAtX?: number;
  cameraLookAtY?: number;
}

const EditorModelViewer = forwardRef<EditorModelViewerHandle, EditorModelViewerProps>(({
  modelPath,
  color = '#d1d1cf',
  autoRotate = true,
  rotationSpeed = 0.01,
  zoom = 1,
  cameraY = 0,
  className = '',
  showShadow = false,
  interactive = true,
  enableZoom = true,
  dragToRotate = false,
  backgroundColor = 'transparent',
  decals,
  texts,
  targetRotation,
  initialRotation,
  onExportReady,
  texturePreviewSize = EDITOR_TEXTURE_PREVIEW_SIZE,
  canvasDpr = [1, 2],
  cameraDistanceMultiplier = 1,
  cameraFov = 50,
  cameraLookAtX,
  cameraLookAtY,
}, ref) => {
  const [hasError, setHasError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const rotationRef = useRef({ x: 0, y: 0 });
  const sceneRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!dragToRotate || !initialRotation) return;
    rotationRef.current.x = initialRotation.x;
    rotationRef.current.y = initialRotation.y;
  }, [dragToRotate, modelPath, initialRotation?.x, initialRotation?.y]);
  const textureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const webglCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const threeStateRef = useRef<{ gl: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.Camera } | null>(null);

  // Detect mobile for position adjustment
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const waitForRender = useCallback(async () => {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    const state = threeStateRef.current;
    if (state) {
      state.gl.render(state.scene, state.camera);
    }
  }, []);

  const exportPreviewImages = useCallback(async () => {
    const canvas = webglCanvasRef.current;
    if (!canvas || !dragToRotate) {
      return [];
    }

    const modelKeys = Object.keys(MODEL_UV_PRINT_AREAS[modelPath] || { front: DEFAULT_UV_PRINT_AREA });
    const used = new Set<string>();
    (decals || []).forEach((d) => {
      if (d.texture && d.area) used.add(d.area);
    });
    (texts || []).forEach((t) => {
      if (t.content?.trim() && t.area) used.add(t.area);
    });

    const priorityOrder = ['front', 'back', 'leftSleeve', 'rightSleeve'];
    const areasToCapture = priorityOrder.filter((a) => used.has(a) && modelKeys.includes(a));
    if (areasToCapture.length === 0) {
      return [];
    }

    const originalRotation = { ...rotationRef.current };
    const captures: Array<{ name: string; dataUrl: string }> = [];

    const captureHighResPng = (): string => {
      const state = threeStateRef.current;
      if (!state) return '';
      const gl = state.gl as THREE.WebGLRenderer;
      const dom = gl.domElement;
      const prevW = dom.width;
      const prevH = dom.height;
      const prevPR = gl.getPixelRatio();
      const nw = Math.round(prevW * PREVIEW_EXPORT_PIXEL_SCALE);
      const nh = Math.round(prevH * PREVIEW_EXPORT_PIXEL_SCALE);
      const cam = state.camera as THREE.PerspectiveCamera;
      gl.setPixelRatio(1);
      gl.setSize(nw, nh, false);
      cam.aspect = nw / nh;
      cam.updateProjectionMatrix();
      gl.render(state.scene, cam);
      const dataUrl = dom.toDataURL('image/png');
      gl.setPixelRatio(prevPR);
      gl.setSize(prevW, prevH, false);
      cam.aspect = prevW / prevH;
      cam.updateProjectionMatrix();
      gl.render(state.scene, cam);
      return dataUrl;
    };

    for (const area of areasToCapture) {
      const target = PREVIEW_CAPTURE_ROTATIONS[area] || PREVIEW_CAPTURE_ROTATIONS.front;
      rotationRef.current = { ...target };
      await waitForRender();
      captures.push({
        name: area,
        dataUrl: captureHighResPng(),
      });
    }

    rotationRef.current = originalRotation;
    await waitForRender();
    return captures;
  }, [dragToRotate, modelPath, waitForRender, decals, texts]);

  const exportPrintZones = useCallback(async () => {
    const modelAreas = MODEL_UV_PRINT_AREAS[modelPath] || { front: DEFAULT_UV_PRINT_AREA };
    const usedAreas = new Set<string>();

    (decals || []).forEach((decal) => {
      if (decal.texture && decal.area) {
        usedAreas.add(decal.area);
      }
    });

    (texts || []).forEach((text) => {
      if (text.content?.trim() && text.area) {
        usedAreas.add(text.area);
      }
    });

    const areasToExport = Array.from(usedAreas).filter((areaName) => Boolean(modelAreas[areaName]));
    if (areasToExport.length === 0) {
      return [];
    }

    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = PRINT_ATLAS_SOURCE_SIZE;
    sourceCanvas.height = PRINT_ATLAS_SOURCE_SIZE;
    const sourceCtx = sourceCanvas.getContext('2d');
    if (!sourceCtx) {
      return [];
    }

    sourceCtx.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height);

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
      });

    for (const decal of decals || []) {
      if (!decal.texture || !decal.area || !usedAreas.has(decal.area)) {
        continue;
      }
      try {
        const img = await loadImage(decal.texture);
        drawDecalToCanvas(sourceCtx, img, decal, modelPath);
      } catch {
        // Skip failed image decode and continue exporting other areas
      }
    }

    (texts || []).forEach((text) => {
      if (!text.content?.trim() || !usedAreas.has(text.area)) {
        return;
      }
      drawTextToCanvas(sourceCtx, text, modelPath);
    });

    const zones: Array<{ name: string; dataUrl: string; widthCm: number; heightCm: number }> = [];

    areasToExport.forEach((areaName) => {
      const area = modelAreas[areaName] || DEFAULT_UV_PRINT_AREA;
      const dims = PRINT_ZONE_DIMENSIONS_CM[areaName] || PRINT_ZONE_DIMENSIONS_CM.front;
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = Math.round((dims.widthCm / 2.54) * PRINT_EXPORT_DPI);
      exportCanvas.height = Math.round((dims.heightCm / 2.54) * PRINT_EXPORT_DPI);

      const ctx = exportCanvas.getContext('2d');
      if (!ctx) {
        return;
      }

      const sourceX = area.uMin * sourceCanvas.width;
      const sourceY = (1 - area.vMax) * sourceCanvas.height;
      const sourceWidth = (area.uMax - area.uMin) * sourceCanvas.width;
      const sourceHeight = (area.vMax - area.vMin) * sourceCanvas.height;

      ctx.drawImage(
        sourceCanvas,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        exportCanvas.width,
        exportCanvas.height
      );

      // UV compensation flips are needed for 3D rendering, but print files should be
      // in natural orientation (same visual direction as in editor input).
      const flip = MODEL_UV_FLIP[modelPath]?.[areaName] ?? DEFAULT_FLIP;
      if (flip.flipX || flip.flipY) {
        const correctedCanvas = document.createElement('canvas');
        correctedCanvas.width = exportCanvas.width;
        correctedCanvas.height = exportCanvas.height;
        const correctedCtx = correctedCanvas.getContext('2d');
        if (correctedCtx) {
          correctedCtx.save();
          correctedCtx.translate(flip.flipX ? correctedCanvas.width : 0, flip.flipY ? correctedCanvas.height : 0);
          correctedCtx.scale(flip.flipX ? -1 : 1, flip.flipY ? -1 : 1);
          correctedCtx.drawImage(exportCanvas, 0, 0);
          correctedCtx.restore();
          ctx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
          ctx.drawImage(correctedCanvas, 0, 0);
        }
      }

      zones.push({
        name: areaName,
        dataUrl: exportCanvas.toDataURL('image/png'),
        widthCm: dims.widthCm,
        heightCm: dims.heightCm,
      });
    });

    return zones;
  }, [modelPath, decals, texts]);

  // Export function
  const exportGLTF = useCallback(async () => {
    console.log('exportGLTF called, sceneRef:', sceneRef.current);
    if (!sceneRef.current) {
      console.error('Scene not ready for export');
      return;
    }

    try {
      const exporter = new GLTFExporter();
      console.log('Starting export...');
      const result = await exporter.parseAsync(sceneRef.current, { binary: false });
      console.log('Export result:', result);
      
      const output = JSON.stringify(result, null, 2);
      const blob = new Blob([output], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'custom-product.gltf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      console.log('Download triggered');
    } catch (error) {
      console.error('Error exporting GLTF:', error);
    }
  }, []);

  // Expose export function via ref
  useImperativeHandle(ref, () => ({
    exportGLTF,
    exportPreviewImages,
    exportPrintZones,
  }), [exportGLTF, exportPreviewImages, exportPrintZones]);

  // Stable bridge: parent callbacks + inline onExportReady change identity every render; export fns
  // also change when decals/texts change — re-calling onExportReady each time caused setState loops.
  const latestExportRef = useRef<EditorModelViewerExportApi>({
    exportGLTF,
    exportPreviewImages,
    exportPrintZones,
  });
  latestExportRef.current = { exportGLTF, exportPreviewImages, exportPrintZones };

  const stableExportApi = useMemo<EditorModelViewerExportApi>(
    () => ({
      exportGLTF: () => latestExportRef.current.exportGLTF(),
      exportPreviewImages: () => latestExportRef.current.exportPreviewImages(),
      exportPrintZones: () => latestExportRef.current.exportPrintZones(),
    }),
    []
  );

  const onExportReadyRef = useRef(onExportReady);
  onExportReadyRef.current = onExportReady;

  useEffect(() => {
    onExportReadyRef.current?.(stableExportApi);
  }, [stableExportApi]);

  useEffect(() => {
    setHasError(false);
  }, [modelPath]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (dragToRotate) {
      setIsDragging(true);
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && dragToRotate) {
      const deltaX = e.clientX - lastMouse.x;
      const deltaY = e.clientY - lastMouse.y;
      
      rotationRef.current = {
        x: rotationRef.current.x + deltaY * 0.005,
        y: rotationRef.current.y + deltaX * 0.005,
      };
      
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (dragToRotate && e.touches.length === 1) {
      setIsDragging(true);
      setLastMouse({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && dragToRotate && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - lastMouse.x;
      const deltaY = e.touches[0].clientY - lastMouse.y;
      
      rotationRef.current = {
        x: rotationRef.current.x + deltaY * 0.005,
        y: rotationRef.current.y + deltaX * 0.005,
      };
      
      setLastMouse({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-xl ${className}`}>
        <div className="text-center p-6">
          <div className="text-4xl mb-2">📦</div>
          <p className="text-gray-500 text-sm">Model nije dostupan</p>
        </div>
      </div>
    );
  }

  const cameraDistance = Math.max(0.5, (2.5 / Math.max(zoom, 0.01)) * cameraDistanceMultiplier);

  const errorFallback = (
    <div className={`flex items-center justify-center bg-gray-100 rounded-xl ${className}`}>
      <div className="text-center p-6">
        <div className="text-4xl mb-2">📦</div>
        <p className="text-gray-500 text-sm">Model nije dostupan</p>
      </div>
    </div>
  );

  return (
    <ModelErrorBoundary fallback={errorFallback} onError={() => setHasError(true)}>
      <div 
        className={`relative ${className}`}
        style={{ 
          backgroundColor, 
          cursor: dragToRotate ? (isDragging ? 'grabbing' : 'grab') : 'default',
          touchAction: dragToRotate ? 'none' : 'auto'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
      <Canvas
        key={`${modelPath}-${zoom}-${texturePreviewSize}-${cameraDistanceMultiplier}-${cameraFov}-${Array.isArray(canvasDpr) ? canvasDpr.join(',') : canvasDpr}`}
        camera={{ position: [0, 0, cameraDistance], fov: cameraFov }}
        dpr={canvasDpr}
        onCreated={({ gl, scene, camera }) => {
          webglCanvasRef.current = gl.domElement;
          threeStateRef.current = { gl, scene, camera };
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <CameraController
            zoom={zoom}
            cameraY={cameraY}
            distanceMultiplier={cameraDistanceMultiplier}
            fov={cameraFov}
            lookAtX={cameraLookAtX}
            lookAtY={cameraLookAtY}
          />
          
          {/* Lighting — far behind and above the model for subtle backlit look */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 6, -12]} intensity={0.8} />
          <directionalLight position={[-5, 6, -10]} intensity={0.4} />
          
          {/* Purple rim light for brand effect — far behind the model */}
          <pointLight position={[-4, 2, -10]} intensity={2} color="#7c3aed" distance={15} />
          <pointLight position={[4, 2, -10]} intensity={1.2} color="#7c3aed" distance={15} />
          
          <group position={[0, isMobile ? -0.02 : 0, 0]}>
            <Center>
              <ModelWithDecal 
                modelPath={modelPath} 
                color={color} 
                autoRotate={dragToRotate ? false : autoRotate}
                rotationSpeed={rotationSpeed}
                dragRotate={dragToRotate}
                rotationRef={rotationRef}
                targetRotation={targetRotation}
                initialRotation={initialRotation}
                decals={decals}
                texts={texts}
                onSceneReady={(scene) => { sceneRef.current = scene; }}
                onTextureCanvasReady={(canvas) => { textureCanvasRef.current = canvas; }}
                texturePreviewSize={texturePreviewSize}
              />
            </Center>
          </group>
          
          {interactive && !dragToRotate && (
            <OrbitControls
              enablePan={false}
              enableZoom={enableZoom}
              minDistance={cameraDistance * 0.5}
              maxDistance={cameraDistance * 2}
              autoRotate={false}
              target={[0, 0, 0]}
            />
          )}
          
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
      </div>
    </ModelErrorBoundary>
  );
});

EditorModelViewer.displayName = 'EditorModelViewer';

export default EditorModelViewer;
