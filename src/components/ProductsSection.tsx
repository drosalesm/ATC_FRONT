import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2, AlertCircle, Package } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { fetchPublicProducts, type Product } from "@/lib/Productapi";

const API_BASE_URL = "http://127.0.0.1:5050";

const ProductsSection = () => {
  const ref = useReveal();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchPublicProducts(1); // category_id = 3 → Productos
        if (Number(response.http_code) === 200) {
          setProducts(response.data);
        } else {
          setError("No se pudieron cargar los productos.");
        }
      } catch (err) {
        console.error("Error loading products:", err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section id="productos" className="py-24 section-divider" ref={ref}>
      <div className="container">
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            Catálogo
          </p>
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            Productos Destacados
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary/60" />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center justify-center gap-3 py-20 text-muted-foreground">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <span>{error}</span>
          </div>
        )}

        {/* Grid de productos */}
        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p.id}
                to={`/producto/${p.id}`}
                className="group flex flex-col overflow-hidden rounded-xl border-2 border-foreground/10 bg-card hover-lift"
              >
                {/* Imagen o placeholder */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/50 border-b-2 border-foreground/5">
                  {p.image_path ? (
                    <img
                      src={`${API_BASE_URL}/${p.image_path}`}
                      alt={p.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package size={48} className="text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-1 font-heading text-base font-semibold leading-snug">
                    {p.name}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                    {p.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all duration-200 group-hover:gap-2">
                    Ver detalles <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;