import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, ChevronRight, Loader2, AlertCircle, Package } from "lucide-react";
import { fetchProductById, type Product } from "@/lib/Productapi";
import Footer from "@/components/Footer";
import ElectricBolts from "@/components/ElectricBolts";
import ContactModal from "@/components/ContactModal";

const API_BASE_URL = "http://127.0.0.1:5050";

// ─── Parsers ──────────────────────────────────────────────────────────────────

const parseFeatures = (features: string | null | undefined): string[] => {
  if (!features) return [];
  return features.split(",").map((f) => f.trim()).filter(Boolean);
};

const parseSpecs = (specs: string | null | undefined): { label: string; value: string }[] => {
  if (!specs) return [];
  return specs
    .split(",")
    .map((s) => {
      const colonIndex = s.indexOf(":");
      if (colonIndex === -1) return null;
      return {
        label: s.slice(0, colonIndex).trim(),
        value: s.slice(colonIndex + 1).trim(),
      };
    })
    .filter(Boolean) as { label: string; value: string }[];
};

// ─── Componente ───────────────────────────────────────────────────────────────

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetchProductById(Number(id));
        if (Number(response.http_code) === 200) {
          setProduct(response.data);
        } else {
          setError("Producto no encontrado.");
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error o no encontrado
  if (error || !product) {
    return (
      <div className="min-h-screen">
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 pt-24">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <h1 className="font-heading text-3xl font-bold">Producto no encontrado</h1>
          <Link to="/#productos" className="mt-2 text-primary hover:underline">
            ← Volver a productos
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const features = parseFeatures(product.features);
  const specs = parseSpecs(product.specs);

  return (
    <div className="min-h-screen">

      {/* Hero banner */}
      <section className="relative overflow-hidden border-b-2 border-foreground/10 bg-muted/40 pt-12 pb-16">
        <ElectricBolts />
        <div className="container relative">

          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            <Link to="/#productos" className="hover:text-primary transition-colors">Productos</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>

          <Link
            to="/#productos"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition-all hover:gap-3"
          >
            <ArrowLeft size={16} /> Volver a productos
          </Link>

          <div className="grid gap-10 md:grid-cols-2 items-center">

            {/* Imagen o placeholder */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border-2 border-foreground/10 bg-card">
              {product.image_path ? (
                <img
                  src={`${API_BASE_URL}/${product.image_path}`}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package size={72} className="text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <span className="mb-2 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {product.category_name}
              </span>
              <h1 className="font-heading text-3xl font-bold md:text-4xl mb-4">
                {product.name}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              <button
                onClick={() => setContactOpen(true)}
                className="mt-6 inline-flex h-12 items-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5"
              >
                Solicitar cotización
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Specs */}
      {(features.length > 0 || specs.length > 0) && (
        <section className="py-20 section-divider">
          <div className="container grid gap-12 lg:grid-cols-2">

            {/* Características */}
            {features.length > 0 && (
              <div>
                <h2 className="font-heading text-2xl font-bold mb-6">Características</h2>
                <div className="mx-auto mt-2 mb-6 h-1 w-12 rounded-full bg-primary/60 mr-auto ml-0" />
                <ul className="space-y-3">
                  {features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-lg border border-foreground/5 bg-card p-3 transition-all hover:border-primary/20 hover:shadow-sm"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check size={12} className="text-primary" />
                      </span>
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Especificaciones técnicas */}
            {specs.length > 0 && (
              <div>
                <h2 className="font-heading text-2xl font-bold mb-6">Especificaciones técnicas</h2>
                <div className="mx-auto mt-2 mb-6 h-1 w-12 rounded-full bg-primary/60 mr-auto ml-0" />
                <div className="overflow-hidden rounded-xl border-2 border-foreground/10">
                  {specs.map((s, i) => (
                    <div
                      key={i}
                      className={`flex items-center text-sm ${
                        i % 2 === 0 ? "bg-muted/30" : "bg-card"
                      } ${i < specs.length - 1 ? "border-b border-foreground/5" : ""}`}
                    >
                      <span className="w-2/5 shrink-0 px-4 py-3 font-semibold text-foreground">
                        {s.label}
                      </span>
                      <span className="px-4 py-3 text-muted-foreground">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section id="contacto-producto" className="py-16 bg-muted/30 section-divider">
        <div className="container text-center">
          <h2 className="font-heading text-2xl font-bold mb-3">¿Interesado en este producto?</h2>
          <p className="text-muted-foreground mb-6">
            Contáctanos para obtener precios, disponibilidad y asesoramiento personalizado.
          </p>
          <button
            onClick={() => setContactOpen(true)}
            className="inline-flex h-12 items-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5"
          >
            Contactar ahora
          </button>
        </div>
      </section>

      <Footer />
      <ContactModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        title={`Solicitar cotización: ${product.name}`}
        description="Comunícate con nosotros por el canal que prefieras para recibir tu cotización."
      />
    </div>
  );
};

export default ProductDetail;