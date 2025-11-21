import { useState } from "react";
import { users } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  function handleLogout() {
    logout();
    nav("/login");
  }

  return (
    <header>
      <div>
        <h2>
          <a href="/home">⚔️ BESTIÁRIO ⚔️</a>
        </h2>
        <nav>
          <a href="/home">🏠 Início</a>
          <a href="/monstros">🐉 Monstros</a>
          <a href="/tipos">🏷️ Tipos</a>
          <a href="/usuarios">👥 Usuários</a>
          
          <span className="divider">|</span>
          
          <div className="user-info">
            <span>👤 {user?.username || "Caçador"}</span>
          </div>
          
          <button onClick={handleLogout}>🚪 Sair</button>
        </nav>
      </div>
    </header>
  );
}
export default function CadastroPessoa() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      await users.create({ name, email, password });
      setMsg("Caçador registrado com sucesso!");
      setTimeout(() => nav("/usuarios"), 1000);
    } catch (err) {
      setMsg(err.message || "Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className="page-container">
        <h1>➕ Registrar Novo Caçador</h1>
        
        <form onSubmit={submit}>
          <label>Nome:</label>
          <input
            type="text"
            placeholder="Nome do caçador"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Senha:</label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit" disabled={loading} style={{ flex: 1 }}>
              {loading ? "Registrando..." : "💾 Registrar"}
            </button>
            <button 
              type="button" 
              onClick={() => nav("/usuarios")}
              style={{ flex: 1, background: "#8b6f47" }}
            >
              ❌ Cancelar
            </button>
          </div>

          {msg && (
            <p className={msg.includes("sucesso") ? "success" : "error"}>
              {msg}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
