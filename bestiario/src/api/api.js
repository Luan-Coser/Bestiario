import axios from 'axios';

// Configuração da API
const API_BASE_URL = 'http://localhost:5283/api';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Parte de Autenticação
export const auth = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  },

  register: async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao registrar');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Parte de USUÁRIOS
export const users = {
  list: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return [];
    }
  },

  get: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  },

  create: async (data) => {
    try {
      const response = await auth.register(data.name, data.email, data.password);
      return response.user;
    } catch (error) {
      throw new Error(error.message || 'Erro ao criar usuário');
    }
  },

  update: async (id, data) => {
    try {
      await api.put(`/users/${id}`, {
        id: parseInt(id),
        username: data.name,
        email: data.email
      });
      return true;
    } catch (error) {
      throw new Error('Erro ao atualizar usuário');
    }
  },

  remove: async (id) => {
    try {
      await api.delete(`/users/${id}`);
      return true;
    } catch (error) {
      throw new Error('Erro ao deletar usuário');
    }
  }
};

// Parte de TIPOS
export const types = {
  list: () => {
    const cached = localStorage.getItem('tipos');
    if (cached) {
      return JSON.parse(cached);
    }
    return [];
  },

  listAsync: async () => {
    try {
      const response = await api.get('/tipos');
      localStorage.setItem('tipos', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Erro ao listar tipos:', error);
      return [];
    }
  },

  get: (id) => {
    const list = types.list();
    return list.find(t => t.id === parseInt(id));
  },

  create: async (data) => {
    try {
      console.log(' 1. Dados recebidos do formulário:', data);
      
      // Validação
      if (!data.name || data.name.trim() === '') {
        throw new Error('Nome do tipo é obrigatório');
      }

      const payload = {
        nome: data.name.trim(),
        descricao: data.description?.trim() || ''
      };

      console.log(' 2. Payload que será enviado:', payload);
      console.log(' 3. URL completa:', `${api.defaults.baseURL}/tipos`);

      const response = await api.post('/tipos', payload);
      
      console.log(' 4. Resposta do backend (sucesso):', response.data);
      
      // Atualizar cache
      const list = types.list();
      list.push(response.data);
      localStorage.setItem('tipos', JSON.stringify(list));
      
      return response.data;
    } catch (error) {
      console.error(' 5. ERRO COMPLETO:', error);
      console.error(' 6. Resposta do servidor:', error.response);
      console.error(' 7. Status HTTP:', error.response?.status);
      console.error(' 8. Dados do erro:', error.response?.data);
      console.error(' 9. Headers da resposta:', error.response?.headers);
      
      const errorMessage = error.response?.data?.errors 
        ? JSON.stringify(error.response.data.errors)
        : error.response?.data?.message 
        || error.response?.data?.title 
        || 'Erro ao criar tipo';
      
      throw new Error(errorMessage);
    }
  },
  
  update: async (id, data) => {
    try {
      await api.put(`/tipos/${id}`, {
        id: parseInt(id),
        nome: data.name,
        descricao: data.description || ''
      });
      
      const list = types.list().map(t => 
        t.id === parseInt(id) ? { ...t, nome: data.name, descricao: data.description } : t
      );
      localStorage.setItem('tipos', JSON.stringify(list));
      
      return true;
    } catch (error) {
      throw new Error('Erro ao atualizar tipo');
    }
  },

  remove: async (id) => {
    try {
      await api.delete(`/tipos/${id}`);
      
      const list = types.list().filter(t => t.id !== parseInt(id));
      localStorage.setItem('tipos', JSON.stringify(list));
      
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar tipo');
    }
  }
};

// Parte de MONSTROS
export const monsters = {
  list: () => {
    const cached = localStorage.getItem('monstros');
    if (cached) {
      return JSON.parse(cached);
    }
    return [];
  },

  listAsync: async () => {
    try {
      const response = await api.get('/monstros');
      localStorage.setItem('monstros', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Erro ao listar monstros:', error);
      return [];
    }
  },

  get: (id) => {
    const list = monsters.list();
    return list.find(m => m.id === parseInt(id));
  },

  create: async (data) => {
    try {
      const response = await api.post('/monstros', {
        nome: data.name,
        tipoId: parseInt(data.typeId),
        descricao: data.description || '',
        imagemUrl: data.image || ''
      });
      
      const list = monsters.list();
      list.push(response.data);
      localStorage.setItem('monstros', JSON.stringify(list));
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar monstro');
    }
  },

  update: async (id, data) => {
    try {
      await api.put(`/monstros/${id}`, {
        id: parseInt(id),
        nome: data.name,
        tipoId: parseInt(data.typeId),
        descricao: data.description || '',
        imagemUrl: data.image || ''
      });
      
      await monsters.listAsync();
      
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar monstro');
    }
  },

  remove: async (id) => {
    try {
      await api.delete(`/monstros/${id}`);
      
      const list = monsters.list().filter(m => m.id !== parseInt(id));
      localStorage.setItem('monstros', JSON.stringify(list));
      
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar monstro');
    }
  }
};

// Carregar dados iniciais
types.listAsync();
monsters.listAsync();

export default api;
