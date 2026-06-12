import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tag,
  Users,
  Building2,
  LogOut,
  Menu,
  X,
  Bot,
  TrendingUp,
  AlertTriangle,
  ShoppingBag,
  FolderOpen,
} from "lucide-react";
import AdminProducts from "@/pages/AdminProducts.tsx";
import AdminCategories from "./Admincategories";
import AdminUsers from "./Adminusers";
import AdminCompany from "./Admincompany";


// ─── Types ────────────────────────────────────────────────────────────────────

type Section = "dashboard" | "products" | "categories" | "users" | "company";

interface NavItem {
  id: Section;
  label: string;
  icon: React.ElementType;
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { id: "products",    label: "Productos",   icon: Package },
  { id: "categories",  label: "Categorías",  icon: Tag },
  { id: "users",       label: "Usuarios",    icon: Users },
  { id: "company",     label: "Empresa",     icon: Building2 },
];

// ─── Componente principal ─────────────────────────────────────────────────────

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("atc_token");
    if (!token) { navigate("/admin/login"); return; }
    const raw = localStorage.getItem("atc_user");
    if (raw) setUser(JSON.parse(raw));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("atc_token");
    localStorage.removeItem("atc_user");
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`flex flex-col border-r-2 border-foreground/10 bg-card transition-all duration-300 ${sidebarOpen ? "w-60" : "w-16"}`}>

        {/* Logo */}
        <div className="flex h-16 items-center border-b-2 border-foreground/10 px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Bot size={18} />
          </div>
          {sidebarOpen && (
            <span className="ml-3 font-heading text-sm font-bold truncate">ATC Admin</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                section === id
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && <span className="truncate">{label}</span>}
            </button>
          ))}
        </nav>

        {/* User info */}
        {sidebarOpen && user && (
          <div className="border-t border-foreground/10 px-4 py-3">
            <p className="text-xs font-semibold truncate">{user.username}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        )}
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b-2 border-foreground/10 bg-card px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
            <h1 className="font-heading text-base font-bold">
              {NAV_ITEMS.find((n) => n.id === section)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden sm:block text-sm text-muted-foreground">
                Hola, <span className="font-semibold text-foreground">{user.username}</span>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-foreground/10 px-3 py-1.5 text-sm text-muted-foreground hover:border-destructive/30 hover:text-destructive transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:block">Cerrar sesión</span>
            </button>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto">
          {section === "dashboard"  && <DashboardHome />}
          {section === "products"   && <AdminProducts />}
          {section === "categories" && <AdminCategories />}
          {section === "users" && <AdminUsers />}
          {section === "company" && <AdminCompany />}
        </main>

      </div>
    </div>
  );
};

// ─── Dashboard Home (métricas dummy) ─────────────────────────────────────────

const DashboardHome = () => {
  const metrics = [
    { label: "Productos",  value: "24", icon: Package,     color: "text-blue-500",   bg: "bg-blue-500/10"   },
    { label: "Servicios",  value: "8",  icon: ShoppingBag, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Categorías", value: "5",  icon: FolderOpen,  color: "text-green-500",  bg: "bg-green-500/10"  },
    { label: "Usuarios",   value: "3",  icon: Users,       color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  const alerts = [
    { name: "QNAP TS-h686 NAS",     stock: 0, alert: "CRÍTICO" },
    { name: "Switch Cisco SG350",   stock: 2, alert: "BAJO"    },
    { name: "UPS APC Smart 1500VA", stock: 1, alert: "BAJO"    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-xl border-2 border-foreground/10 bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{label}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
                <Icon size={18} className={color} />
              </div>
            </div>
            <p className="font-heading text-3xl font-bold">{value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-green-500">
              <TrendingUp size={12} /> Demo
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border-2 border-foreground/10 bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-yellow-500" />
          <h2 className="font-heading text-base font-bold">Stock Bajo</h2>
          <span className="ml-auto rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-semibold text-yellow-500">Demo</span>
        </div>
        <div className="space-y-2">
          {alerts.map((a) => (
            <div key={a.name} className="flex items-center justify-between rounded-lg border border-foreground/5 bg-muted/30 px-4 py-3">
              <span className="text-sm font-medium">{a.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Stock: <span className="font-semibold">{a.stock}</span></span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  a.alert === "CRÍTICO" ? "bg-destructive/10 text-destructive" : "bg-yellow-500/10 text-yellow-500"
                }`}>
                  {a.alert}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Coming Soon ──────────────────────────────────────────────────────────────

const ComingSoon = ({ label, icon: Icon }: { label: string; icon: React.ElementType }) => (
  <div className="flex h-full flex-col items-center justify-center gap-4 py-32 text-muted-foreground">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-foreground/10">
      <Icon size={28} className="text-muted-foreground/40" />
    </div>
    <div className="text-center">
      <p className="font-heading text-lg font-semibold text-foreground">{label}</p>
      <p className="text-sm">Esta sección está en construcción.</p>
    </div>
  </div>
);

export default AdminDashboard;