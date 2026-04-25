import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import FindUs from '@/components/FindUs';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      <ScrollReveal><About /></ScrollReveal>
      <ScrollReveal><Menu /></ScrollReveal>
      <ScrollReveal><FindUs /></ScrollReveal>
      <Footer />
    </>
  );
}
