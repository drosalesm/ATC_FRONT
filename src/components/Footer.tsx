import ElectricBolts from "./ElectricBolts";

const Footer = () => {
  return (
    <footer className="relative border-t-2 border-primary/30 bg-foreground text-background py-10 overflow-hidden">
      <ElectricBolts />
      <div className="container relative flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="font-heading text-sm font-semibold text-background">
          <span className="text-gradient">ATC</span> PRO INC.
        </p>
        <p className="text-xs text-background/60">
          © {new Date().getFullYear()} ATCPROINC. Todos los derechos reservados.
        </p>
        <div className="flex gap-6">
          {["Productos", "Servicios", "Contacto"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-xs text-background/70 transition-colors duration-200 hover:text-primary">
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
