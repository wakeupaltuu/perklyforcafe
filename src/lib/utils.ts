import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function optimizeImageUrl(url: string | undefined | null, width: number = 600): string {
  if (!url) return '';
  // If URL already has optimization parameters, return as is
  if (url.includes('w=') && url.includes('format=')) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}w=${width}&format=webp`;
}
