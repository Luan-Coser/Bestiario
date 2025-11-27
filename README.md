# Bestiário Digital

## 1. Descrição geral do projeto

Este repositorio contem uma web full stack desenvolvido para a aula de Desenvolvimento Web do curso de Ciencias da computação do IFSC.
Ele se baseia no bestiario presente na franquia de jogos Monster Hunter

Ela permite que usuários façam login e gerenciem:

- Tipos de monstros (ex.: Dragão, Wyvern, Fera).
- Monstros (nome, tipo, imagem, descrição em Markdown).
- Usuários (lista de caçadores cadastrados).

A aplicação é composta por:

- **Backend:** API REST em ASP.NET Core, com Entity Framework Core e PostgreSQL.
- **Frontend:** SPA em React (Vite), consumindo a API via Axios.
- **Autenticação:** JWT (JSON Web Token), com proteção de rotas no backend e no frontend.

---

## 2. Tecnologias utilizadas

**As tecnologias ultilizadas para o Backend foram**

- ASP.NET Core Web API  
- Entity Framework Core (Code First + Migrations)  
- PostgreSQL  
- Autenticação JWT  
- Swagger para documentação da API  

**As tecnologias ultilizadas para o Frontend foram**

- React com Vite  
- React Router  
- Axios  
- Context API para autenticação  
- CSS customizado

---

## 3. Funcionalidades implementadas

### 3.1 Autenticação e usuários

- Cadastro de usuário via API.  
- Login com email e senha.  
- Geração de token JWT no backend.  
- Armazenamento do token e dados do usuário no navegador.  
- Logout com limpeza do token.  
- Listagem de usuários e exclusão via interface.  

### 3.2 Tipos de monstros

- CRUD completo de Tipos

### 3.3 Monstros

- CRUD completo de Monstros:

### 3.4 Proteção de rotas

- Endpoints sensíveis protegidos com `[Authorize]` no backend.  
- Frontend redireciona para `/login` se não houver token ou se a API retornar 401.

---

## 4. Arquitetura e organização

## Principais endpoints da API

### Autenticação (`/api/auth`)
- **POST `/api/auth/register`**  
  Cadastra um novo usuário (username, email, password) e retorna token + dados do usuário.

- **POST `/api/auth/login`**  
  Realiza login com email e senha. Retorna token JWT e dados do usuário.

- **POST `/api/auth/authSeed`**  
  Cria um usuario padrão para poder interagir com o sistema.
---

### Usuários (`/api/users`)

- **GET `/api/users`**  
  Lista todos os usuários cadastrados.

- **DELETE `/api/users/{id}`**  
  Remove um usuário.

---

### Tipos de Monstros (`/api/tipos`) *(protegido com JWT)*
- **GET `/api/tipos`**  
  Lista todos os tipos.

- **GET `/api/tipos/{id}`**  
  Retorna um tipo específico.

- **POST `/api/tipos`**  
  Cria um novo tipo (nome, descrição).

- **PUT `/api/tipos/{id}`**  
  Atualiza um tipo existente.

- **DELETE `/api/tipos/{id}`**  
  Remove um tipo.

---

### Monstros (`/api/monstros`) *(protegido com JWT)*
- **GET `/api/monstros`**  
  Lista todos os monstros.

- **GET `/api/monstros/{id}`**  
  Retorna um monstro específico.

- **POST `/api/monstros`**  
  Cria um novo monstro (nome, tipoId, descricao, imagemUrl).

- **PUT `/api/monstros/{id}`**  
  Atualiza um monstro existente.

- **DELETE `/api/monstros/{id}`**  
  Remove um monstro.

### 4.1 Backend

- `Models/`  
  Contém as classes de domínio: `User`, `Tipo`, `Monstro`.

- `Data/AppDbContext.cs`  
  Mapeia os modelos para o PostgreSQL via Entity Framework Core.

- `Services/TokenService.cs`  
  Responsável por gerar tokens JWT.

