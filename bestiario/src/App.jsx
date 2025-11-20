import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import CadastroMonstro from "./pages/CadastroMonstro";
import ListaMonstros from "./pages/ListaMonstros";
import CadastroTipo from "./pages/CadastroTipo";
import ListaTipos from "./pages/ListaTipos";
import CadastroPessoa from "./pages/CadastroPessoa";
import ListaPessoas from "./pages/ListaPessoas";

// Componente para redirecionar a rota raiz
function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Home /> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Rota raiz - redireciona para login se não autenticado */}
      <Route path="/" element={<RootRedirect />} />
      
      {/* Rota pública */}
      <Route path="/login" element={<Login />} />
      
      {/* Rotas protegidas - Home */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      
      {/* Rotas protegidas - Monstros */}
      <Route 
        path="/monstros" 
        element={
          <ProtectedRoute>
            <ListaMonstros />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/monstros/cadastro" 
        element={
          <ProtectedRoute>
            <CadastroMonstro />
          </ProtectedRoute>
        } 
      />
      
      {/* Rotas protegidas - Tipos */}
      <Route 
        path="/tipos" 
        element={
          <ProtectedRoute>
            <ListaTipos />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tipos/cadastro" 
        element={
          <ProtectedRoute>
            <CadastroTipo />
          </ProtectedRoute>
        } 
      />
      
      {/* Rotas protegidas - Usuários */}
      <Route 
        path="/usuarios" 
        element={
          <ProtectedRoute>
            <ListaPessoas />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/usuarios/cadastro" 
        element={
          <ProtectedRoute>
            <CadastroPessoa />
          </ProtectedRoute>
        } 
      />
      
      {/* Rota 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
