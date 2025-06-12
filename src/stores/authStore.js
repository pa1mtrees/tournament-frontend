// src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router' 
import apiClient from '@/services/apiClient'; 
import { jwtDecode } from 'jwt-decode'; 

export const useAuthStore = defineStore('auth', () => {
  const storedUserJson = localStorage.getItem('authUser');
  const initialUser = storedUserJson ? JSON.parse(storedUserJson) : null;

  const isLoggedIn = ref(localStorage.getItem('authToken') ? true : false); 
  const user = ref(initialUser); // Хранит полный объект пользователя из API ({ user: { ... } })
  const token = ref(localStorage.getItem('authToken') || null); 

  const isAuthenticated = computed(() => isLoggedIn.value);
  const displayName = computed(() => user.value?.nickname || user.value?.first_name || null);
  const userEmail = computed(() => user.value?.email || null);
  const userRole = computed(() => user.value?.role || null); 
  const userId = computed(() => user.value?.id || null); 

  // --- ОБНОВЛЕННЫЙ userAvatar ---
  // Этот computed будет единственным источником URL аватара для залогиненного пользователя
  const userAvatar = computed(() => {
    // 1. Используем logo_url из объекта user, если он есть (от бэкенда)
    if (user.value?.logo_url) { // Используем logo_url согласно вашему JSON
        return user.value.logo_url;
    }
    // 2. Если нет, генерируем Identicon
    if (user.value?.email || user.value?.id) { 
        const seed = user.value.nickname || user.value.first_name || user.value.email || user.value.id;
        return `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(seed)}`;
    }
    return null; // Fallback
  });
  // -----------------------------

  async function fetchUser(userIdToFetch) {
    try {
      const userResponse = await apiClient.get(`/users/${userIdToFetch}`); 
      let receivedUser = userResponse.data.user; 
      
      if (!receivedUser) {
         throw new Error('User data not found in API response for /users/:id');
      }

      if (receivedUser.team_id && receivedUser.team) {
        try {
          const teamResponse = await apiClient.get(`/teams/${receivedUser.team_id}`);
          if (teamResponse.data && teamResponse.data.team) {
            receivedUser.team = teamResponse.data.team; 
          }
        } catch (teamErr) {
          console.error(`Error fetching full details for team ${receivedUser.team_id}:`, teamErr);
        }
      }
      
      // Поле user.value.avatarUrl будет установлено здесь, если бэкенд его возвращает
      user.value = receivedUser; 
      localStorage.setItem('authUser', JSON.stringify(receivedUser)); 
      console.log('User data fetched/updated:', user.value);
      return user.value; 
    } catch (error) {
      console.error('Failed to fetch user data:', error.response?.data || error.message);
      logoutAction(false); 
      return null;
    }
  }

  async function login(credentials) {
    try {
      const response = await apiClient.post('/auth/signin', {
        email: credentials.email,     
        password: credentials.password, 
      });

      if (response.data && response.data.token) {
        const receivedToken = response.data.token;
        let userIdFromToken; 

        localStorage.setItem('authToken', receivedToken);
        token.value = receivedToken; 

        try {
          const decodedToken = jwtDecode(receivedToken);
          userIdFromToken = decodedToken.user_id; 
          if (!userIdFromToken) throw new Error('User ID (user_id) not found in token');
        } catch (decodeError) {
          console.error('Failed to decode token:', decodeError);
          logoutAction(false); 
          return { success: false, message: 'Invalid token received.' };
        }
        
        const fetchedUser = await fetchUser(userIdFromToken); 

        if (fetchedUser) {
          isLoggedIn.value = true; 
          console.log('Login successful for:', fetchedUser.email);
          router.push('/'); 
          return { success: true };
        } else {
          return { success: false, message: 'Login successful, but failed to fetch user data.' };
        }
      } else {
        throw new Error('Token not found in login response');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      logoutAction(false); 
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  }

  // --- Register Action ---
  async function register(userData) {
    try {
       // Отправляем POST запрос на /users/signup с правильными ключами JSON
      const response = await apiClient.post('/auth/signup', {
        first_name: userData.firstName, // Используем first_name
        last_name: userData.lastName,   // Используем last_name
        email: userData.email,
        password: userData.password,
      });

      // Обработка успешной регистрации (например, статус 201)
      console.log('Registration successful:', response.data);
      // Можно вернуть сообщение об успехе компоненту
      return { success: true, message: 'Registration successful! Please log in.' };
      // Или сразу редиректить на логин: router.push('/login');

    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      // Возвращаем ошибку для обработки в компоненте
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  }
  function logoutAction(shouldRedirect = true) { 
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser'); 
    localStorage.removeItem('authEmail'); 
    token.value = null;
    isLoggedIn.value = false; 
    user.value = null; 
    // avatarUrl ref больше нет
    console.log('User logged out'); 
    if (shouldRedirect) {
      setTimeout(() => { router.push('/login'); }, 50); 
    }
  }

   async function checkAuthOnLoad() {
    const storedToken = localStorage.getItem('authToken');
     if (storedToken) {
      token.value = storedToken; 
       let userIdFromToken;
       try {
         const decodedToken = jwtDecode(storedToken);
         userIdFromToken = decodedToken.user_id; 
         if (!userIdFromToken) throw new Error('User ID (user_id) not found in token');

         isLoggedIn.value = true; 
         console.log('Auth token found, attempting to fetch user data...');
         await fetchUser(userIdFromToken); // Загрузит user.value, включая avatarUrl если есть

       } catch (decodeError) {
          console.error('Failed to decode stored token or fetch user on load:', decodeError);
          logoutAction(false); 
       }
    } else {
       logoutAction(false); 
    }
  }
  
  checkAuthOnLoad(); 

  return { 
    isLoggedIn, 
    user, // Объект пользователя 
    // userId, userEmail, userRole, // Эти геттеры теперь берут данные из user.value
    token,
    isAuthenticated, 
    displayName, 
    userAvatar, // Используем этот обновленный геттер
    userEmail,
    userRole,
    userId,
    login, 
    register, 
    logout: logoutAction,
    fetchUser, 
    checkAuthOnLoad 
  }
})