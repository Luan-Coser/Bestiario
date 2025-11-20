import { useState, useEffect } from "react";
import { monsters as monApi } from "../api/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function MonsterMenu({ list, onSelect, active }) {
  return (
    <div className="menu-list">
      {list.map(m => (
        <div 
          key={m.id} 
          className={`menu-item ${active?.id === m.id ? "active" : ""}`} 
          onClick={() => onSelect(m)}
        >
          <img 
            src={m.imagemUrl || `https://via.placeholder.com/80?text=${encodeURIComponent(m.nome)}`} 
            alt={m.nome} 
          />
          <div className="menu-item-name">{m.nome}</div>
        </div>
      ))}
    </div>
  );
}

function MonsterPanel({ monster }) {
  if (!monster) return <div className="panel empty">Selecione um monstro à esquerda</div>;

  return (
    <div className="panel">
      <img
        className="panel-img"
        src={monster.imagemUrl || `https://via.placeholder.com/600x400?text=${encodeURIComponent(monster.nome)}`}
        alt={monster.nome}
      />

      <h2>{monster.nome}</h2>

      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {monster.descricao || "Sem descrição"}
      </ReactMarkdown>
    </div>
  );
}

function Header() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  function handleLogout() {
    logout();
    nav("/login");
  }

  return (
    <header style={{ padding: "10px 20px", background: "#333", color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Bestiário</h2>
        <div>
          <span>Olá, {user?.username || "Usuário"}</span>
          {" | "}
          <a href="/monstros" style={{ color: "#fff", marginRight: "10px" }}>Gerenciar Monstros</a>
          {" | "}
          <a href="/tipos" style={{ color: "#fff", marginRight: "10px" }}>Tipos</a>
          {" | "}
          <button 
            onClick={handleLogout}
            style={{ 
              background: "#555", 
              color: "#fff", 
              border: "none", 
              padding: "5px 10px", 
              cursor: "pointer" 
            }}
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const [list, setList] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMonsters();
  }, []);

  async function loadMonsters() {
    setLoading(true);
    try {
      const data = await monApi.listAsync();
      setList(data);
      if (data.length > 0) {
        setActive(data[0]);
      }
    } catch (err) {
      console.error("Erro ao carregar monstros:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="home">
          <p>Carregando monstros...</p>
        </div>
      </>
    );
  }

  if (list.length === 0) {
    return (
      <>
        <Header />
        <div className="home" style={{ padding: "20px", textAlign: "center" }}>
          <p>Nenhum monstro cadastrado.</p>
          <a href="/monstros/cadastro">Cadastre um novo monstro</a>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="home">
        <aside className="left">
          <h3>Monstros</h3>
          <MonsterMenu list={list} onSelect={setActive} active={active} />
        </aside>

        <section className="right">
          <MonsterPanel monster={active} />
        </section>
      </div>
    </>
  );
}