- `Controllers/`  
  - `AuthController`: login, registro (e opcionalmente seed de admin).  
  - `TiposController`: CRUD de tipos.  
  - `MonstrosController`: CRUD de monstros.  
  - `UsersController`: listagem e exclusão de usuários.  

- `Program.cs`  
  - Configuração de:
    - DbContext + PostgreSQL.  
    - Autenticação JWT.  
    - CORS.  
    - Swagger.  
    - Endpoint `/health`.  

### 4.2 Frontend

- `src/api/api.js`  
  - Configura Axios com `baseURL` da API.  
  - Interceptores que:
    - Enviam `Authorization: Bearer <token>` em todas as requisições.  
    - Redirecionam para `/login` em caso de 401.  
  - Serviços:
    - `auth` (login, register, logout, getCurrentUser).  
    - `users` (list, get, create, update, remove).  
    - `types` (cache em localStorage, listAsync, create, update, remove).  
    - `monsters` (cache em localStorage, listAsync, create, update, remove).  

- `src/context/AuthContext.jsx`  
  - Gerencia estado de autenticação no frontend.  
  - Disponibiliza `user`, `login`, `logout`.  

- Páginas principais:
  - `Login.jsx`  
  - `Home.jsx` (bestiário visual: ícones à esquerda, painel à direita)  
  - `ListaMonstros.jsx`, `CadastroMonstro.jsx`  
  - `ListaTipos.jsx`, `CadastroTipo.jsx`  
  - `ListaPessoas.jsx` (usuários)  

---

## 5. Como executar o projeto localmente

### 5.1 Pré-requisitos

- .NET SDK instalado  
- Node.js e npm instalados  
- PostgreSQL instalado e em execução  

### 5.2 Configuração do banco de dados

1. Criar um banco PostgreSQL, por exemplo `bestiario`.

2. Ajustar o `appsettings.json` do backend (appsettings padrão presente no repositorio)

3. Na pasta `backend/backend` executar os comandos

- dotnet tool restore
- dotnet ef migrations add InitialCreate
- dotnet ef database update


### 5.3 Executar o backend

Na pasta `backend/backend`: dot net run


- API disponível em: `http://localhost:5283`  
- Swagger: `http://localhost:5283/swagger`  
- Healthcheck: `http://localhost:5283/health`  

### 5.4 Criar um usuário padrão

Usar o endpoint de registro:
- `POST http://localhost:5283/api/auth/SeedAuth`
- Email: admin@bestiario.com
- Senha: admin123

Acesse:  
`http://localhost:5173`

---

## 6. Fluxo de uso

1. Acessar a aplicação em `http://localhost:5173`.  
2. Fazer login com o usuário criado (ex.: `admin@bestiario.com` / `admin123`).  
3. Cadastrar **Tipos** (ex.: Dragão, Wyvern, Fera).  
4. Cadastrar **Monstros**, vinculando a um tipo e definindo:
   - Nome  
   - URL da imagem  
   - Descrição em Markdown  
5. Na Home:
   - Selecionar monstros na barra lateral de ícones.  
   - Ver detalhes (imagem grande, nome, tipo, descrição) no painel principal.  
6. Em **Usuários**, visualizar caçadores cadastrados e excluir quando necessário.

---

## 7. Autenticação JWT (resumo técnico)

- O usuário envia `email` e `password` para `POST /api/auth/login`.  
- O backend valida as credenciais e gera um JWT com claims (`id`, `username`).  
- O frontend recebe `{ token, user }` e grava no `localStorage`.  
- Axios adiciona automaticamente `Authorization: Bearer <token>` em todas as requisições.  
- Endpoints com `[Authorize]` só são acessados se o token for válido.  
- Ao receber 401, o frontend remove o token e redireciona para `/login`.  


## 8. Tabelas
User (Id, Username, Email, PasswordHash, CreatedAt)

Tipo (Id, Nome, Descricao)

Monstro (Id, Nome, Descricao, ImagemUrl, CreatedAt, TipoId)

Relacionamentos:
- Tipo 1 ---- N Monstro
  (um Tipo pode estar ligado a muitos Monstros, cada Monstro pertence a um Tipo)





