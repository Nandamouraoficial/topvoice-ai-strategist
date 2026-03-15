import { useState } from "react";
import AdminPanel from "@/components/admin/AdminPanel";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = () => {
    // Mock: accept "admin123" as password
    if (password === "admin123") {
      setAuthenticated(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (authenticated) return <AdminPanel />;

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-8 max-w-sm w-full animate-scale-in">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center text-xl font-bold text-navy-950 mx-auto mb-4">
            TV
          </div>
          <h1 className="text-xl font-bold text-platinum">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Acesso restrito</p>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="Senha de administrador"
          className={`w-full px-4 py-3 rounded-xl bg-navy-800 border-2 text-platinum placeholder:text-muted-foreground/50
            focus:outline-none focus:border-blue-500 mb-4 ${error ? "border-destructive animate-shake" : "border-navy-700"}`}
        />
        {error && <p className="text-destructive text-xs mb-3 text-center">Senha incorreta</p>}
        <Button
          onClick={handleLogin}
          className="w-full py-5 rounded-pill gold-gradient text-navy-950 font-semibold border-0 hover:shadow-gold"
        >
          Entrar
        </Button>
      </div>
    </div>
  );
}
