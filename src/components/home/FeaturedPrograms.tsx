import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { featuredPrograms } from '@/lib/placeholder-data';

export default function FeaturedPrograms() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Our Vocational Programs</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We offer a range of specialized programs designed to equip students with in-demand skills.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {featuredPrograms.map((program) => (
            <Card key={program.title} className="overflow-hidden group transition-all hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={program.image.imageUrl}
                    alt={program.image.description}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    data-ai-hint={program.image.imageHint}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                      <program.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold font-headline">{program.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-6 min-h-[60px]">{program.description}</p>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/programs">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
