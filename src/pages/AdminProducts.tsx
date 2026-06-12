import { useState, useEffect, useRef } from "react";
import {
  Plus, Search, Pencil, Trash2, Upload, X,
  Loader2, AlertCircle, Package, ImagePlus,
  ChevronLeft, ChevronRight, Tag
} from "lucide-react";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
  type Product,
  type ProductCreate,
  type ProductUpdate,
} from "@/lib/Productapi";
import { fetchCategories, type Category } from "@/lib/Categoriesapi";
import { API_BASE_URL } from "@/lib/Apiclient";

const ITEMS_PER_PAGE = 10;

const getToken = () => localStorage.getItem("atc_token") ?? "";

const emptyForm = (): ProductCreate => ({
  name: "", description: "", sku: "", price: 0,
  stock: 0, category_id: 0, features: "", specs: "",
});

// ─── Componente principal ─────────────────────────────────────────────────────

const AdminProducts = () => {
  const [products, setProducts]     = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab]   = useState<number | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [search, setSearch]         = useState("");
  const [page, setPage]             = useState(1);

  // Modales
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit]     = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showImage, setShowImage]   = useState(false);
  const [selected, setSelected]     = useState<Product | null>(null);

  // Formulario
  const [form, setForm]             = useState<ProductCreate>(emptyForm());
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError]   = useState<string | null>(null);

  // Imagen
  const [imageFile, setImageFile]     = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Load ───────────────────────────────────────────────────────────────────

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();

      // Cada fetch se maneja por separado para que un 404 (sin datos)
      // en uno no tumbe la carga del otro
      const productsRes = await fetchProducts(token).catch((err) => err.response?.data ?? null);
      const categoriesRes = await fetchCategories(token).catch((err) => err.response?.data ?? null);

      // Productos
      if (productsRes && Number(productsRes.http_code) === 200) {
        setProducts(productsRes.data);
      } else {
        setProducts([]); // 404 u otro código → sin productos, no es un error fatal
      }

      // Categorías
      if (categoriesRes && Number(categoriesRes.http_code) === 200) {
        setCategories(categoriesRes.data);
        if (categoriesRes.data.length > 0 && activeTab === null) {
          setActiveTab(categoriesRes.data[0].id);
        }
      } else {
        setCategories([]);
        setError("No se pudieron cargar las categorías. Crea una categoría primero.");
      }
    } catch {
      setError("No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ─── Filtros ─────────────────────────────────────────────────────────────────

  const tabProducts = products.filter((p) => p.category_id === activeTab);

  const filtered = tabProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages  = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated   = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  // Categoría con ID 1 = Infraestructura → vista tabla con imágenes
  // Cualquier otra categoría → vista cards
  const INFRA_CATEGORY_ID = 1;
  const isInfra = activeTab === INFRA_CATEGORY_ID;

  const handleSearch = (val: string) => { setSearch(val); setPage(1); };
  const handleTabChange = (id: number) => { setActiveTab(id); setSearch(""); setPage(1); };

  // ─── CRUD ────────────────────────────────────────────────────────────────────

  const handleCreate = async () => {
    if (!form.name || !form.sku || !form.category_id) {
      setFormError("Nombre, SKU y categoría son obligatorios."); return;
    }
    try {
      setFormLoading(true); setFormError(null);
      const res = await createProduct(getToken(), form);
      if (Number(res.http_code) === 201) {
        setShowCreate(false); setForm(emptyForm()); await loadData();
      } else { setFormError(res.message); }
    } catch { setFormError("Error al crear el producto."); }
    finally { setFormLoading(false); }
  };

  const handleEdit = async () => {
    if (!selected) return;
    const update: ProductUpdate = {
      name: form.name, description: form.description, sku: form.sku,
      price: form.price, stock: form.stock, category_id: form.category_id,
      features: form.features, specs: form.specs,
    };
    try {
      setFormLoading(true); setFormError(null);
      const res = await updateProduct(getToken(), selected.id, update);
      if (Number(res.http_code) === 200) {
        setShowEdit(false); setSelected(null); await loadData();
      } else { setFormError(res.message); }
    } catch { setFormError("Error al actualizar."); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      setFormLoading(true);
      await deleteProduct(getToken(), selected.id);
      setShowDelete(false); setSelected(null); await loadData();
    } catch { setFormError("Error al eliminar."); }
    finally { setFormLoading(false); }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!selected || !imageFile) return;
    try {
      setImageLoading(true);
      const res = await uploadProductImage(getToken(), selected.id, imageFile);
      if (Number(res.http_code) === 200) {
        setShowImage(false); setImageFile(null); setImagePreview(null); await loadData();
      }
    } catch { setFormError("Error al subir imagen."); }
    finally { setImageLoading(false); }
  };

  const handleImageDelete = async (product: Product) => {
    try { await deleteProductImage(getToken(), product.id); await loadData(); }
    catch { console.error("Error al eliminar imagen"); }
  };

  // ─── Modal helpers ───────────────────────────────────────────────────────────

  const openEdit = (p: Product) => {
    setSelected(p);
    setForm({
      name: p.name, description: p.description ?? "", sku: p.sku,
      price: p.price, stock: p.stock, category_id: p.category_id,
      features: p.features ?? "", specs: p.specs ?? "",
    });
    setFormError(null); setShowEdit(true);
  };

  const openDelete = (p: Product) => { setSelected(p); setShowDelete(true); };

  const openImage = (p: Product) => {
    setSelected(p); setImageFile(null); setImagePreview(null); setShowImage(true);
  };

  const openCreate = () => {
    setForm({ ...emptyForm(), category_id: activeTab ?? 0 });
    setFormError(null); setShowCreate(true);
  };

  const setField = (field: keyof ProductCreate, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Productos & Servicios</h1>
          <p className="text-sm text-muted-foreground">{products.length} registros en total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
        >
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && error && categories.length === 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {!loading && categories.length > 0 && (
        <>
          {/* Tabs dinámicos */}
          <div className="mb-5 flex gap-2 border-b-2 border-foreground/10 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleTabChange(cat.id)}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-0.5 ${
                  activeTab === cat.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Tag size={14} />
                {cat.name}
                <span className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                  activeTab === cat.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {products.filter((p) => p.category_id === cat.id).length}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="mb-4 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text" value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por nombre o SKU..."
              className="w-full rounded-lg border-2 border-foreground/10 bg-card pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* ── VISTA TABLA (infraestructura) ─────────────────────────────── */}
          {isInfra && (
            <>
              <div className="overflow-hidden rounded-xl border-2 border-foreground/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-foreground/10 bg-muted/50">
                      <th className="px-4 py-3 text-left font-semibold">Imagen</th>
                      <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                      <th className="px-4 py-3 text-left font-semibold">SKU</th>
                      <th className="px-4 py-3 text-left font-semibold">Precio</th>
                      <th className="px-4 py-3 text-left font-semibold">Stock</th>
                      <th className="px-4 py-3 text-left font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                          No hay productos en esta categoría.
                        </td>
                      </tr>
                    ) : (
                      paginated.map((p, i) => (
                        <tr key={p.id} className={`border-b border-foreground/5 transition-colors hover:bg-muted/30 ${i % 2 === 0 ? "bg-card" : "bg-muted/10"}`}>
                          <td className="px-4 py-3">
                            <div className="relative group w-10 h-10">
                              {p.image_path ? (
                                <>
                                  <img src={`${API_BASE_URL}/${p.image_path}`} alt={p.name}
                                    className="h-10 w-10 rounded-lg object-cover border border-foreground/10" />
                                  <button onClick={() => handleImageDelete(p)}
                                    className="absolute -top-1 -right-1 hidden group-hover:flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-white">
                                    <X size={10} />
                                  </button>
                                </>
                              ) : (
                                <button onClick={() => openImage(p)}
                                  className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-dashed border-foreground/20 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
                                  <ImagePlus size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium">{p.name}</td>
                          <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{p.sku}</td>
                          <td className="px-4 py-3">${p.price.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`font-semibold ${p.stock === 0 ? "text-destructive" : p.stock < 5 ? "text-yellow-500" : "text-green-500"}`}>
                              {p.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => openImage(p)} title="Imagen"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/10 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
                                <Upload size={14} />
                              </button>
                              <button onClick={() => openEdit(p)} title="Editar"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/10 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
                                <Pencil size={14} />
                              </button>
                              <button onClick={() => openDelete(p)} title="Eliminar"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/10 text-muted-foreground hover:border-destructive/30 hover:text-destructive transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>{filtered.length} resultados · Página {page} de {totalPages}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/10 disabled:opacity-40 hover:border-primary/30 transition-colors">
                      <ChevronLeft size={14} />
                    </button>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/10 disabled:opacity-40 hover:border-primary/30 transition-colors">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── VISTA CARDS (servicios / soluciones) ──────────────────────── */}
          {!isInfra && (
            <>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                  <Package size={32} className="text-muted-foreground/30" />
                  <p className="text-sm">No hay registros en esta categoría.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((p) => (
                    <div key={p.id} className="group rounded-xl border-2 border-foreground/10 bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md">

                      {/* Header card */}
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Package size={18} />
                        </div>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <button onClick={() => openEdit(p)} title="Editar"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-foreground/10 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => openDelete(p)} title="Eliminar"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-foreground/10 text-muted-foreground hover:border-destructive/30 hover:text-destructive transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <h3 className="mb-1 font-heading text-sm font-bold leading-snug">{p.name}</h3>
                      <p className="mb-3 text-xs text-muted-foreground line-clamp-2">{p.description}</p>

                      {/* Features preview */}
                      {p.features && (
                        <ul className="space-y-1">
                          {p.features.split(",").slice(0, 3).map((f) => (
                            <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <span className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                              {f.trim()}
                            </li>
                          ))}
                          {p.features.split(",").length > 3 && (
                            <li className="text-xs text-primary font-medium">
                              +{p.features.split(",").length - 3} más
                            </li>
                          )}
                        </ul>
                      )}

                      {/* SKU */}
                      <div className="mt-3 border-t border-foreground/5 pt-3">
                        <span className="font-mono text-xs text-muted-foreground">{p.sku}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ── MODAL CREAR ───────────────────────────────────────────────────────── */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nuevo Registro">
        <ProductForm form={form} setField={setField} categories={categories}
          error={formError} loading={formLoading} onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)} submitLabel="Crear" />
      </Modal>

      {/* ── MODAL EDITAR ──────────────────────────────────────────────────────── */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Editar Registro">
        <ProductForm form={form} setField={setField} categories={categories}
          error={formError} loading={formLoading} onSubmit={handleEdit}
          onCancel={() => setShowEdit(false)} submitLabel="Guardar Cambios" />
      </Modal>

      {/* ── MODAL ELIMINAR ────────────────────────────────────────────────────── */}
      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Eliminar Registro">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que deseas eliminar <span className="font-semibold text-foreground">{selected?.name}</span>? Esta acción no se puede deshacer.
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

      {/* ── MODAL IMAGEN ──────────────────────────────────────────────────────── */}
      <Modal open={showImage} onClose={() => setShowImage(false)} title="Subir Imagen">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Producto: <span className="font-semibold text-foreground">{selected?.name}</span>
          </p>
          <div onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-foreground/20 bg-muted/20 py-8 transition-colors hover:border-primary/40 hover:bg-primary/5">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="h-32 w-32 rounded-lg object-cover" />
            ) : (
              <>
                <Package size={32} className="text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Haz clic para seleccionar una imagen</p>
                <p className="text-xs text-muted-foreground/60">JPG, PNG, WEBP, GIF</p>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,.gif"
            className="hidden" onChange={handleImageSelect} />
          {imageFile && <p className="text-xs text-muted-foreground truncate">Archivo: {imageFile.name}</p>}
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowImage(false)} className="rounded-lg border-2 border-foreground/10 px-4 py-2 text-sm font-semibold hover:bg-muted/50 transition-colors">
              Cancelar
            </button>
            <button onClick={handleImageUpload} disabled={!imageFile || imageLoading}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60 hover:shadow-lg hover:shadow-primary/30 transition-all">
              {imageLoading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Subir Imagen
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
      <div className="w-full max-w-lg rounded-2xl border-2 border-foreground/10 bg-background shadow-2xl">
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

const ProductForm = ({ form, setField, categories, error, loading, onSubmit, onCancel, submitLabel }: {
  form: ProductCreate; setField: (f: keyof ProductCreate, v: string | number) => void;
  categories: Category[]; error: string | null; loading: boolean;
  onSubmit: () => void; onCancel: () => void; submitLabel: string;
}) => (
  <div className="space-y-4">
    {error && <ErrorBanner message={error} />}
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nombre *</label>
        <input value={form.name} onChange={(e) => setField("name", e.target.value)}
          className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
          placeholder="Nombre del producto o servicio" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">SKU *</label>
        <input value={form.sku} onChange={(e) => setField("sku", e.target.value)}
          className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
          placeholder="PROD-001" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categoría *</label>
        <select value={form.category_id} onChange={(e) => setField("category_id", Number(e.target.value))}
          className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50">
          <option value={0}>Seleccionar...</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Precio</label>
        <input type="number" value={form.price} onChange={(e) => setField("price", Number(e.target.value))}
          className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
          placeholder="0.00" min={0} step={0.01} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stock</label>
        <input type="number" value={form.stock} onChange={(e) => setField("stock", Number(e.target.value))}
          className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
          placeholder="0" min={0} />
      </div>
      <div className="col-span-2">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Descripción</label>
        <textarea value={form.description} onChange={(e) => setField("description", e.target.value)}
          rows={2} className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none"
          placeholder="Descripción" />
      </div>
      <div className="col-span-2">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Características <span className="normal-case font-normal text-muted-foreground/60">(separadas por coma)</span>
        </label>
        <textarea value={form.features} onChange={(e) => setField("features", e.target.value)}
          rows={2} className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none"
          placeholder="Característica 1,Característica 2" />
      </div>
      <div className="col-span-2">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Especificaciones <span className="normal-case font-normal text-muted-foreground/60">(Label:Valor, separados por coma)</span>
        </label>
        <textarea value={form.specs} onChange={(e) => setField("specs", e.target.value)}
          rows={2} className="w-full rounded-lg border-2 border-foreground/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none"
          placeholder="Procesador:Intel i7,RAM:16GB" />
      </div>
    </div>
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

export default AdminProducts;