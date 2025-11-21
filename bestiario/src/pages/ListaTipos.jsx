import { useState, useEffect } from "react";
import { types } from "../api/api";
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
export default function ListaTipos() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    try {
      const data = await types.listAsync();
      setList(data);
    } catch (err) {
      console.error("Erro ao carregar tipos:", err);
    } finally {
      setLoading(false);
    }
  }

  async function del(id) {
    if (!confirm("Excluir tipo?")) return;
    
    try {
      await types.remove(id);
      refresh();
    } catch (err) {
      alert(err.message || "Erro ao deletar tipo");
    }
  }

  return (
    <>
      <Header />
      <div className="page-container">
        <h1>🏷️ Tipos de Criaturas</h1>
        
        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <>
            <div className="actions">
              <Link to="/tipos/cadastro">
                <button>➕ Novo Tipo</button>
              </Link>
              <Link to="/home">
                <button style={{ background: "#8b6f47" }}>🏠 Voltar</button>
              </Link>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center", padding: "40px" }}>
                        Nenhum tipo cadastrado
                      </td>
                    </tr>
                  ) : (
                    list.map((t) => (
                      <tr key={t.id}>
                        <td><strong>{t.nome}</strong></td>
                        <td>{t.descricao || "—"}</td>
                        <td>
                          <button 
                            onClick={() => del(t.id)}
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
