import { useState, useEffect } from "react";
import { monsters as monApi, types } from "../api/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Barra vertical de ícones
function SidebarIcons({ monsters, active, setActive }) {
  return (
    <div className="home-sidebar-icons">
      {monsters.map((m) => (
        <img
          key={m.id}
          className={`monster-mini-icon${active?.id === m.id ? " selected" : ""}`}
          src={m.imagemUrl || `https://via.placeholder.com/80?text=${encodeURIComponent(m.nome)}`}
          alt={m.nome}
          title={m.nome}
          onClick={() => setActive(m)}
        />
      ))}
    </div>
  );
}

// Painel expandido do monstro selecionado
function MonsterPanel({ monster, tipoNome }) {
  if (!monster) return (
    <div className="home-monster-panel">
      <div className="monster-details-center" style={{color: "var(--gold-dark)"}}>
        <div style={{ fontSize: "1.1rem", marginTop: 100 }}>⚔️ Selecione um monstro à esquerda</div>
      </div>
    </div>
  );
  return (
    <div className="home-monster-panel">
      <div className="monster-details-center">
        <img
          className="monster-details-img"
          src={monster.imagemUrl || `https://via.placeholder.com/400x300?text=${encodeURIComponent(monster.nome)}`}
          alt={monster.nome}
        />
        <div className="monster-details-title">{monster.nome}</div>
        <div className="monster-details-type">{tipoNome}</div>
        <div className="monster-details-desc">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {monster.descricao || "_Sem descrição disponível_"}
          </ReactMarkdown>
        </div>
      </div>
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
          <button onClick={handleLogout}>🚪 Sair</button>
        </nav>
      </div>
    </header>
  );
}

export default function Home() {
  const [list, setList] = useState([]);
  const [typeMap, setTypeMap] = useState({});
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [monsterList, tipos] = await Promise.all([
        monApi.listAsync(),
        types.listAsync()
      ]);
      setTypeMap(Object.fromEntries(tipos.map(t => [t.id, t.nome])));
      setList(monsterList);
      if (monsterList.length > 0) setActive(monsterList[0]);
    } catch (err) {
      console.error("Erro ao carregar monstros/tipos:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading">📜 Carregando bestiário...</div>
      </>
    );
  }

  if (list.length === 0) {
    return (
      <>
        <Header />
        <div className="page-container" style={{ textAlign: "center" }}>
          <h1>Bestiário Vazio</h1>
          <p>Nenhuma criatura foi catalogada ainda.</p>
          <a href="/monstros/cadastro">
            <button>Adicionar Primeira Criatura</button>
          </a>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="home-bestiary-layout">
        <SidebarIcons monsters={list} active={active} setActive={setActive} />
        <MonsterPanel monster={active} tipoNome={active && typeMap[active.tipoId]} />
      </div>
    </>
  );
}
