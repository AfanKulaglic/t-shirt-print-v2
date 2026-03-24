export const personalizableProducts = [
  {
    id: 1,
    name: 'Majica',
    model: '/shirt/scene.gltf',
    zoom: 2,
    color: '#ffffff',
    gridArea: 'shirt',
    sides: [
      {
        id: 'front',
        name: 'Prednja strana',
        boundaries: { minX: 15, maxX: 85, minY: 10, maxY: 90 },
      },
      {
        id: 'back',
        name: 'Zadnja strana',
        boundaries: { minX: 15, maxX: 85, minY: 10, maxY: 90 },
      },
      {
        id: 'leftSleeve',
        name: 'Lijevi rukav',
        boundaries: { minX: 10, maxX: 90, minY: 10, maxY: 90 },
      },
      {
        id: 'rightSleeve',
        name: 'Desni rukav',
        boundaries: { minX: 10, maxX: 90, minY: 10, maxY: 90 },
      },
    ],
  },
]

export const productColors = [
  '#ffffff', '#1a1a1a', '#ef4444', '#3b82f6',
  '#10b981', '#f59e0b', '#8b5cf6', '#ec4899',
  '#06b6d4', '#f97316', '#6366f1', '#14b8a6',
  '#e11d48', '#84cc16', '#0ea5e9', '#a855f7',
]

export const fontOptions = [
  'Arial',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Impact',
  'Comic Sans MS',
  'Trebuchet MS',
]
