import { useState, useEffect } from "react";
import {
  Plus, Pencil, Trash2, X, Loader2, AlertCircle,
  User as UserIcon, Mail, Shield, KeyRound, Users as UsersIcon, Eye, EyeOff
} from "lucide-react";
import {
  fetchUsers,
  registerUser,
  updateUser,
  deleteUser,
  resetPassword,
  type User,
  type UserCreate,
  type UserUpdate,
} from "@/lib/Usersapi";

const getToken = () => localStorage.getItem("atc_token") ?? "";

const getCurrentUsername = (): string | null => {
  const raw = localStorage.getItem("atc_user");
  if (!raw) return null;
  try { return JSON.parse(raw).username; } catch { return null; }
};

const emptyForm = (): UserCreate => ({
  username: "", name: "", email: "", password: "", role: "editor", status: "active",
});

// ─── Componente principal ─────────────────────────────────────────────────────

const AdminUsers = () => {
  const [users, setUsers]   = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);
  const currentUsername = getCurrentUsername();

  // Modales
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit]     = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showReset, setShowReset]   = useState(false);
  const [selected, setSelected]     = useState<User | null>(null);

  // Formularios
  const [form, setForm]             = useState<UserCreate>(emptyForm());
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError]   = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Reset password
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // ─── Load ───────────────────────────────────────────────────────────────────

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchUsers(getToken());
      if (Number(res.http_code) === 200) setUsers(res.data);
      else if (Number(res.http_code) === 404) setUsers([]);
      else setError(res.message);
    } catch {
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ─── CRUD ────────────────────────────────────────────────────────────────────

  const handleCreate = async () => {
    if (!form.username || !form.name || !form.password) {
      setFormError("Usuario, nombre y contraseña son obligatorios."); return;
    }
    try {
      setFormLoading(true); setFormError(null);
      const res = await registerUser(form);
      if (Number(res.http_code) === 201) {
        setShowCreate(false); setForm(emptyForm()); await loadData();
      } else { setFormError(res.message); }
    } catch { setFormError("Error al crear el usuario."); }
    finally { setFormLoading(false); }
  };

  const handleEdit = async () => {
    if (!selected) return;
    if (!form.username || !form.name) {
      setFormError("Usuario y nombre son obligatorios."); return;
    }
    const update: UserUpdate = {
      username: form.username, name: form.name, email: form.email,
      role: form.role, status: form.status,
    };
    try {
      setFormLoading(true); setFormError(null);
      const res = await updateUser(getToken(), selected.id, update);
      if (Number(res.http_code) === 200) {
        setShowEdit(false); setSelected(null); await loadData();
      } else { setFormError(res.message); }
    } catch { setFormError("Error al actualizar."); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      setFormLoading(true); setFormError(null);
      const res = await deleteUser(getToken(), selected.id);
      if (Number(res.http_code) === 200) {
        setShowDelete(false); setSelected(null); await loadData();
      } else { setFormError(res.message); }
    } catch { setFormError("Error al eliminar."); }
    finally { setFormLoading(false); }
  };

  const handleResetPassword = async () => {
    if (!selected) return;
    if (!newPassword || newPassword.length < 4) {
      setFormError("La contraseña debe tener al menos 4 caracteres."); return;
    }
    try {
      setFormLoading(true); setFormError(null);
      const res = await resetPassword(getToken(), selected.username, newPassword);
      if (Number(res.http_code) === 200) {
        setShowReset(false); setSelected(null); setNewPassword("");
      } else { setFormError(res.message); }
    } catch { setFormError("Error al actualizar la contraseña."); }
    finally { setFormLoading(false); }
  };

  // ─── Modal helpers ───────────────────────────────────────────────────────────

  const openCreate = () => {
    setForm(emptyForm()); setFormError(null); setShowPassword(false); setShowCreate(true);
  };

  const openEdit = (u: User) => {
    setSelected(u);
    setForm({
      username: u.username, name: u.name, email: u.email ?? "",
      password: "", role: u.role, status: u.status ?? "active",
    });
    setFormError(null); setShowEdit(true);
  };

  const openDelete = (u: User) => { setSelected(u); setFormError(null); setShowDelete(true); };

  const openReset = (u: User) => {
    setSelected(u); setNewPassword(""); setFormError(null); setShowNewPassword(false); setShowReset(true);
  };

  const setField = (field: keyof UserCreate, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Usuarios</h1>
          <p className="text-sm text-muted-foreground">{users.length} usuarios registrados</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
        >
          <Plus size={16} /> Nuevo Usuario
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && users.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
          <UsersIcon size={32} className="text-muted-foreground/30" />
          <p className="text-sm">No hay usuarios registrados.</p>
        </div>
      )}

      {/* Cards */}
      {!loading && !error && users.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((u) => {
            const isActive = (u.status ?? "active") === "active";
            const isAdmin = u.role === "admin";
            const isSelf = u.username === currentUsername;

            return (
              <div
                key={u.id}
                className={`group rounded-xl border-2 p-5 transition-all hover:shadow-md ${
                  isActive ? "border-foreground/10 bg-card hover:border-primary/20" : "border-foreground/5 bg-muted/30 opacity-60"
                }`}
              >
                {/* Header */}
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isAdmin ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <UserIcon size={18} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openReset(u)} title="Resetear contraseña"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-foreground/10 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
                      <KeyRound size={12} />
                    </button>
                    <button onClick={() => openEdit(u)} title="Editar"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-foreground/10 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => openDelete(u)} title="Eliminar" disabled={isSelf}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-foreground/10 text-muted-foreground hover:border-destructive/30 hover:text-destructive transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <h3 className="mb-0.5 font-heading text-base font-bold leading-snug">{u.name}</h3>
                <p className="mb-3 text-sm text-muted-foreground font-mono">@{u.username}</p>

                {u.email && (
                  <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail size={12} /> {u.email}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between border-t border-foreground/5 pt-3">
                  <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                    isAdmin ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    <Shield size={11} /> {u.role === "admin" ? "Administrador" : "Editor"}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isActive ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
                  }`}>
                    {isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>

                {isSelf && (
                  <p className="mt-2 text-center text-xs text-muted-foreground">Esta es tu cuenta</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL CREAR ───────────────────────────────────────────────────────── */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nuevo Usuario">
        <div className="space-y-4">
          {formError && <ErrorBanner message={formError} />}

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nombre completo *</label>
            <input value={form.name} onChange={(e) => setField("name", e.target.value)}
              className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
              placeholder="Ej: David Rosales" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Usuario *</label>
            <input value={form.username} onChange={(e) => setField("username", e.target.value)}
              className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
              placeholder="usuario.login" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Correo</label>
            <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)}
              className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
              placeholder="correo@ejemplo.com" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contraseña *</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setField("password", e.target.value)}
                className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 pr-10 text-sm outline-none focus:border-primary/50"
                placeholder="Contraseña" />
              <button type="button" onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rol</label>
            <select value={form.role} onChange={(e) => setField("role", e.target.value)}
              className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50">
              <option value="editor">Editor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowCreate(false)} className="rounded-lg border-2 border-foreground/10 px-4 py-2 text-sm font-semibold hover:bg-muted/50 transition-colors">
              Cancelar
            </button>
            <button onClick={handleCreate} disabled={formLoading}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60 hover:shadow-lg hover:shadow-primary/30 transition-all">
              {formLoading && <Loader2 size={14} className="animate-spin" />}
              Crear Usuario
            </button>
          </div>
        </div>
      </Modal>

      {/* ── MODAL EDITAR ──────────────────────────────────────────────────────── */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Editar Usuario">
        <div className="space-y-4">
          {formError && <ErrorBanner message={formError} />}

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nombre completo *</label>
            <input value={form.name} onChange={(e) => setField("name", e.target.value)}
              className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Usuario *</label>
            <input value={form.username} onChange={(e) => setField("username", e.target.value)}
              className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Correo</label>
            <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)}
              className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rol</label>
              <select value={form.role} onChange={(e) => setField("role", e.target.value)}
                className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50">
                <option value="editor">Editor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Estado</label>
              <select value={form.status} onChange={(e) => setField("status", e.target.value)}
                className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50">
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowEdit(false)} className="rounded-lg border-2 border-foreground/10 px-4 py-2 text-sm font-semibold hover:bg-muted/50 transition-colors">
              Cancelar
            </button>
            <button onClick={handleEdit} disabled={formLoading}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60 hover:shadow-lg hover:shadow-primary/30 transition-all">
              {formLoading && <Loader2 size={14} className="animate-spin" />}
              Guardar Cambios
            </button>
          </div>
        </div>
      </Modal>

      {/* ── MODAL ELIMINAR ────────────────────────────────────────────────────── */}
      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Eliminar Usuario">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que deseas eliminar a <span className="font-semibold text-foreground">{selected?.name}</span> (@{selected?.username})? Esta acción no se puede deshacer.
          </p>
          {formError && <ErrorBanner message={formError} />}
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowDelete(false)} className="rounded-lg border-2 border-foreground/10 px-4 py-2 text-sm font-semibold hover:bg-muted/50 transition-colors">
              Cancelar
            </button>
            <button onClick={handleDelete} disabled={formLoading}
              className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition-opacity">
              {formLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Eliminar
            </button>
          </div>
        </div>
      </Modal>

      {/* ── MODAL RESET PASSWORD ──────────────────────────────────────────────── */}
      <Modal open={showReset} onClose={() => setShowReset(false)} title="Restablecer Contraseña">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Nueva contraseña para <span className="font-semibold text-foreground">{selected?.name}</span> (@{selected?.username}).
          </p>
          {formError && <ErrorBanner message={formError} />}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nueva contraseña *</label>
            <div className="relative">
              <input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 pr-10 text-sm outline-none focus:border-primary/50"
                placeholder="Mínimo 4 caracteres" />
              <button type="button" onClick={() => setShowNewPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowReset(false)} className="rounded-lg border-2 border-foreground/10 px-4 py-2 text-sm font-semibold hover:bg-muted/50 transition-colors">
              Cancelar
            </button>
            <button onClick={handleResetPassword} disabled={formLoading}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60 hover:shadow-lg hover:shadow-primary/30 transition-all">
              {formLoading ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
              Actualizar Contraseña
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

// ─── Sub-componentes ──────────────────────────────────────────────────────────

const Modal = ({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl border-2 border-foreground/10 bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-foreground/10 px-6 py-4">
          <h2 className="font-heading text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

const ErrorBanner = ({ message }: { message: string }) => (
  <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
    <AlertCircle size={14} /> {message}
  </div>
);

export default AdminUsers;