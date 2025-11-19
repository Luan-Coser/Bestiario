import { useState } from "react";
import { monsters as monApi } from "../api/api";

function MonsterMenu({ list, onSelect, active }) {
  return (
    <div className="menu-list">
      {list.map(m => (
        <div key={m.id} className={`menu-item ${active?.id === m.id ? "active" : ""}`} onClick={() => onSelect(m)}>
          <img src={m.image || `https://via.placeholder.com/80?text=${encodeURIComponent(m.name)}`} alt={m.name} />
          <div className="menu-item-name">{m.name}</div>
        </div>
      ))}
    </div>
  );
}

function MonsterPanel({ monster }) {
  if (!monster) return <div className="panel empty">Selecione um monstro à esquerda</div>;
  return (
    <div className="panel">
      <img className="panel-img" src={monster.image || `https://via.placeholder.com/600x400?text=${encodeURIComponent(monster.name)}`} alt={monster.name} />
      <h2>{monster.name}</h2>
      <p>{monster.description}</p>
    </div>
  );
}

export default function Home() {
  const list = monApi.list();
  const [active, setActive] = useState(list[0] || null);

  return (
    <div className="home">
      <aside className="left">
        <h3>Monstros</h3>
        <MonsterMenu list={list} onSelect={setActive} active={active} />
      </aside>

      <section className="right">
        <MonsterPanel monster={active} />
      </section>
    </div>
  );
}
