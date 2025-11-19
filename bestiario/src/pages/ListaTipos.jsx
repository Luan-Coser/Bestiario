import { useState, useEffect } from "react";
import { types } from "../api/api";

export default function ListaTipos() {
  const [list, setList] = useState([]);

  useEffect(() => setList(types.list()), []);

  function del(id) {
    if (!confirm("Excluir tipo?")) return;
    types.remove(id);
    setList(types.list());
  }

  return (
    <div>
      <h2>Tipos</h2>
      <ul className="list">
        {list.map(t => (
          <li key={t.id}>
            {t.name}
            <button className="btn small danger" onClick={() => del(t.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
