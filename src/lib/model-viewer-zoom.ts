/** Zoom-to-camera-distance mapping for the 3D editor, keyed by model path. */
export const EDITOR_ZOOM_BY_MODEL_PATH: Record<string, number> = {
  '/shirt/scene.gltf': 3.0,
}

/** Get the editor zoom level for a given model path. */
export function getEditorZoomForModelPath(modelPath: string): number {
  return EDITOR_ZOOM_BY_MODEL_PATH[modelPath] ?? 3.0
}

/** Camera settings for admin order embed viewer. */
export function getAdminOrderEmbedCamera(modelPath: string) {
  const zoom = EDITOR_ZOOM_BY_MODEL_PATH[modelPath] ?? 1
  return { zoom, cameraY: 0 }
}
