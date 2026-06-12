const logos = [
  { name: "TP-Link", src: "https://atcproinc.com/wp-content/uploads/2022/09/TPLINK_Logo_2.svg.png" },
  { name: "VMware", src: "https://atcproinc.com/wp-content/uploads/2022/09/vmware-logo-removebg-preview.png" },
  { name: "Ubiquiti", src: "https://atcproinc.com/wp-content/uploads/2022/09/logo-removebg-preview.png" },
  { name: "QNAP", src: "https://atcproinc.com/wp-content/uploads/2022/09/qnap-logo-removebg-preview.png" },
  { name: "Dell", src: "https://atcproinc.com/wp-content/uploads/2022/09/image-removebg-preview-2.png" },
  { name: "Partner", src: "https://atcproinc.com/wp-content/uploads/2022/09/image-removebg-preview-3.png" },
];

const ManufacturersSection = () => {
  return (
    <section className="border-y border-border bg-muted/30 py-16 overflow-hidden">
      <div className="container">
        <p className="mb-10 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Fabricantes y Partners
        </p>
      </div>
      {/* Infinite marquee */}
      <div className="relative">
        <div className="flex animate-marquee w-max gap-16 px-8">
          {[...logos, ...logos].map((l, i) => (
            <img
              key={`${l.name}-${i}`}
              src={l.src}
              alt={l.name}
              loading="lazy"
              className="h-10 w-auto object-contain opacity-40 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManufacturersSection;
