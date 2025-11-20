import { useState, useEffect } from "react";
import { monsters, types } from "../api/api";
import { Link } from "react-router-dom";

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

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Monstros</h1>
      <Link to="/monstros/cadastro">Novo Monstro</Link>
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
          {list.map((m) => (
            <tr key={m.id}>
              <td>
                {m.imagemUrl && (
                  <img 
                    src={m.imagemUrl} 
                    alt={m.nome} 
                    style={{ width: 50, height: 50, objectFit: "cover" }} 
                  />
                )}
              </td>
              <td>{m.nome}</td>
              <td>{typeMap[m.tipoId] || "N/A"}</td>
              <td>
                <Link to={`/monstros/cadastro?edit=${m.id}`}>Editar</Link>
                {" | "}
                <button onClick={() => del(m.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
