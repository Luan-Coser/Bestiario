import { useState } from "react";
import { types } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CadastroTipo() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await types.create({ name, description });
      nav("/tipos");
    } catch (err) {
      setError(err.message || "Erro ao criar tipo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Novo Tipo</h1>
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
