import axios from 'axios';

// ========================================
// CONFIGURATION API
// ========================================
const api = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ========================================
// INTERCEPTEURS
// ========================================

// Ajouter le token JWT aux requêtes authentifiées
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

// Gérer les erreurs d'authentification et expiration token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // ✅ Message explicite pour l'utilisateur
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        // Afficher notification
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
        toast.innerHTML = `
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p class="font-semibold">Session expirée</p>
              <p class="text-sm">Veuillez vous reconnecter</p>
            </div>
          </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          document.body.removeChild(toast);
          window.location.href = '/login';
        }, 2000);
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ========================================
// AUTH SERVICE (Port 3001)
// ========================================
export const authService = {
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // ✅ Stocker timestamp pour vérifier expiration
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24h
      localStorage.setItem('tokenExpires', expiresAt.toString());
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpires');
  },

  getProfile: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  // ✅ Vérifier si le token est expiré
  isTokenExpired: () => {
    const expiresAt = localStorage.getItem('tokenExpires');
    if (!expiresAt) return true;
    return Date.now() > parseInt(expiresAt);
  }
};

// ========================================
// PRODUCT SERVICE (Port 3002)
// ========================================
export const productService = {
  getAll: async () => {
    const response = await api.get('/api/products');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get(`/api/products/search?q=${query}`);
    return response.data;
  },

  getByCategory: async (category) => {
    const response = await api.get(`/api/products/category/${category}`);
    return response.data;
  },

  create: async (productData) => {
    const response = await api.post('/api/products', productData);
    return response.data;
  },

  update: async (id, productData) => {
    const response = await api.put(`/api/products/${id}`, productData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  }
};

// ========================================
// ORDER SERVICE (Port 3003)
// ========================================
export const orderService = {
  getAll: async () => {
    const response = await api.get('/api/orders');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  create: async (orderData) => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/api/orders/${id}/status`, { status });
    return response.data;
  }
};

// ========================================
// REVIEW SERVICE (Port 3004)
// ========================================
export const reviewService = {
  getByProduct: async (productId) => {
    const response = await api.get(`/api/reviews/product/${productId}`);
    return response.data;
  },

  create: async (reviewData) => {
    const response = await api.post('/api/reviews', reviewData);
    return response.data;
  },

  update: async (id, reviewData) => {
    const response = await api.put(`/api/reviews/${id}`, reviewData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/reviews/${id}`);
    return response.data;
  }
};

export default api;
