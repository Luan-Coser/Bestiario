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
      nav("/home");
    } catch (err) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <h1>⚔️ Bestiário ⚔️</h1>
      <p style={{ textAlign: "center", marginBottom: "30px", fontStyle: "italic" }}>
        Entre para acessar o compêndio de criaturas
      </p>
      <form onSubmit={handle}>
        <input
          type="email"
          placeholder="Email do Caçador"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha Secreta"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Acessando..." : "Entrar"}
        </button>
        {error && <p className="error" style={{ marginTop: "15px" }}>{error}</p>}
      </form>
    </div>
  );
}
