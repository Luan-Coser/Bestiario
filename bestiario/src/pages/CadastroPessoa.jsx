import { useState } from "react";
import { users } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CadastroPessoa() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      await users.create({ name, email, password });
      setMsg("Usuário criado com sucesso!");
      setTimeout(() => nav("/usuarios"), 1000);
    } catch (err) {
      setMsg(err.message || "Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Novo Usuário</h1>
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar"}
        </button>
        {msg && <p style={{ color: msg.includes("sucesso") ? "green" : "red" }}>{msg}</p>}
      </form>
    </div>
  );
}
