import { useState, useEffect } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  Globe,
  LayoutDashboard,
  Server,
  Mail,
  Megaphone,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { fetchPublicProducts, type Product } from "@/lib/Productapi";

// ─── Iconos rotativos por índice ─────────────────────────────────────────────
const APP_ICONS = [Users, Package, ShoppingCart, Globe, LayoutDashboard, Server, Mail, Megaphone];

const AppsSection = () => {
  const ref = useReveal();
  const [apps, setApps] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApps = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchPublicProducts(2); // category_id = 4 → Soluciones Digitales
        if (Number(response.http_code) === 200) {
          setApps(response.data);
        } else {
          setError("No se pudieron cargar las aplicaciones.");
        }
      } catch (err) {
        console.error("Error loading apps:", err);
        setError("No se pudieron cargar las aplicaciones.");
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, []);

  return (
    <section id="aplicaciones" className="py-24 bg-card section-divider" ref={ref}>
      <div className="container">
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            Soluciones digitales
          </p>
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            Aplicaciones de Negocios
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

        {/* Grid de apps */}
        {!loading && !error && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {apps.map((app, i) => {
              const Icon = APP_ICONS[i % APP_ICONS.length];
              return (
                <div
                  key={app.id}
                  className="group flex items-center gap-4 rounded-xl border-2 border-foreground/10 bg-background p-5 cursor-pointer hover-lift"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-primary/20 bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:rotate-6 group-hover:scale-110">
                    <Icon size={20} />
                  </div>
                  <span className="font-heading font-semibold text-sm">{app.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default AppsSection;