import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';

export default function AboutPreview() {
  const aboutImage = PlaceHolderImages.find(img => img.id === 'about-preview');

  return (
    <section className="bg-secondary py-16 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
              A Tradition of Excellence in Vocational Education
            </h2>
            <p className="text-lg text-muted-foreground">
              Since our establishment, SMK LPPMRI 2 Kedungreja has been committed to providing high-quality vocational training that meets industry standards. Our vision is to produce competent, creative, and competitive graduates ready to make a difference.
            </p>
            <p className="text-muted-foreground">
              We believe in a holistic approach to education, combining rigorous academic learning with hands-on practical experience in our state-of-the-art facilities.
            </p>
            <Button size="lg" asChild>
              <Link href="/about">
                Discover Our Story <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="relative h-80 w-full lg:h-[450px] rounded-xl overflow-hidden shadow-lg">
            {aboutImage && (
              <Image
                src={aboutImage.imageUrl}
                alt={aboutImage.description}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                data-ai-hint={aboutImage.imageHint}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
