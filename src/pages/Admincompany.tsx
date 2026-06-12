import { useState, useEffect, useRef } from "react";
import {
  Loader2, AlertCircle, CheckCircle2, Upload, Image as ImageIcon,
  Building2, Phone, MapPin, Share2, Save
} from "lucide-react";
import {
  fetchCompany,
  updateCompany,
  uploadCompanyLogo,
  uploadCompanyFavicon,
  type Company,
  type CompanyUpdate,
} from "@/lib/Companyapi";
import { API_BASE_URL } from "@/lib/Apiclient";

const getToken = () => localStorage.getItem("atc_token") ?? "";

type Tab = "general" | "contacto" | "ubicacion" | "redes";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "general",   label: "General",      icon: Building2 },
  { id: "contacto",  label: "Contacto",     icon: Phone },
  { id: "ubicacion", label: "Ubicación",    icon: MapPin },
  { id: "redes",     label: "Redes Sociales", icon: Share2 },
];

const emptyForm = (): CompanyUpdate => ({
  nombre: "", razon_social: "", ruc: "", lema: "",
  correo: "", telefono: "", whatsapp: "",
  direccion: "", ciudad: "", maps_url: "", website: "",
  facebook: "", instagram: "", linkedin: "", twitter: "", youtube: "", tiktok: "",
  horario_atencion: "",
});

// ─── Componente principal ─────────────────────────────────────────────────────

