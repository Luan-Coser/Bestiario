import { useState, useEffect } from "react";
import { monsters, types } from "../api/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
export default function ListaMonstros() {
  const [list, setList] = useState([]);
  const [typeMap, setTypeMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    try {
      const [monsterList, typeList] = await Promise.all([
        monsters.listAsync(),
        types.listAsync()
      ]);
      
      setList(monsterList);
      setTypeMap(Object.fromEntries(typeList.map(t => [t.id, t.nome])));
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }

  async function del(id) {
    if (!confirm("Excluir monstro?")) return;
    
    try {
      await monsters.remove(id);
      refresh();
    } catch (err) {
      alert(err.message || "Erro ao deletar monstro");
    }
  }

  return (
    <>
      <Header />
      <div className="page-container">
        <h1>📖 Registro de Criaturas</h1>
        
        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <>
            <div className="actions">
              <Link to="/monstros/cadastro">
                <button>➕ Nova Criatura</button>
              </Link>
              <Link to="/home">
                <button style={{ background: "#8b6f47" }}>🏠 Voltar ao Bestiário</button>
              </Link>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Imagem</th>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", padding: "40px" }}>
                        Nenhuma criatura cadastrada
                      </td>
                    </tr>
                  ) : (
                    list.map((m) => (
                      <tr key={m.id}>
                        <td>
                          {m.imagemUrl && (
                            <img 
                              src={m.imagemUrl} 
                              alt={m.nome} 
                              style={{ width: 80, height: 80, objectFit: "cover", border: "2px solid var(--border)" }} 
                            />
                          )}
                        </td>
                        <td><strong>{m.nome}</strong></td>
                        <td>{typeMap[m.tipoId] || "N/A"}</td>
                        <td>
                          <Link to={`/monstros/cadastro?edit=${m.id}`}>
                            <button style={{ fontSize: "0.9rem", padding: "6px 12px" }}>✏️ Editar</button>
                          </Link>
                          {" "}
                          <button 
                            onClick={() => del(m.id)}
                            style={{ 
                              fontSize: "0.9rem", 
                              padding: "6px 12px", 
                              background: "var(--red-accent)",
                              borderColor: "#6b1414"
                            }}
                          >
                            🗑️ Deletar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
