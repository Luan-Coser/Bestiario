import { useState, useEffect } from "react";
import { monsters, types } from "../api/api";
import { Link } from "react-router-dom";

export default function ListaMonstros() {
  const [list, setList] = useState([]);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setList(monsters.list());
  }

  function del(id) {
    if (!confirm("Excluir monstro?")) return;
    monsters.remove(id);
    refresh();
  }

  const typeMap = Object.fromEntries(types.list().map(t => [t.id, t.name]));

  return (
    <div>
      <h2>Monstros</h2>
      <div className="grid">
        {list.map(m => (
          <div className="card" key={m.id}>
            <img src={m.image || `https://via.placeholder.com/300x200?text=${encodeURIComponent(m.name)}`} alt={m.name} />
            <h3>{m.name}</h3>
            <p className="muted">{typeMap[m.typeId]}</p>
            <div className="card-actions">
              <Link to={`/cadastro-monstro?edit=${m.id}`} className="btn small">Editar</Link>
              <button className="btn small danger" onClick={() => del(m.id)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
