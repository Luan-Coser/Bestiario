import { useState } from "react";
import { types } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CadastroTipo() {
  const [name, setName] = useState("");
  const nav = useNavigate();

  function submit(e) {
    e.preventDefault();
    types.create({ name });
    nav("/tipos");
  }

  return (
    <div className="form-card">
      <h2>Cadastrar Tipo</h2>
      <form onSubmit={submit}>
        <label>Nome do Tipo</label>
        <input value={name} onChange={e => setName(e.target.value)} />
        <button className="btn">Cadastrar</button>
      </form>
    </div>
  );
}
