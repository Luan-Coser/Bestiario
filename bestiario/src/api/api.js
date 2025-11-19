// simples mock que persiste em localStorage
const KEY_USERS = "bestiario_users_v1";
const KEY_MONSTERS = "bestiario_monsters_v1";
const KEY_TYPES = "bestiario_types_v1";

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,8);

// inicializa se vazio
function initIfEmpty() {
  if (!localStorage.getItem(KEY_USERS)) {
    const admin = { id: "u_admin", name: "Admin", email: "admin@local", passwordHash: "admin" };
    localStorage.setItem(KEY_USERS, JSON.stringify([admin]));
  }
  if (!localStorage.getItem(KEY_TYPES)) {
    const t = [
      { id: "t1", name: "Flying Wyvern" },
      { id: "t2", name: "Fanged Wyvern" }
    ];
    localStorage.setItem(KEY_TYPES, JSON.stringify(t));
  }
  if (!localStorage.getItem(KEY_MONSTERS)) {
    const m = [
      { id: "m1", name: "Rathalos", typeId: "t1", image: "https://via.placeholder.com/400x300?text=Rathalos", description: "Rei dos céus, fogo." },
      { id: "m2", name: "Zinogre", typeId: "t2", image: "https://via.placeholder.com/400x300?text=Zinogre", description: "Lobo do trovão." }
    ];
    localStorage.setItem(KEY_MONSTERS, JSON.stringify(m));
  }
}
initIfEmpty();

/* USERS */
export const users = {
  list: () => JSON.parse(localStorage.getItem(KEY_USERS) || "[]"),
  create: (u) => {
    const arr = users.list();
    const exists = arr.find(x => x.email === u.email);
    if (exists) throw new Error("Email já cadastrado");
    const novo = { id: uid(), name: u.name, email: u.email, passwordHash: u.password }; // backend: hash
    arr.push(novo);
    localStorage.setItem(KEY_USERS, JSON.stringify(arr));
    return novo;
  },
  update: (id, payload) => {
    const arr = users.list();
    const idx = arr.findIndex(x => x.id === id);
    if (idx === -1) throw new Error("Usuário não encontrado");
    arr[idx] = { ...arr[idx], ...payload };
    localStorage.setItem(KEY_USERS, JSON.stringify(arr));
    return arr[idx];
  },
  remove: (id) => {
    let arr = users.list();
    arr = arr.filter(x => x.id !== id);
    localStorage.setItem(KEY_USERS, JSON.stringify(arr));
  },
  login: (email, password) => {
    const arr = users.list();
    const u = arr.find(x => x.email === email && x.passwordHash === password);
    if (!u) throw new Error("Credenciais inválidas");
    // fake token
    return { token: "fake-jwt-" + uid(), user: { id: u.id, name: u.name, email: u.email } };
  }
};

/* TYPES */
export const types = {
  list: () => JSON.parse(localStorage.getItem(KEY_TYPES) || "[]"),
  create: (t) => {
    const arr = types.list();
    const novo = { id: uid(), name: t.name };
    arr.push(novo);
    localStorage.setItem(KEY_TYPES, JSON.stringify(arr));
    return novo;
  },
  update: (id, payload) => {
    const arr = types.list();
    const idx = arr.findIndex(x => x.id === id);
    if (idx === -1) throw new Error("Tipo não encontrado");
    arr[idx] = { ...arr[idx], ...payload };
    localStorage.setItem(KEY_TYPES, JSON.stringify(arr));
    return arr[idx];
  },
  remove: (id) => {
    let arr = types.list();
    arr = arr.filter(x => x.id !== id);
    localStorage.setItem(KEY_TYPES, JSON.stringify(arr));
  }
};

/* MONSTERS */
export const monsters = {
  list: () => JSON.parse(localStorage.getItem(KEY_MONSTERS) || "[]"),
  create: (m) => {
    const arr = monsters.list();
    const novo = { id: uid(), ...m };
    arr.push(novo);
    localStorage.setItem(KEY_MONSTERS, JSON.stringify(arr));
    return novo;
  },
  update: (id, payload) => {
    const arr = monsters.list();
    const idx = arr.findIndex(x => x.id === id);
    if (idx === -1) throw new Error("Monstro não encontrado");
    arr[idx] = { ...arr[idx], ...payload };
    localStorage.setItem(KEY_MONSTERS, JSON.stringify(arr));
    return arr[idx];
  },
  remove: (id) => {
    let arr = monsters.list();
    arr = arr.filter(x => x.id !== id);
    localStorage.setItem(KEY_MONSTERS, JSON.stringify(arr));
  },
  get: (id) => monsters.list().find(x => x.id === id)
};
