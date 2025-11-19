export default function MonsterDisplay({ monster }) {
  if (!monster) {
    return (
      <div className="display empty">
        <h2>Selecione um monstro</h2>
      </div>
    );
  }

  return (
    <div className="display">
      <img className="monster-image" src={monster.image} alt={monster.name} />

      <h2>{monster.name}</h2>
      <p>{monster.description}</p>
    </div>
  );
}
