import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null | undefined, currency = 'KM'): string {
  if (price == null || isNaN(price)) {
    return `0,00 ${currency}`;
  }
  const formatted = price.toFixed(2).replace('.', ',');
  return `${formatted} ${currency}`;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const months = [
    'januar', 'februar', 'mart', 'april', 'maj', 'juni',
    'juli', 'august', 'septembar', 'oktobar', 'novembar', 'decembar'
  ];
  return `${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}.`;
}

export function formatDateDdMmYyyy(date: Date | string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export function formatTimeHm(date: Date | string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('bs-BA', { hour: '2-digit', minute: '2-digit' });
}

export function calculateDiscount(price: number, discount: number): number {
  return price - (price * discount) / 100;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getImageUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return path.startsWith('/') ? path : `/${path}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function parseUuidOrNull(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const s = value.trim();
  if (!s) return null;
  const re =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return re.test(s) ? s : null;
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export const isClient = typeof window !== 'undefined';

export function isMobileDevice(): boolean {
  if (!isClient) return false;
  return window.innerWidth <= 768;
}

export function checkWebGLSupport(): boolean {
  if (!isClient) return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

export function scrollToElement(elementId: string, offset = 0): void {
  if (!isClient) return;
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isClient) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    const result = document.execCommand('copy');
    document.body.removeChild(textarea);
    return result;
  }
}
