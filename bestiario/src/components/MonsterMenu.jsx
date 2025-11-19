export default function MonsterMenu({ monsters, onSelect }) {
  return (
    <div className="menu">
      {monsters.map((monster) => (
        <div
          key={monster.id}
          className="menu-item"
          onClick={() => onSelect(monster)}
        >
          <img src={monster.icon} alt={monster.name} />
          <p>{monster.name}</p>
        </div>
      ))}
    </div>
  );
}
