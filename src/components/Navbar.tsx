import { useState, useEffect } from "react";
import { Menu, X, Package, Wrench, LayoutGrid } from "lucide-react";
import ElectricBolts from "./ElectricBolts";
import ContactModal from "./ContactModal";

const navLinks = [
  { label: "Productos", href: "#productos", icon: Package },
  { label: "Servicios", href: "#servicios", icon: Wrench },
  { label: "Aplicaciones", href: "#aplicaciones", icon: LayoutGrid },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = navLinks.map((l) => l.href.slice(1));
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = `#${id}`;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b-2 bg-foreground text-background ${
      scrolled ? "shadow-lg border-primary/40" : "border-primary/20"
    }`}>
      <ElectricBolts />
      <div className="container relative flex h-16 items-center justify-between">
        <a href="#" className="font-heading text-xl font-bold tracking-tight">
          <span className="text-gradient">ATC</span>{" "}
          <span className="text-background">PRO INC.</span>
        </a>
        <ul className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((l) => {
            const Icon = l.icon;
            const isActive = active === l.href;
            return (
              <li key={l.href}>
                <a href={l.href} className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                  isActive ? "bg-primary/20 text-primary border border-primary/50" : "text-background/80 hover:text-background hover:bg-background/10 border border-transparent"
                }`}>
                  <Icon size={16} className={isActive ? "text-primary" : ""} />
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>
        <button onClick={() => setContactOpen(true)} className="hidden lg:inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 border-2 border-primary">
          Contactar
        </button>
        <button onClick={() => setOpen(!open)} className="lg:hidden text-background transition-transform duration-200 active:scale-90" aria-label="Toggle menu">
          {open ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>
      <div className={`lg:hidden overflow-hidden transition-all duration-400 ease-out ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="border-t-2 border-primary/20 bg-foreground">
          <ul className="container flex flex-col gap-2 py-6">
            {navLinks.map((l) => {
              const Icon = l.icon;
              const isActive = active === l.href;
              return (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-4 py-3.5 text-base font-medium transition-colors duration-200 border ${
                    isActive ? "bg-primary/20 text-primary border-primary/50" : "text-background/80 hover:text-background hover:bg-background/10 border-transparent"
                  }`}>
                    <Icon size={22} />
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="container pb-6">
            <button
              onClick={() => { setOpen(false); setContactOpen(true); }}
              className="w-full inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground border-2 border-primary"
            >
              Contactar
            </button>
          </div>
        </div>
      </div>
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </nav>
  );
};

export default Navbar;
