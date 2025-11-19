import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CadastroMonstro from "./pages/CadastroMonstro";
import ListaMonstros from "./pages/ListaMonstros";
import CadastroPessoa from "./pages/CadastroPessoa";
import ListaPessoas from "./pages/ListaPessoas";
import CadastroTipo from "./pages/CadastroTipo";
import ListaTipos from "./pages/ListaTipos";
import Login from "./pages/Login.jsx";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">Bestiário MH</div>

        <nav className="topnav">
          <Link to="/">Home</Link>
          <Link to="/monstros">Monstros</Link>
          <Link to="/cadastro-monstro">Cadastrar Monstro</Link>
          <Link to="/tipos">Tipos</Link>
          <Link to="/cadastro-tipo">Cadastrar Tipo</Link>
          <Link to="/usuarios">Pessoas</Link>
          <Link to="/cadastro-pessoa">Cadastrar Pessoa</Link>
        </nav>

        <div className="auth-area">
          {user ? (
            <>
              <span className="user-label">Olá, {user.name}</span>
              <button className="btn small" onClick={logout}>Sair</button>
            </>
          ) : (
            <Link to="/login" className="btn small">Login</Link>
          )}
        </div>
      </header>

      <main className="main-area">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/cadastro-pessoa"
            element={
              <ProtectedRoute>
                <CadastroPessoa />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute>
                <ListaPessoas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cadastro-monstro"
            element={
              <ProtectedRoute>
                <CadastroMonstro />
              </ProtectedRoute>
            }
          />
          <Route
            path="/monstros"
            element={
              <ProtectedRoute>
                <ListaMonstros />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cadastro-tipo"
            element={
              <ProtectedRoute>
                <CadastroTipo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tipos"
            element={
              <ProtectedRoute>
                <ListaTipos />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
