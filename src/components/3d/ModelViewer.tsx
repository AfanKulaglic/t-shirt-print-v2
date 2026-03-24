'use client';

import React, { Suspense, useRef, useState, useEffect, useMemo, Component, ErrorInfo, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Html, Center, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { Loader2 } from 'lucide-react';

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

interface ModelProps {
  modelPath: string;
  color?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  dragRotate?: boolean;
  rotationRef?: React.MutableRefObject<{ x: number; y: number }>;
}

function Model({ 
  modelPath, 
  color = '#d1d1cf', 
  autoRotate = true, 
  rotationSpeed = 0.005,
  dragRotate = false,
  rotationRef,
}: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath, '/draco/');
  
  // Clone and configure the scene
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    
    // Apply color to all meshes
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          roughness: 0.5,
          metalness: 0.1,
        });
      }
    });
    
    // Calculate bounding box and center the model
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    clone.position.sub(center);
    
    return clone;
  }, [scene, color]);

  useFrame(() => {
    if (groupRef.current) {
      if (dragRotate && rotationRef) {
        // Apply drag rotation from ref
        groupRef.current.rotation.y = rotationRef.current.y;
        groupRef.current.rotation.x = rotationRef.current.x;
      } else if (autoRotate) {
        groupRef.current.rotation.y += rotationSpeed;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

function LoadingSpinner() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <span className="text-sm text-gray-500">Učitavanje... {progress.toFixed(0)}%</span>
      </div>
    </Html>
  );
}

// Camera controller to fit the model in view
function CameraController({ zoom, cameraY = 0 }: { zoom: number; cameraY?: number }) {
  const { camera, gl } = useThree();
  
  // Calculate camera distance - smaller values = closer/more zoomed
  // Allow minimum distance of 0.1 for very high zoom values (small models like pendants)
  const distance = Math.max(0.1, 2.5 / Math.max(zoom, 0.01));
  
  useEffect(() => {
    camera.position.set(0, cameraY, distance);
    camera.lookAt(0, cameraY, 0);
    camera.updateProjectionMatrix();
    gl.render;
  }, [camera, gl, distance, zoom, cameraY]);
  
  // Also update on each frame to ensure it sticks
  useFrame(() => {
    if (camera.position.z !== distance || camera.position.y !== cameraY) {
      camera.position.z = distance;
      camera.position.y = cameraY;
      camera.updateProjectionMatrix();
    }
  });
  
  return null;
}

interface ModelViewerProps {
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
  /** Small storefront cards: cap pixel ratio for lighter GPU work (editor uses EditorModelViewer). */
  variant?: 'default' | 'card';
}

export default function ModelViewer({
  modelPath,
  color = '#d1d1cf',
  autoRotate = true,
  rotationSpeed = 0.005,
  zoom = 1,
  cameraY = 0,
  className = '',
  showShadow = true,
  interactive = true,
  enableZoom = true,
  dragToRotate = false,
  backgroundColor = 'transparent',
  variant = 'default',
}: ModelViewerProps) {
  const [hasError, setHasError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });

  // Reset error when model changes
  useEffect(() => {
    setHasError(false);
  }, [modelPath]);

  // Handle mouse drag for rotation
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

  // Calculate camera distance based on zoom
  const cameraDistance = Math.max(0.5, 2.5 / Math.max(zoom, 0.01));
  const canvasDpr: [number, number] = variant === 'card' ? [1, 1] : [1, 2];

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
        style={{ backgroundColor, cursor: dragToRotate ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <Canvas
        key={`${modelPath}-${zoom}-${variant}`}
        camera={{ position: [0, 0, cameraDistance], fov: 50 }}
        dpr={canvasDpr}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={!interactive ? { touchAction: 'auto', pointerEvents: 'none' } : undefined}
      >
        <Suspense fallback={<LoadingSpinner />}>
          {/* Camera controller */}
          <CameraController zoom={zoom} cameraY={cameraY} />
          
          {/* Lighting */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-5, 5, -5]} intensity={0.4} />
          
          {/* Purple rim light for brand effect */}
          <pointLight position={[3, 0, 0]} intensity={2} color="#7c3aed" distance={10} />
          <pointLight position={[2.5, 1, 1]} intensity={1.2} color="#7c3aed" distance={8} />
          
          {/* Centered Model */}
          <Center>
            <Model 
              modelPath={modelPath} 
              color={color} 
              autoRotate={dragToRotate ? false : autoRotate}
              rotationSpeed={rotationSpeed}
              dragRotate={dragToRotate}
              rotationRef={rotationRef}
            />
          </Center>
          
          {/* Shadow */}
          {showShadow && (
            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={0.4}
              scale={4}
              blur={2}
              far={4}
            />
          )}
          
          {/* Controls - only when not using drag to rotate */}
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
          
          {/* Environment for reflections */}
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
      </div>
    </ModelErrorBoundary>
  );
}

// Preload models for better performance
export function preloadModel(modelPath: string) {
  useGLTF.preload(modelPath, '/draco/');
}

// All model paths
export const MODEL_PATHS = [
  '/shirt/scene.gltf',
  '/cap/scene.gltf',
  '/cup/scene.gltf',
  '/pen/scene.gltf',
  '/bag/scene.gltf',
  '/pendants/scene.gltf',
  '/badge/scene.gltf',
  '/lighter/scene.gltf',
  '/agenda/scene.gltf',
];

export function preloadAllModels() {
  MODEL_PATHS.forEach(path => {
    useGLTF.preload(path, '/draco/');
  });
}
