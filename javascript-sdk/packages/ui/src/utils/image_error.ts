import { iconError } from '../assets/icon_error'

export function handleImageError(e: Event) {
  const img = e.target as HTMLImageElement;
  img.src = iconError;
}