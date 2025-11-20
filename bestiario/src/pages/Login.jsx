import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handle(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      nav("/home"); // Redireciona para /home após login
    } catch (err) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
      <h1>Login - Bestiário</h1>
      <form onSubmit={handle}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: "100%", padding: "10px" }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </form>
      <p style={{ marginTop: "20px", textAlign: "center" }}>
        Não tem conta? <a href="/usuarios/cadastro">Cadastre-se</a>
      </p>
    </div>
  );
}
