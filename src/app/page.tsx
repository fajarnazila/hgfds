import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Announcements from "@/components/home/Announcements";
import Hero from "@/components/home/Hero";
import FeaturedPrograms from "@/components/home/FeaturedPrograms";
import AboutPreview from "@/components/home/AboutPreview";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import NewsAndEvents from "@/components/home/NewsAndEvents";
import AdmissionsPreview from "@/components/home/AdmissionsPreview";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Announcements />
      <Header />
      <main className="flex-grow">
        <Hero />
        <FeaturedPrograms />
        <AboutPreview />
        <Stats />
        <AdmissionsPreview />
        <Testimonials />
        <NewsAndEvents />
      </main>
      <Footer />
    </div>
  );
}
