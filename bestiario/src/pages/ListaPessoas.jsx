import { useState, useEffect } from "react";
import { users } from "../api/api";

export default function ListaPessoas() {
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(users.list());
  }, []);

  function del(id) {
    if (!confirm("Excluir usuário?")) return;
    users.remove(id);
    setList(users.list());
  }

  return (
    <div>
      <h2>Pessoas</h2>
      <table className="table">
        <thead><tr><th>Nome</th><th>E-mail</th><th>Ações</th></tr></thead>
        <tbody>
          {list.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button className="btn small" onClick={() => navigator.clipboard.writeText(u.email)}>Copiar email</button>
                <button className="btn small danger" onClick={() => del(u.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
