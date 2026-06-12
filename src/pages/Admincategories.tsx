import { useState, useEffect } from "react";
import {
  Plus, Pencil, Trash2, X, Loader2, AlertCircle,
  Tag, Package, ToggleLeft, ToggleRight, FolderOpen
} from "lucide-react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  type Category,
  type CategoryCreate,
  type CategoryUpdate,
} from "@/lib/Categoriesapi";

const getToken = () => localStorage.getItem("atc_token") ?? "";

const emptyForm = (): CategoryCreate => ({
  name: "", description: "", tipo: "", active: true,
});

// ─── Componente principal ─────────────────────────────────────────────────────

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  // Modales
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit]     = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected]     = useState<Category | null>(null);

  // Formulario
  const [form, setForm]             = useState<CategoryCreate>(emptyForm());
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError]   = useState<string | null>(null);

  // ─── Load ───────────────────────────────────────────────────────────────────

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchCategories(getToken());
      if (Number(res.http_code) === 200) setCategories(res.data);
      else if (Number(res.http_code) === 404) setCategories([]);
      else setError(res.message);
    } catch {
      setError("No se pudieron cargar las categorías.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ─── CRUD ────────────────────────────────────────────────────────────────────

  const handleCreate = async () => {
    if (!form.name || !form.tipo) {
      setFormError("Nombre y tipo son obligatorios."); return;
    }
    try {
      setFormLoading(true); setFormError(null);
      const res = await createCategory(getToken(), form);
      if (Number(res.http_code) === 201) {
        setShowCreate(false); setForm(emptyForm()); await loadData();
      } else { setFormError(res.message); }
    } catch { setFormError("Error al crear la categoría."); }
    finally { setFormLoading(false); }
  };

  const handleEdit = async () => {
    if (!selected) return;
    if (!form.name || !form.tipo) {
      setFormError("Nombre y tipo son obligatorios."); return;
    }
    const update: CategoryUpdate = {
      name: form.name, description: form.description, tipo: form.tipo, active: form.active,
    };
    try {
      setFormLoading(true); setFormError(null);
      const res = await updateCategory(getToken(), selected.id, update);
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
      const res = await deleteCategory(getToken(), selected.id);
      if (Number(res.http_code) === 200) {
        setShowDelete(false); setSelected(null); await loadData();
      } else { setFormError(res.message); }
    } catch { setFormError("Error al eliminar."); }
    finally { setFormLoading(false); }
  };

  const handleToggleStatus = async (cat: Category) => {
    try {
      await toggleCategoryStatus(getToken(), cat.id);
      await loadData();
    } catch { console.error("Error al cambiar estado"); }
  };

  // ─── Modal helpers ───────────────────────────────────────────────────────────

  const openCreate = () => { setForm(emptyForm()); setFormError(null); setShowCreate(true); };

  const openEdit = (cat: Category) => {
    setSelected(cat);
    setForm({
      name: cat.name, description: cat.description ?? "", tipo: cat.tipo, active: cat.active,
    });
    setFormError(null); setShowEdit(true);
  };

  const openDelete = (cat: Category) => {
    setSelected(cat); setFormError(null); setShowDelete(true);
  };

  const setField = (field: keyof CategoryCreate, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Categorías</h1>
          <p className="text-sm text-muted-foreground">{categories.length} categorías registradas</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
        >
          <Plus size={16} /> Nueva Categoría
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
      {!loading && !error && categories.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
          <FolderOpen size={32} className="text-muted-foreground/30" />
          <p className="text-sm">No hay categorías registradas.</p>
        </div>
      )}

      {/* Cards */}
      {!loading && !error && categories.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`group rounded-xl border-2 p-5 transition-all hover:shadow-md ${
                cat.active
                  ? "border-foreground/10 bg-card hover:border-primary/20"
                  : "border-foreground/5 bg-muted/30 opacity-60"
              }`}
            >
              {/* Header */}
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Tag size={18} />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleStatus(cat)}
                    title={cat.active ? "Desactivar" : "Activar"}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {cat.active ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} />}
                  </button>
                  <button onClick={() => openEdit(cat)} title="Editar"
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-foreground/10 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => openDelete(cat)} title="Eliminar"
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-foreground/10 text-muted-foreground hover:border-destructive/30 hover:text-destructive transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <h3 className="mb-1 font-heading text-base font-bold leading-snug">{cat.name}</h3>
              {cat.description && (
                <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
              )}

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between border-t border-foreground/5 pt-3">
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {cat.tipo}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Package size={12} />
                  {cat.products_count ?? 0} {cat.products_count === 1 ? "producto" : "productos"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODAL CREAR ───────────────────────────────────────────────────────── */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nueva Categoría">
        <CategoryForm form={form} setField={setField} error={formError} loading={formLoading}
          onSubmit={handleCreate} onCancel={() => setShowCreate(false)} submitLabel="Crear Categoría" showActive={false} />
      </Modal>

      {/* ── MODAL EDITAR ──────────────────────────────────────────────────────── */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Editar Categoría">
        <CategoryForm form={form} setField={setField} error={formError} loading={formLoading}
          onSubmit={handleEdit} onCancel={() => setShowEdit(false)} submitLabel="Guardar Cambios" showActive />
      </Modal>

      {/* ── MODAL ELIMINAR ────────────────────────────────────────────────────── */}
      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Eliminar Categoría">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que deseas eliminar <span className="font-semibold text-foreground">{selected?.name}</span>?
          </p>
          {selected && (selected.products_count ?? 0) > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-600">
              <AlertCircle size={14} />
              Esta categoría tiene {selected.products_count} producto(s) asociado(s). No podrá eliminarse hasta reasignarlos.
            </div>
          )}
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

const CategoryForm = ({ form, setField, error, loading, onSubmit, onCancel, submitLabel, showActive }: {
  form: CategoryCreate;
  setField: (field: keyof CategoryCreate, value: string | boolean) => void;
  error: string | null;
  loading: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
  showActive: boolean;
}) => (
  <div className="space-y-4">
    {error && <ErrorBanner message={error} />}

    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nombre *</label>
      <input value={form.name} onChange={(e) => setField("name", e.target.value)}
        className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
        placeholder="Ej: Servidores Empresariales" />
    </div>

    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Tipo * <span className="normal-case font-normal text-muted-foreground/60">(texto libre, ej: infraestructura, software)</span>
      </label>
      <input value={form.tipo} onChange={(e) => setField("tipo", e.target.value)}
        className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
        placeholder="infraestructura" />
    </div>

    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Descripción</label>
      <textarea value={form.description} onChange={(e) => setField("description", e.target.value)}
        rows={3} className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none"
        placeholder="Descripción de la categoría" />
    </div>

    {showActive && (
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.active} onChange={(e) => setField("active", e.target.checked)}
          className="h-4 w-4 rounded border-2 border-foreground/20 accent-primary" />
        <span className="text-sm font-medium">Categoría activa</span>
      </label>
    )}

    <div className="flex justify-end gap-3 pt-2">
      <button onClick={onCancel} className="rounded-lg border-2 border-foreground/10 px-4 py-2 text-sm font-semibold hover:bg-muted/50 transition-colors">
        Cancelar
      </button>
      <button onClick={onSubmit} disabled={loading}
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60 hover:shadow-lg hover:shadow-primary/30 transition-all">
        {loading && <Loader2 size={14} className="animate-spin" />}
        {submitLabel}
      </button>
    </div>
  </div>
);

export default AdminCategories;