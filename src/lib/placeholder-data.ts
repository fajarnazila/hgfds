
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const findImage = (id: string): ImagePlaceholder => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) {
    // Fallback image
    return {
      id: 'fallback',
      description: 'Fallback image',
      imageUrl: 'https://picsum.photos/seed/fallback/600/400',
      imageHint: 'placeholder',
    };
  }
  return image;
};

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'Tentang Kami' },
  { href: '/programs', label: 'Program' },
  { href: '/news', label: 'Berita' },
  { href: '/gallery', label: 'Galeri' },
  { href: '/admissions', label: 'Penerimaan' },
  { href: '/contact', label: 'Kontak' },
];
