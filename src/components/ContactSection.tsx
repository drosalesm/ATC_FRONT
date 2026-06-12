import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { fetchCompany, type Company } from "@/lib/companyApi";
import ContactModal from "@/components/ContactModal";

const ContactSection = () => {
  const ref = useReveal();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const loadCompany = async () => {
      try {
        setLoading(true);
        const response = await fetchCompany();
        if (Number(response.http_code) === 200) {
          setCompany(response.data);
        }
      } catch (err) {
        console.error("Error loading company:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, []);

  // Construir info pills dinámicamente
  const infoPills = [];
  if (company?.correo)   infoPills.push({ icon: Mail,    text: company.correo });
  if (company?.telefono) infoPills.push({ icon: Phone,   text: company.telefono });
  if (company?.ciudad)   infoPills.push({ icon: MapPin,  text: company.ciudad });

  return (
    <section id="contacto" className="py-24 section-divider" ref={ref}>
      <div className="container">
        <div className="mx-auto max-w-2xl rounded-2xl border-2 border-foreground/10 bg-card p-10 text-center shadow-sm">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
            Hablemos
          </p>
          <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
            ¿Listo para transformar su negocio?
          </h2>
          <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-primary/60" />
          <p className="mb-10 text-muted-foreground">
            {company?.lema
              ? company.lema
              : "Contáctenos para una asesoría personalizada. Nuestro equipo está listo para ayudarle a encontrar la solución perfecta."}
          </p>

          {/* Info pills */}
          {loading ? (
            <div className="flex items-center justify-center mb-10">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
              {infoPills.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon size={14} />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          )}

          {company?.correo && (
            <a
              href={`mailto:${company.correo}`}
              className="inline-flex h-12 items-center gap-2 rounded-lg border-2 border-primary bg-primary px-8 font-semibold text-primary-foreground transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-1"
            >
              <Mail size={18} /> Enviar Correo
            </a>
          )}

          {/* Botón ver todos los canales */}
          <button
            onClick={() => setContactOpen(true)}
            className="ml-4 inline-flex h-12 items-center gap-2 rounded-lg border-2 border-primary px-8 font-semibold text-primary transition-all duration-300 hover:bg-primary/10 hover:-translate-y-1"
          >
            Ver todos los canales
          </button>
        </div>
      </div>

      <ContactModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        title="Contáctanos"
        description="Elige el canal que prefieras para comunicarte con nosotros."
      />
    </section>
  );
};

export default ContactSection;