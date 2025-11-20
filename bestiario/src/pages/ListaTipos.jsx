import { useState, useEffect } from "react";
import { types } from "../api/api";
import { Link } from "react-router-dom";

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

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Tipos</h1>
      <Link to="/tipos/cadastro">Novo Tipo</Link>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {list.map((t) => (
            <tr key={t.id}>
              <td>{t.nome}</td>
              <td>{t.descricao}</td>
              <td>
                <button onClick={() => del(t.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
