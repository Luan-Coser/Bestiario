import { useState, useEffect } from "react";
import { types, monsters } from "../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
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
export default function CadastroMonstro() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [typeId, setTypeId] = useState("");
  const [typeList, setTypeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  useEffect(() => {
    loadData();
  }, [editId]);

  async function loadData() {
    try {
      const tiposData = await types.listAsync();
      setTypeList(tiposData);

      if (editId) {
        const m = monsters.get(editId);
        if (m) {
          setName(m.nome || "");
          setImage(m.imagemUrl || "");
          setDescription(m.descricao || "");
          setTypeId(m.tipoId ? String(m.tipoId) : "");
        }
      }
    } catch (err) {
      setError("Erro ao carregar dados");
    }
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!typeId) {
      setError("Selecione um tipo");
      setLoading(false);
      return;
    }

    try {
      const data = { name, image, description, typeId };
      
      if (editId) {
        await monsters.update(editId, data);
      } else {
        await monsters.create(data);
      }
      
      navigate("/monstros");
    } catch (err) {
      setError(err.message || "Erro ao salvar monstro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className="page-container">
        <h1>{editId ? "✏️ Editar Criatura" : "➕ Nova Criatura"}</h1>
        
        <form onSubmit={submit}>
          <label>Nome da Criatura:</label>
          <input
            type="text"
            placeholder="Ex: Rathalos"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>URL da Imagem:</label>
          <input
            type="text"
            placeholder="https://exemplo.com/imagem.jpg"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <label>Tipo:</label>
          <select
            value={typeId}
            onChange={(e) => setTypeId(e.target.value)}
            required
          >
            <option value="">Selecione um tipo</option>
            {typeList.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>

          <label>Descrição:</label>
          <textarea
            placeholder="Descreva a criatura (suporta Markdown)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit" disabled={loading} style={{ flex: 1 }}>
              {loading ? "Salvando..." : editId ? "💾 Atualizar" : "💾 Salvar"}
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/monstros")}
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
