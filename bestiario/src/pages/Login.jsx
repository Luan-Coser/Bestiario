import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const [error, setError] = useState("");

  function handle(e) {
    e.preventDefault();
    try {
      login(email, password);
      nav("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="form-card">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handle}>
        <label>E-mail</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Senha</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn">Entrar</button>
      </form>
      <p className="muted">Teste: admin@local / admin</p>
    </div>
  );
}
