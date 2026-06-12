import { useState, useEffect } from "react";
import { Facebook, MessageCircle, Phone, Mail, Instagram, Linkedin, Twitter, Youtube, Video, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchCompany, type Company } from "@/lib/Companyapi";


interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

interface Channel {
  icon: React.ElementType;
  label: string;
  value: string;
  href: string;
  external: boolean;
}

const buildChannels = (company: Company): Channel[] => {
  const channels: Channel[] = [];

  if (company.whatsapp) {
    const raw = company.whatsapp.replace(/\D/g, "");
    channels.push({
      icon: MessageCircle,
      label: "WhatsApp",
      value: company.whatsapp,
      href: `https://wa.me/${raw}`,
      external: true,
    });
  }

  if (company.telefono) {
    const raw = company.telefono.replace(/\D/g, "");
    channels.push({
      icon: Phone,
      label: "Teléfono",
      value: company.telefono,
      href: `tel:+${raw}`,
      external: false,
    });
  }

  if (company.correo) {
    channels.push({
      icon: Mail,
      label: "Correo",
      value: company.correo,
      href: `mailto:${company.correo}`,
      external: false,
    });
  }

  if (company.facebook) {
    channels.push({
      icon: Facebook,
      label: "Facebook",
      value: company.facebook.replace("https://", ""),
      href: company.facebook,
      external: true,
    });
  }

  if (company.instagram) {
    channels.push({
      icon: Instagram,
      label: "Instagram",
      value: company.instagram.replace("https://", ""),
      href: company.instagram,
      external: true,
    });
  }

  if (company.linkedin) {
    channels.push({
      icon: Linkedin,
      label: "LinkedIn",
      value: company.linkedin.replace("https://", ""),
      href: company.linkedin,
      external: true,
    });
  }

  if (company.twitter) {
    channels.push({
      icon: Twitter,
      label: "Twitter / X",
      value: company.twitter.replace("https://", ""),
      href: company.twitter,
      external: true,
    });
  }

  if (company.youtube) {
    channels.push({
      icon: Youtube,
      label: "YouTube",
      value: company.youtube.replace("https://", ""),
      href: company.youtube,
      external: true,
    });
  }

  if (company.tiktok) {
    channels.push({
      icon: Video,
      label: "TikTok",
      value: company.tiktok.replace("https://", ""),
      href: company.tiktok,
      external: true,
    });
  }

  return channels;
};

const ContactModal = ({
  open,
  onOpenChange,
  title = "Contáctanos",
  description = "Elige el canal que prefieras para comunicarte con nosotros.",
}: ContactModalProps) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  const channels = company ? buildChannels(company) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-2">
            {channels.map(({ icon: Icon, label, value, href, external }) => (
              <a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 rounded-lg border-2 border-foreground/10 bg-card p-3 transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon size={18} />
                </span>
                <span className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="text-xs text-muted-foreground truncate">{value}</span>
                </span>
              </a>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;