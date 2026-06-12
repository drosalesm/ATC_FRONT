import { useState, useEffect, useRef } from "react";
import { Bot, X, ChevronRight, ArrowLeft, MessageCircle, Clock, MapPin, Mail, Phone, Loader2 } from "lucide-react";
import { fetchCompany, type Company } from "@/lib/Companyapi";
import { fetchPublicProducts, type Product } from "@/lib/Productapi";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen =
  | "home"
  | "services"
  | "service-detail"
  | "products"
  | "product-detail"
  | "info";

interface Message {
  from: "bot" | "user";
  text: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parseFeatures = (features: string | null | undefined): string[] => {
  if (!features) return [];
  return features.split(",").map((f) => f.trim()).filter(Boolean);
};

const buildWhatsAppUrl = (phone: string, message: string): string => {
  const raw = phone.replace(/\D/g, "");
  return `https://wa.me/${raw}?text=${encodeURIComponent(message)}`;
};

// ─── Componente principal ─────────────────────────────────────────────────────

const ATCBot = () => {
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>("home");
  const [messages, setMessages] = useState<Message[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [services, setServices] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cargar datos al abrir
  useEffect(() => {
    if (!open) return;

    const load = async () => {
      try {
        setLoading(true);
        const [companyRes, servicesRes, productsRes] = await Promise.all([
          fetchCompany(),
          fetchPublicProducts(1), // category_id 1 → Servicios
          fetchPublicProducts(3), // category_id 3 → Productos
        ]);
        if (Number(companyRes.http_code) === 200)   setCompany(companyRes.data);
        if (Number(servicesRes.http_code) === 200)  setServices(servicesRes.data);
        if (Number(productsRes.http_code) === 200)  setProducts(productsRes.data);
      } catch (err) {
        console.error("ATCBot load error:", err);
      } finally {
        setLoading(false);
        setMessages([
          { from: "bot", text: `¡Hola! 👋 Soy el asistente de ${company?.nombre ?? "ATC Solutions"}. ¿En qué puedo ayudarte hoy?` },
        ]);
      }
    };

    load();
  }, [open]);

  const addUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { from: "user", text }]);
  };

  const addBotMessage = (text: string) => {
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text }]);
    }, 300);
  };

  const goTo = (s: Screen, userText?: string) => {
    if (userText) addUserMessage(userText);
    setScreen(s);
  };

  const selectService = (service: Product) => {
    addUserMessage(service.name);
    addBotMessage(`Aquí tienes los detalles de **${service.name}**.`);
    setSelectedItem(service);
    setScreen("service-detail");
  };

  const selectProduct = (product: Product) => {
    addUserMessage(product.name);
    addBotMessage(`Aquí tienes los detalles de **${product.name}**.`);
    setSelectedItem(product);
    setScreen("product-detail");
  };

  const handleWhatsApp = (itemName: string) => {
    if (!company?.whatsapp) return;
    const msg = `Hola, estoy interesado en *${itemName}*. ¿Pueden darme más información?`;
    window.open(buildWhatsAppUrl(company.whatsapp, msg), "_blank");
  };

  const handleDirectWhatsApp = () => {
    if (!company?.whatsapp) return;
    const msg = `Hola, me gustaría hablar con un asesor de ${company.nombre}.`;
    window.open(buildWhatsAppUrl(company.whatsapp, msg), "_blank");
  };

  const reset = () => {
    setScreen("home");
    setSelectedItem(null);
    setMessages([
      { from: "bot", text: `¡Hola! 👋 Soy el asistente de ${company?.nombre ?? "ATC Solutions"}. ¿En qué puedo ayudarte hoy?` },
    ]);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/40"
        aria-label="Abrir asistente"
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>

      {/* Ventana del bot */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-80 flex-col rounded-2xl border-2 border-foreground/10 bg-background shadow-2xl shadow-black/20 overflow-hidden"
          style={{ maxHeight: "520px" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-primary px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20">
              <Bot size={20} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary-foreground">ATC Bot</p>
              <p className="text-xs text-primary-foreground/70">Asistente virtual</p>
            </div>
            <button
              onClick={reset}
              className="ml-auto text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors"
            >
              Reiniciar
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ minHeight: "120px", maxHeight: "180px" }}>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <span
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                      msg.from === "bot"
                        ? "bg-muted text-foreground rounded-tl-none"
                        : "bg-primary text-primary-foreground rounded-tr-none"
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Divider */}
          <div className="border-t border-foreground/10" />

          {/* Pantallas de opciones */}
          <div className="overflow-y-auto p-3 space-y-2" style={{ maxHeight: "220px" }}>

            {/* HOME */}
            {screen === "home" && !loading && (
              <>
                <BotButton icon={<ChevronRight size={14} />} onClick={() => { goTo("services", "Ver servicios"); addBotMessage("Aquí están nuestros servicios disponibles:"); }}>
                  Ver Servicios
                </BotButton>
                <BotButton icon={<ChevronRight size={14} />} onClick={() => { goTo("products", "Ver productos"); addBotMessage("Aquí están nuestros productos disponibles:"); }}>
                  Ver Productos
                </BotButton>
                <BotButton icon={<ChevronRight size={14} />} onClick={() => { goTo("info", "Más información"); addBotMessage("Aquí está la información de contacto:"); }}>
                  Más Información
                </BotButton>
                <BotButton icon={<MessageCircle size={14} />} onClick={() => { addUserMessage("Hablar con un asesor"); handleDirectWhatsApp(); }} primary>
                  Hablar con un Asesor
                </BotButton>
              </>
            )}

            {/* SERVICES LIST */}
            {screen === "services" && (
              <>
                <BackButton onClick={() => goTo("home")} />
                {services.map((s) => (
                  <BotButton key={s.id} icon={<ChevronRight size={14} />} onClick={() => selectService(s)}>
                    {s.name}
                  </BotButton>
                ))}
              </>
            )}

            {/* SERVICE DETAIL */}
            {screen === "service-detail" && selectedItem && (
              <>
                <BackButton onClick={() => goTo("services")} />
                <div className="rounded-lg border border-foreground/10 bg-muted/30 p-3 space-y-2">
                  <p className="text-xs font-semibold text-foreground">{selectedItem.name}</p>
                  {selectedItem.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{selectedItem.description}</p>
                  )}
                  {parseFeatures(selectedItem.features).length > 0 && (
                    <ul className="space-y-1">
                      {parseFeatures(selectedItem.features).map((f) => (
                        <li key={f} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <BotButton icon={<MessageCircle size={14} />} onClick={() => handleWhatsApp(selectedItem.name)} primary>
                  Solicitar por WhatsApp
                </BotButton>
              </>
            )}

            {/* PRODUCTS LIST */}
            {screen === "products" && (
              <>
                <BackButton onClick={() => goTo("home")} />
                {products.map((p) => (
                  <BotButton key={p.id} icon={<ChevronRight size={14} />} onClick={() => selectProduct(p)}>
                    {p.name}
                  </BotButton>
                ))}
              </>
            )}

            {/* PRODUCT DETAIL */}
            {screen === "product-detail" && selectedItem && (
              <>
                <BackButton onClick={() => goTo("products")} />
                <div className="rounded-lg border border-foreground/10 bg-muted/30 p-3 space-y-2">
                  <p className="text-xs font-semibold text-foreground">{selectedItem.name}</p>
                  {selectedItem.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{selectedItem.description}</p>
                  )}
                  {parseFeatures(selectedItem.features).length > 0 && (
                    <ul className="space-y-1">
                      {parseFeatures(selectedItem.features).slice(0, 4).map((f) => (
                        <li key={f} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <BotButton icon={<MessageCircle size={14} />} onClick={() => handleWhatsApp(selectedItem.name)} primary>
                  Solicitar cotización
                </BotButton>
              </>
            )}

            {/* INFO */}
            {screen === "info" && company && (
              <>
                <BackButton onClick={() => goTo("home")} />
                <div className="rounded-lg border border-foreground/10 bg-muted/30 p-3 space-y-2">
                  {company.horario_atencion && (
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Clock size={12} className="mt-0.5 shrink-0 text-primary" />
                      {company.horario_atencion}
                    </div>
                  )}
                  {company.ciudad && (
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <MapPin size={12} className="mt-0.5 shrink-0 text-primary" />
                      {company.direccion ? `${company.direccion}, ${company.ciudad}` : company.ciudad}
                    </div>
                  )}
                  {company.correo && (
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Mail size={12} className="mt-0.5 shrink-0 text-primary" />
                      {company.correo}
                    </div>
                  )}
                  {company.telefono && (
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Phone size={12} className="mt-0.5 shrink-0 text-primary" />
                      {company.telefono}
                    </div>
                  )}
                </div>
                {company.whatsapp && (
                  <BotButton icon={<MessageCircle size={14} />} onClick={handleDirectWhatsApp} primary>
                    Contactar por WhatsApp
                  </BotButton>
                )}
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
};

// ─── Sub-componentes ──────────────────────────────────────────────────────────

const BotButton = ({
  children,
  onClick,
  icon,
  primary = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ReactNode;
  primary?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
      primary
        ? "bg-primary text-primary-foreground hover:shadow-md hover:shadow-primary/30"
        : "border border-foreground/10 bg-card text-foreground hover:border-primary/30 hover:bg-primary/5"
    }`}
  >
    {children}
    {icon && <span className="ml-2 shrink-0">{icon}</span>}
  </button>
);

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-1"
  >
    <ArrowLeft size={12} /> Volver
  </button>
);

export default ATCBot;