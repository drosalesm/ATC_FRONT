import { ArrowRight, Server, Shield, Headphones } from "lucide-react";
import heroImage from "@/assets/hero-server.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-32 md:pt-40 section-divider">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Data center servers"
          width={1920}
          height={1080}
          className="h-full w-full object-cover opacity-12"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-32 right-16 h-72 w-72 rounded-full bg-primary/6 blur-3xl" />
      <div className="absolute bottom-24 left-8 h-56 w-56 rounded-full bg-primary/8 blur-3xl" />

      <div className="container relative z-10">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex items-center rounded-full border-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary animate-fade-in-up">
            Excelente Servicio, Nuestro Compromiso
          </p>
          <h1
            className="mb-6 font-heading text-5xl font-bold leading-tight text-foreground md:text-7xl animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Bienvenido a{" "}
            <span className="text-gradient">ATCPROINC</span>
          </h1>
          <p
            className="mb-8 max-w-lg text-lg text-muted-foreground animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Soluciones tecnológicas empresariales. Servidores, virtualización,
            redes y aplicaciones de negocio a la medida.
          </p>
          <div
            className="flex flex-wrap gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <a
              href="#productos"
              className="inline-flex h-12 items-center gap-2 rounded-lg border-2 border-primary bg-primary px-6 font-semibold text-primary-foreground transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-1"
            >
              Ver Productos <ArrowRight size={18} />
            </a>
            <a
              href="#servicios"
              className="inline-flex h-12 items-center gap-2 rounded-lg border-2 border-foreground/20 px-6 font-semibold text-foreground transition-all duration-300 hover:border-primary hover:bg-primary/5"
            >
              Nuestros Servicios
            </a>
          </div>
        </div>

        <div
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          {[
            { icon: Server, label: "Infraestructura", value: "Enterprise" },
            { icon: Shield, label: "Seguridad", value: "Garantizada" },
            { icon: Headphones, label: "Soporte", value: "24/7" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-xl border-2 border-foreground/10 bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={22} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-heading text-base font-semibold">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
