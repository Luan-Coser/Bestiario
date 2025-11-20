import { useState, useEffect } from "react";
import { types, monsters } from "../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CadastroMonstro() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [typeId, setTypeId] = useState("");
  const [typeList, setTypeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  useEffect(() => {
    loadData();
  }, [editId]);

  async function loadData() {
    try {
      const tiposData = await types.listAsync();
      setTypeList(tiposData);

      if (editId) {
        const m = monsters.get(editId);
        if (m) {
          setName(m.nome || "");
          setImage(m.imagemUrl || "");
          setDescription(m.descricao || "");
          setTypeId(m.tipoId ? String(m.tipoId) : "");
        }
      }
    } catch (err) {
      setError("Erro ao carregar dados");
    }
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!typeId) {
      setError("Selecione um tipo");
      setLoading(false);
      return;
    }

    try {
      const data = { name, image, description, typeId };
      
      if (editId) {
        await monsters.update(editId, data);
      } else {
        await monsters.create(data);
      }
      
      navigate("/monstros");
    } catch (err) {
      setError(err.message || "Erro ao salvar monstro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>{editId ? "Editar Monstro" : "Novo Monstro"}</h1>
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="URL da Imagem"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        <select
          value={typeId}
          onChange={(e) => setTypeId(e.target.value)}
          required
        >
          <option value="">Selecione um tipo</option>
          {typeList.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
