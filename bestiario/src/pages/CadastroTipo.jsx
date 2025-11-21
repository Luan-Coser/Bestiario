import { useState } from "react";
import { types } from "../api/api";
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
export default function CadastroTipo() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await types.create({ name, description });
      nav("/tipos");
    } catch (err) {
      setError(err.message || "Erro ao criar tipo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className="page-container">
        <h1>➕ Novo Tipo de Criatura</h1>
        
        <form onSubmit={submit}>
          <label>Nome do Tipo:</label>
          <input
            type="text"
            placeholder="Ex: Dragão, Demônio, Morto-Vivo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Descrição:</label>
          <textarea
            placeholder="Descreva este tipo de criatura"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit" disabled={loading} style={{ flex: 1 }}>
              {loading ? "Salvando..." : "💾 Salvar"}
            </button>
            <button 
              type="button" 
              onClick={() => nav("/tipos")}
              style={{ flex: 1, background: "#8b6f47" }}
            >
              ❌ Cancelar
            </button>
          </div>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </>
  );
}
