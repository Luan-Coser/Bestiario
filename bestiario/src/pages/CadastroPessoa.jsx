import { useState } from "react";
import { users } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CadastroPessoa() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const [msg, setMsg] = useState("");

  function submit(e) {
    e.preventDefault();
    try {
      users.create({ name, email, password });
      setMsg("Usuário criado.");
      setTimeout(() => nav("/usuarios"), 600);
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div className="form-card">
      <h2>Cadastrar Pessoa</h2>
      {msg && <div className="info">{msg}</div>}
      <form onSubmit={submit}>
        <label>Nome</label>
        <input value={name} onChange={e => setName(e.target.value)} />
        <label>E-mail</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
        <label>Senha</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn">Cadastrar</button>
      </form>
    </div>
  );
}