const AdminCompany = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [form, setForm]       = useState<CompanyUpdate>(emptyForm());
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [tab, setTab]         = useState<Tab>("general");

  const [saving, setSaving]   = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [logoLoading, setLogoLoading]       = useState(false);
  const [faviconLoading, setFaviconLoading] = useState(false);
  const logoInputRef    = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // ─── Load ───────────────────────────────────────────────────────────────────

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchCompany();
      if (Number(res.http_code) === 200) {
        setCompany(res.data);
        setForm({
          nombre: res.data.nombre ?? "",
          razon_social: res.data.razon_social ?? "",
          ruc: res.data.ruc ?? "",
          lema: res.data.lema ?? "",
          correo: res.data.correo ?? "",
          telefono: res.data.telefono ?? "",
          whatsapp: res.data.whatsapp ?? "",
          direccion: res.data.direccion ?? "",
          ciudad: res.data.ciudad ?? "",
          maps_url: res.data.maps_url ?? "",
          website: res.data.website ?? "",
          facebook: res.data.facebook ?? "",
          instagram: res.data.instagram ?? "",
          linkedin: res.data.linkedin ?? "",
          twitter: res.data.twitter ?? "",
          youtube: res.data.youtube ?? "",
          tiktok: res.data.tiktok ?? "",
          horario_atencion: res.data.horario_atencion ?? "",
        });
      } else {
        setError(res.message);
      }
    } catch {
      setError("No se pudo cargar la información de la empresa.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ─── Save ────────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!form.nombre) { setSaveError("El nombre es obligatorio."); setTab("general"); return; }
    try {
      setSaving(true); setSaveError(null); setSaveSuccess(false);
      const res = await updateCompany(getToken(), form);
      if (Number(res.http_code) === 200) {
        setSaveSuccess(true);
        await loadData();
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(res.message);
      }
    } catch {
      setSaveError("Error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Logo / Favicon ──────────────────────────────────────────────────────────

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLogoLoading(true);
      const res = await uploadCompanyLogo(getToken(), file);
      if (Number(res.http_code) === 200) await loadData();
    } catch { setSaveError("Error al subir el logo."); }
    finally { setLogoLoading(false); if (logoInputRef.current) logoInputRef.current.value = ""; }
  };

  const handleFaviconSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setFaviconLoading(true);
      const res = await uploadCompanyFavicon(getToken(), file);
      if (Number(res.http_code) === 200) await loadData();
    } catch { setSaveError("Error al subir el favicon."); }
    finally { setFaviconLoading(false); if (faviconInputRef.current) faviconInputRef.current.value = ""; }
  };

  const setField = (field: keyof CompanyUpdate, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // ─── Render ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={16} /> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Información de la Empresa</h1>
        <p className="text-sm text-muted-foreground">Datos generales que se muestran en la página pública</p>
      </div>

      {/* Layout 2 columnas */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

        {/* ── Columna izquierda: Logo & Favicon ─────────────────────────── */}
        <div className="space-y-4">

          {/* Logo */}
          <div className="rounded-xl border-2 border-foreground/10 bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <ImageIcon size={16} className="text-primary" />
              <span className="text-sm font-semibold">Logo</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-foreground/10 bg-muted/30 overflow-hidden">
                {company?.logo_path ? (
                  <img src={`${API_BASE_URL}/${company.logo_path}`} alt="Logo" className="h-full w-full object-contain" />
                ) : (
                  <ImageIcon size={24} className="text-muted-foreground/40" />
                )}
              </div>
              <button
                onClick={() => logoInputRef.current?.click()}
                disabled={logoLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-foreground/10 px-3 py-2 text-xs font-semibold hover:border-primary/30 hover:text-primary transition-colors disabled:opacity-60"
              >
                {logoLoading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                {company?.logo_path ? "Cambiar logo" : "Subir logo"}
              </button>
              <input ref={logoInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.svg" className="hidden" onChange={handleLogoSelect} />
            </div>
          </div>

          {/* Favicon */}
          <div className="rounded-xl border-2 border-foreground/10 bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <ImageIcon size={16} className="text-primary" />
              <span className="text-sm font-semibold">Favicon</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-foreground/10 bg-muted/30 overflow-hidden">
                {company?.favicon_path ? (
                  <img src={`${API_BASE_URL}/${company.favicon_path}`} alt="Favicon" className="h-full w-full object-contain" />
                ) : (
                  <ImageIcon size={24} className="text-muted-foreground/40" />
                )}
              </div>
              <button
                onClick={() => faviconInputRef.current?.click()}
                disabled={faviconLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-foreground/10 px-3 py-2 text-xs font-semibold hover:border-primary/30 hover:text-primary transition-colors disabled:opacity-60"
              >
                {faviconLoading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                {company?.favicon_path ? "Cambiar favicon" : "Subir favicon"}
              </button>
              <input ref={faviconInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.ico,.svg" className="hidden" onChange={handleFaviconSelect} />
            </div>
          </div>

        </div>

        {/* ── Columna derecha: Tabs + Form ──────────────────────────────── */}
        <div>

      {/* Tabs */}
      <div className="mb-5 flex gap-2 border-b-2 border-foreground/10 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-0.5 ${
              tab === id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="rounded-xl border-2 border-foreground/10 bg-card p-6">

        {/* GENERAL */}
        {tab === "general" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Nombre *" value={form.nombre} onChange={(v) => setField("nombre", v)} placeholder="ATC Solutions Panama" />
            <Field label="Razón Social" value={form.razon_social} onChange={(v) => setField("razon_social", v)} placeholder="Tech Solutions S.A." />
            <Field label="RUC" value={form.ruc} onChange={(v) => setField("ruc", v)} placeholder="155-123-456" />
            <Field label="Horario de atención" value={form.horario_atencion} onChange={(v) => setField("horario_atencion", v)} placeholder="Lunes a Viernes 8am - 5pm" />
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lema</label>
              <textarea value={form.lema} onChange={(e) => setField("lema", e.target.value)} rows={2}
                className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none"
                placeholder="Innovación que transforma" />
            </div>
          </div>
        )}

        {/* CONTACTO */}
        {tab === "contacto" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Correo" value={form.correo} onChange={(v) => setField("correo", v)} placeholder="info@empresa.com" type="email" />
            <Field label="Teléfono" value={form.telefono} onChange={(v) => setField("telefono", v)} placeholder="+507 123-4567" />
            <Field label="WhatsApp" value={form.whatsapp} onChange={(v) => setField("whatsapp", v)} placeholder="+50712345678" />
            <Field label="Sitio Web" value={form.website} onChange={(v) => setField("website", v)} placeholder="https://empresa.com" />
          </div>
        )}

        {/* UBICACION */}
        {tab === "ubicacion" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dirección</label>
              <textarea value={form.direccion} onChange={(e) => setField("direccion", e.target.value)} rows={2}
                className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none"
                placeholder="Calle 50, Marbella" />
            </div>
            <Field label="Ciudad" value={form.ciudad} onChange={(v) => setField("ciudad", v)} placeholder="Ciudad de Panamá" />
            <Field label="URL de Google Maps" value={form.maps_url} onChange={(v) => setField("maps_url", v)} placeholder="https://maps.google.com/?q=..." />
          </div>
        )}

        {/* REDES SOCIALES */}
        {tab === "redes" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Facebook" value={form.facebook} onChange={(v) => setField("facebook", v)} placeholder="https://facebook.com/empresa" />
            <Field label="Instagram" value={form.instagram} onChange={(v) => setField("instagram", v)} placeholder="https://instagram.com/empresa" />
            <Field label="LinkedIn" value={form.linkedin} onChange={(v) => setField("linkedin", v)} placeholder="https://linkedin.com/company/empresa" />
            <Field label="Twitter / X" value={form.twitter} onChange={(v) => setField("twitter", v)} placeholder="https://twitter.com/empresa" />
            <Field label="YouTube" value={form.youtube} onChange={(v) => setField("youtube", v)} placeholder="https://youtube.com/@empresa" />
            <Field label="TikTok" value={form.tiktok} onChange={(v) => setField("tiktok", v)} placeholder="https://tiktok.com/@empresa" />
          </div>
        )}

      </div>

        </div>
        {/* fin columna derecha */}
      </div>
      {/* fin layout 2 columnas */}

      {/* Save bar */}
      <div className="mt-6 flex items-center justify-between">
        <div>
          {saveError && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle size={14} /> {saveError}
            </div>
          )}
          {saveSuccess && (
            <div className="flex items-center gap-2 text-sm text-green-500">
              <CheckCircle2 size={14} /> Cambios guardados exitosamente
            </div>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Guardar Cambios
        </button>
      </div>

    </div>
  );
};

// ─── Sub-componente Field ──────────────────────────────────────────────────────

const Field = ({ label, value, onChange, placeholder, type = "text" }: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) => (
  <div>
    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
    />
  </div>
);

export default AdminCompany;