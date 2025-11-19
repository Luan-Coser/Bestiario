import { useState, useEffect } from "react";
import { types, monsters } from "../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CadastroMonstro() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [typeId, setTypeId] = useState("");
  const [typeList, setTypeList] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  useEffect(() => {
    setTypeList(types.list());
    if (editId) {
      const m = monsters.get(editId);
      if (m) {
        setName(m.name);
        setImage(m.image);
        setDescription(m.description);
        setTypeId(m.typeId || "");
      }
    }
  }, [editId]);

  function submit(e) {
    e.preventDefault();
    try {
      if (editId) {
        monsters.update(editId, { name, image, description, typeId });
      } else {
        monsters.create({ name, image, description, typeId });
      }
      navigate("/monstros");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="form-card">
      <h2>{editId ? "Editar Monstro" : "Cadastrar Monstro"}</h2>
      <form onSubmit={submit}>
        <label>Nome</label>
        <input value={name} onChange={e => setName(e.target.value)} />
        <label>Imagem (URL)</label>
        <input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." />
        <label>Tipo</label>
        <select value={typeId} onChange={e => setTypeId(e.target.value)}>
          <option value="">-- nenhum --</option>
          {typeList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <label>Descrição</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
        <button className="btn">{editId ? "Salvar" : "Cadastrar"}</button>
      </form>
    </div>
  );
}
