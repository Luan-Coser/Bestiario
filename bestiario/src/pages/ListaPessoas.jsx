import { useState, useEffect } from "react";
import { users } from "../api/api";
import { Link } from "react-router-dom";

export default function ListaPessoas() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    try {
      const data = await users.list();
      setList(data);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    } finally {
      setLoading(false);
    }
  }

  async function del(id) {
    if (!confirm("Excluir usuário?")) return;
    
    try {
      await users.remove(id);
      refresh();
    } catch (err) {
      alert(err.message || "Erro ao deletar usuário");
    }
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Usuários</h1>
      <Link to="/usuarios/cadastro">Novo Usuário</Link>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {list.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <button onClick={() => del(u.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
