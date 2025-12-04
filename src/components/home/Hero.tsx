import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center text-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/50 to-transparent" />
      <div className="absolute inset-0 bg-primary/40" />
      <div className="relative z-10 flex flex-col items-center gap-6 p-4">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl font-headline">
          Building Future Professionals
        </h1>
        <p className="max-w-3xl text-lg md:text-xl text-primary-foreground/90">
          Welcome to SMK LPPMRI 2 Kedungreja, where we nurture talent and skill for a successful career in the vocational world.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/programs">
              Explore Our Programs <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
            <PlayCircle className="mr-2 h-5 w-5" /> Watch School Tour
          </Button>
        </div>
      </div>
    </section>
  );
}
