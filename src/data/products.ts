export interface Product {
  id: string;
  name: string;
  shortDesc: string;
  img: string;
  category: string;
  brand: string;
  price?: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  relatedIds: string[];
}

export const products: Product[] = [
  {
    id: "qnap-ts-h686",
    name: "QNAP TS-h686 NAS 6 Bahías",
    shortDesc: "Intel Xeon D-1602, 4x 2.5GbE",
    img: "https://atcproinc.com/wp-content/uploads/2022/09/ts-h686-d1602-8g-01-qnap-ts-h686-servidor-nas-6-bahias-mac-pc-300x300.jpg",
    category: "NAS",
    brand: "QNAP",
    description:
      "El QNAP TS-h686 es un NAS empresarial de 6 bahías con procesador Intel Xeon D-1602 de doble núcleo a 2.5 GHz. Diseñado para cargas de trabajo intensivas en datos, ofrece aceleración de caché SSD M.2 NVMe, cuatro puertos de red 2.5GbE y soporte para almacenamiento ZFS con protección de datos de nivel empresarial a través de QuTS hero.",
    features: [
      "Procesador Intel Xeon D-1602 de doble núcleo a 2.5 GHz",
      "4 puertos de red 2.5GbE para alto rendimiento",
      "Soporte para caché SSD M.2 NVMe PCIe Gen 3",
      "Sistema operativo QuTS hero basado en ZFS",
      "Encriptación AES-NI de 256 bits por hardware",
      "Snapshots y deduplicación en línea",
      "Compatible con virtualización y contenedores Docker",
    ],
    specs: [
      { label: "Procesador", value: "Intel Xeon D-1602 (2 núcleos, 2.5 GHz)" },
      { label: "RAM", value: "8 GB DDR4 ECC (expandible a 128 GB)" },
      { label: "Bahías", value: "6 (4x 3.5\" SATA + 2x 2.5\" SATA/SSD)" },
      { label: "Puertos de red", value: "4x 2.5GbE RJ45" },
      { label: "USB", value: "3x USB 3.2 Gen 2 (10Gbps)" },
      { label: "Ranuras PCIe", value: "2x PCIe Gen 3 x8" },
      { label: "M.2 SSD", value: "2x M.2 2280 PCIe Gen 3 x4" },
      { label: "Fuente de poder", value: "250W" },
      { label: "Dimensiones", value: "221.5 x 290.2 x 236.6 mm" },
    ],
    relatedIds: ["qnap-tvs-472xt", "qnap-tvs-672xt", "qnap-tvs-872xt"],
  },
  {
    id: "qnap-tvs-472xt",
    name: "QNAP TVS-472XT 4 Bay",
    shortDesc: "Thunderbolt 3, 4GB RAM, 10GbE",
    img: "https://atcproinc.com/wp-content/uploads/2022/09/qnap-tvs-472xt-pt-4gb-nas-300x300.jpg",
    category: "NAS",
    brand: "QNAP",
    description:
      "El TVS-472XT es un NAS de 4 bahías con conectividad Thunderbolt 3 y 10GbE integrada, ideal para profesionales de video y edición multimedia. Su procesador Intel Pentium Gold ofrece un rendimiento fiable para flujos de trabajo creativos y empresariales.",
    features: [
      "Puerto Thunderbolt 3 de 40 Gbps",
      "Puerto 10GBASE-T integrado",
      "Procesador Intel Pentium Gold G5400T",
      "Ranuras SSD M.2 para caché",
      "Transcoding de video 4K en tiempo real",
      "Aplicaciones de vigilancia QVR Pro",
      "Soporte RAID 0, 1, 5, 6, 10",
    ],
    specs: [
      { label: "Procesador", value: "Intel Pentium Gold G5400T (2 núcleos, 3.1 GHz)" },
      { label: "RAM", value: "4 GB DDR4 (expandible a 32 GB)" },
      { label: "Bahías", value: "4x 3.5\"/2.5\" SATA" },
      { label: "Thunderbolt", value: "1x Thunderbolt 3 (40 Gbps)" },
      { label: "Red", value: "1x 10GBASE-T + 2x 1GbE" },
      { label: "USB", value: "2x USB 3.2, 2x USB 2.0" },
      { label: "HDMI", value: "2x HDMI 2.0 (4K)" },
      { label: "Dimensiones", value: "180 x 234.7 x 282.8 mm" },
    ],
    relatedIds: ["qnap-ts-h686", "qnap-tvs-672xt", "qnap-tvs-872xt"],
  },
  {
    id: "qnap-tvs-672xt",
    name: "QNAP TVS-672XT 6 Bay",
    shortDesc: "8GB RAM, 10GbE, M.2 PCIe NVMe",
    img: "https://atcproinc.com/wp-content/uploads/2022/09/qnap-tvs-672x-i3-8g-nas-6-bay-300x300.jpg",
    category: "NAS",
    brand: "QNAP",
    description:
      "El TVS-672XT de 6 bahías combina Thunderbolt 3, 10GbE y ranuras M.2 PCIe NVMe para ofrecer un rendimiento excepcional en edición de video 4K, virtualización y almacenamiento empresarial. Ideal para equipos creativos que necesitan acceso rápido a archivos grandes.",
    features: [
      "Puerto Thunderbolt 3 a 40 Gbps",
      "10GBASE-T integrado para redes de alto rendimiento",
      "Ranuras M.2 PCIe NVMe para caché SSD",
      "Procesador Intel Core i3-8100T",
      "Transcoding de video 4K con aceleración hardware",
      "Soporte de máquinas virtuales y contenedores",
      "Encriptación por hardware AES-NI",
    ],
    specs: [
      { label: "Procesador", value: "Intel Core i3-8100T (4 núcleos, 3.1 GHz)" },
      { label: "RAM", value: "8 GB DDR4 (expandible a 32 GB)" },
      { label: "Bahías", value: "6x 3.5\"/2.5\" SATA" },
      { label: "Thunderbolt", value: "1x Thunderbolt 3 (40 Gbps)" },
      { label: "Red", value: "1x 10GBASE-T + 2x 1GbE" },
      { label: "M.2 SSD", value: "2x M.2 PCIe NVMe" },
      { label: "HDMI", value: "2x HDMI 2.0" },
      { label: "Dimensiones", value: "221.5 x 290.2 x 236.6 mm" },
    ],
    relatedIds: ["qnap-tvs-472xt", "qnap-tvs-872xt", "qnap-ts-h686"],
  },
  {
    id: "qnap-tvs-872xt",
    name: "QNAP TVS-872XT 8 Bay",
    shortDesc: "16GB RAM, 10GbE, Thunderbolt 3",
    img: "https://atcproinc.com/wp-content/uploads/2022/09/qnap-nas-8-bahia-tvs-872x-i3-8g-300x300.jpg",
    category: "NAS",
    brand: "QNAP",
    description:
      "El TVS-872XT es el NAS insignia de QNAP con 8 bahías, 16 GB de RAM y conectividad Thunderbolt 3 + 10GbE. Perfecto para estudios de producción, post-producción de video 4K/8K y entornos que requieren almacenamiento compartido de alto rendimiento.",
    features: [
      "8 bahías para gran capacidad de almacenamiento",
      "16 GB RAM DDR4 expandible a 32 GB",
      "Thunderbolt 3 y 10GbE integrados",
      "Procesador Intel Core i5-8400T",
      "Salida HDMI 2.0 para visualización 4K",
      "Caché SSD M.2 NVMe para IOPS ultrarrápidos",
      "Soporte Qtier para almacenamiento automático en niveles",
    ],
    specs: [
      { label: "Procesador", value: "Intel Core i5-8400T (6 núcleos, 1.7 GHz)" },
      { label: "RAM", value: "16 GB DDR4 (expandible a 32 GB)" },
      { label: "Bahías", value: "8x 3.5\"/2.5\" SATA" },
      { label: "Thunderbolt", value: "2x Thunderbolt 3 (40 Gbps)" },
      { label: "Red", value: "1x 10GBASE-T + 2x 1GbE" },
      { label: "M.2 SSD", value: "2x M.2 PCIe NVMe" },
      { label: "USB", value: "2x USB 3.2 Gen 2" },
      { label: "Dimensiones", value: "221.5 x 337.8 x 236.6 mm" },
    ],
    relatedIds: ["qnap-tvs-672xt", "qnap-tvs-472xt", "qnap-ts-h686"],
  },
  {
    id: "dell-poweredge-xr2",
    name: "Dell PowerEdge EMC XR2",
    shortDesc: "Rack Server empresarial",
    img: "https://atcproinc.com/wp-content/uploads/2022/09/servidores-dell-300x300.jpg",
    category: "Servidor",
    brand: "Dell",
    description:
      "El Dell PowerEdge EMC XR2 es un servidor rack resistente diseñado para entornos exigentes y ubicaciones en el borde de la red. Con procesadores Intel Xeon Scalable y certificaciones MIL-STD, es ideal para despliegues edge computing, telecomunicaciones y entornos industriales.",
    features: [
      "Procesadores Intel Xeon Scalable de 2da generación",
      "Certificación MIL-STD-810H para entornos hostiles",
      "Operación en rango de temperatura extendido",
      "Profundidad reducida para racks en el borde",
      "Soporte iDRAC9 para gestión remota",
      "Hasta 512 GB de RAM DDR4",
      "RAID por hardware con Dell PERC",
    ],
    specs: [
      { label: "Procesador", value: "Hasta 2x Intel Xeon Scalable 2da Gen" },
      { label: "RAM", value: "Hasta 512 GB DDR4 (16 slots DIMM)" },
      { label: "Almacenamiento", value: "Hasta 4x 2.5\" Hot-Plug" },
      { label: "Red", value: "2x 10GbE + 2x 1GbE" },
      { label: "Factor de forma", value: "1U Rack (profundidad reducida)" },
      { label: "Gestión", value: "iDRAC9 Enterprise" },
      { label: "Fuente de poder", value: "Dual 550W redundante" },
      { label: "Certificaciones", value: "MIL-STD-810H, NEBS Level 3" },
    ],
    relatedIds: ["ubiquiti-u6-pro", "qnap-ts-h686"],
  },
  {
    id: "ubiquiti-u6-pro",
    name: "Ubiquiti UniFi U6-Pro",
    shortDesc: "Access Point Wi-Fi 6",
    img: "https://atcproinc.com/wp-content/uploads/2022/09/U6-LITE-01-300x300.webp",
    category: "Redes",
    brand: "Ubiquiti",
    description:
      "El Ubiquiti UniFi U6-Pro es un punto de acceso Wi-Fi 6 de alto rendimiento con tecnología OFDMA y MU-MIMO. Diseñado para despliegues empresariales de alta densidad, ofrece hasta 5.3 Gbps de velocidad agregada y soporte para más de 300 dispositivos concurrentes.",
    features: [
      "Wi-Fi 6 (802.11ax) con OFDMA y MU-MIMO",
      "Velocidad agregada de hasta 5.3 Gbps",
      "Soporte para 300+ dispositivos concurrentes",
      "Alimentación PoE+ (802.3at)",
      "Diseño discreto para techo o pared",
      "Gestión centralizada con UniFi Controller",
      "Band Steering y BSS Coloring avanzado",
    ],
    specs: [
      { label: "Estándar", value: "Wi-Fi 6 (802.11ax)" },
      { label: "Banda 2.4 GHz", value: "2x2 MIMO, 573.5 Mbps" },
      { label: "Banda 5 GHz", value: "4x4 MU-MIMO, 4.8 Gbps" },
      { label: "Puerto Ethernet", value: "1x GbE RJ45" },
      { label: "Alimentación", value: "PoE+ (802.3at), 13W" },
      { label: "Cobertura", value: "Hasta 140 m²" },
      { label: "Montaje", value: "Techo / pared (kit incluido)" },
      { label: "Dimensiones", value: "220 x 220 x 48 mm" },
    ],
    relatedIds: ["dell-poweredge-xr2", "qnap-ts-h686"],
  },
];

export const getProductById = (id: string) => products.find((p) => p.id === id);
