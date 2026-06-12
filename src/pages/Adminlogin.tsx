import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Eye, EyeOff, Loader2 } from "lucide-react";
import { login } from "@/lib/Usersapi";



const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!username || !password) {
      setError("Por favor ingresa usuario y contraseña.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await login(username, password);

      if (Number(response.http_code) === 200) {
        // Guardar token y datos del usuario en localStorage
        localStorage.setItem("atc_token", response.data.access_token);
        localStorage.setItem("atc_user", JSON.stringify(response.data.user));
        navigate("/admin/dashboard");
      } else {
        setError("Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">

        {/* Logo / Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-primary/20 bg-primary/10 text-primary">
            <Bot size={28} />
          </div>
          <h1 className="font-heading text-2xl font-bold">ATC PRO INC</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ingresa tus credenciales para continuar</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border-2 border-foreground/10 bg-card p-8 shadow-sm">

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-semibold">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ingresa tu usuario"
              className="w-full rounded-lg border-2 border-foreground/10 bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-semibold">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ingresa tu contraseña"
                className="w-full rounded-lg border-2 border-foreground/10 bg-background px-4 py-2.5 pr-11 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          ATC Solutions · Panel Administrativo
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;