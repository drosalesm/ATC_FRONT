import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ProductsSection from "@/components/ProductsSection";
import AppsSection from "@/components/AppsSection";
import ManufacturersSection from "@/components/ManufacturersSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <ProductsSection />
      <AppsSection />
      <ManufacturersSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
