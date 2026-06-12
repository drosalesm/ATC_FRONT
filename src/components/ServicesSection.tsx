import { useState, useEffect } from "react";
import { ClipboardList, Headphones, FileText, Cloud, Check, Loader2, AlertCircle,Shield, Zap, Globe, Settings } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { fetchPublicProducts, type Product } from "@/lib/Productapi";

// ─── Iconos rotativos por índice ─────────────────────────────────────────────
const SERVICE_ICONS = [ClipboardList, Headphones, FileText, Cloud, Shield, Zap, Globe, Settings];

const ServicesSection = () => {
  const ref = useReveal();
  const [selected, setSelected] = useState<Product | null>(null);
  const [services, setServices] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchPublicProducts(3);
        if (Number(response.http_code) === 200) {
          setServices(response.data);
        } else {
          setError("No se pudieron cargar los servicios.");
        }
      } catch (err) {
        console.error("Error loading services:", err);
        setError("No se pudieron cargar los servicios.");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const parseFeatures = (features: string | null | undefined): string[] => {
    if (!features) return [];
    return features.split(",").map((f) => f.trim()).filter(Boolean);
  };

  return (
    <section id="servicios" className="py-24 bg-card section-divider" ref={ref}>
      <div className="container">
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            Lo que hacemos
          </p>
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            Nuestros Servicios
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

        {/* Grid de servicios */}
        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => {
              const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
              return (
                <button
                  key={service.id}
                  onClick={() => setSelected(service)}
                  className="group relative rounded-xl border-2 border-foreground/10 bg-background p-6 hover-lift text-left cursor-pointer"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-primary/20 bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:scale-110">
                    <Icon size={24} />
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-semibold">{service.name}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {service.description}
                  </p>
                  <span className="mt-4 inline-flex text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Ver más detalles →
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto border-2 border-primary/20 p-5">
          {selected && (() => {
            const idx = services.findIndex((s) => s.id === selected.id);
            const Icon = SERVICE_ICONS[idx % SERVICE_ICONS.length];
            const features = parseFeatures(selected.features);

            return (
              <>
                <DialogHeader>
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-primary/30 bg-primary/10 text-primary">
                    <Icon size={28} />
                  </div>
                  <DialogTitle className="font-heading text-2xl">{selected.name}</DialogTitle>
                  <DialogDescription className="text-base leading-relaxed pt-2">
                    {selected.description}
                  </DialogDescription>
                </DialogHeader>

                {features.length > 0 && (
                  <div className="mt-2">
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                      Lo que incluye
                    </h4>
                    <ul className="space-y-2">
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 rounded-lg border border-foreground/5 bg-muted/30 p-2.5"
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                            <Check size={12} className="text-primary" />
                          </span>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <a
                  href="#contacto"
                  onClick={() => setSelected(null)}
                  className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
                >
                  Solicitar este servicio
                </a>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ServicesSection;