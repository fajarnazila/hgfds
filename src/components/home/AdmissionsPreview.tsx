import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, UserCheck, CalendarDays } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Submit Application',
    description: 'Fill out our online form and upload the required documents.',
  },
  {
    icon: UserCheck,
    title: 'Selection Process',
    description: 'Our team will review your application and qualifications.',
  },
  {
    icon: CalendarDays,
    title: 'Announcement',
    description: 'Check for the admission results on the announced date.',
  },
];

export default function AdmissionsPreview() {
  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Join Our Community</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Ready to start your journey with us? Our admission process is simple and straightforward.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="flex flex-col items-center text-center gap-4">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground">
                <step.icon className="h-8 w-8" />
              </div>
              <div className="font-bold text-xl font-headline">{index + 1}. {step.title}</div>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/admissions">
              Start Your Application <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
