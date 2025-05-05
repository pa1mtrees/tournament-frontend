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
  const user = ref(initialUser); // Инициализируем user из localStorage
  // Аватар генерируем по email или ID, если нет avatarUrl или username
  const avatarUrl = ref(initialUser?.avatarUrl || (initialUser?.email ? `https://api.dicebear.com/8.x/identicon/svg?seed=${initialUser.email}` : null)); 
  const token = ref(localStorage.getItem('authToken') || null); 

  const isAuthenticated = computed(() => isLoggedIn.value);
  // username теперь нет, можно убрать геттер или использовать nickname/first_name
  const displayName = computed(() => user.value?.nickname || user.value?.first_name || null); // Пример для отображения имени
  const userAvatar = computed(() => avatarUrl.value);
  const userEmail = computed(() => user.value?.email || null);
  // Исправляем case полей
  const userRole = computed(() => user.value?.role || null); 
  const userId = computed(() => user.value?.id || null); 

  async function fetchUser(userIdToFetch) { // Переименовал параметр во избежание путаницы с computed userId
    try {
      const response = await apiClient.get(`/users/${userIdToFetch}`); 
      // --- ИСПРАВЛЕНИЕ 1: Сохраняем вложенный объект 'user' ---
      const receivedUser = response.data.user; // Берем данные из response.data.user
      // ----------------------------------------------------
      
      if (!receivedUser) { // Добавим проверку, что данные пользователя пришли
         throw new Error('User data not found in API response');
      }

      user.value = receivedUser; // Сохраняем корректный объект
      
      // --- ИСПРАВЛЕНИЕ 2: Генерируем аватар по email или ID, если нет avatarUrl ---
      avatarUrl.value = receivedUser.avatarUrl || `https://api.dicebear.com/8.x/identicon/svg?seed=${receivedUser.email || receivedUser.id}`; 
      // --------------------------------------------------------------------
      
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
      const response = await apiClient.post('/users/signin', {
        email: credentials.email,     
        password: credentials.password, 
      });

      if (response.data && response.data.token) {
        const receivedToken = response.data.token;
        let userIdFromToken; // Переименовали для ясности

        localStorage.setItem('authToken', receivedToken);
        token.value = receivedToken; 

        // Декодируем токен
        try {
          const decodedToken = jwtDecode(receivedToken);
          // --- ИСПРАВЛЕНИЕ 3: Используем user_id ---
          userIdFromToken = decodedToken.user_id; 
          // -------------------------------------
          if (!userIdFromToken) throw new Error('User ID (user_id) not found in token');
        } catch (decodeError) {
          console.error('Failed to decode token:', decodeError);
          logoutAction(false); 
          return { success: false, message: 'Invalid token received.' };
        }
        
        // Запрашиваем данные пользователя по ID из токена
        const fetchedUser = await fetchUser(userIdFromToken); 

        if (fetchedUser) {
          isLoggedIn.value = true; 
          console.log('Login successful for:', fetchedUser.email); // Логируем email
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
      const response = await apiClient.post('/users/signup', {
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

  // --- Logout Action ---
  // Используем имя logoutAction для внутренней логики
  function logoutAction(shouldRedirect = true) {
    console.log('logoutAction called in store. Redirect:', shouldRedirect);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser'); // Обновили ключ, если используем authUser
    localStorage.removeItem('authEmail'); // Также очищаем email
    token.value = null;
    isLoggedIn.value = false;
    user.value = null; // Сбрасываем объект пользователя
    userId.value = null; // Сбрасываем ID
    userEmail.value = null; // Сбрасываем email
    avatarUrl.value = null;
    console.log('User state reset.');
    if (shouldRedirect) {
      console.log('Attempting redirect to /login in 50ms');
      // Используем setTimeout для небольшой задержки перед редиректом
      setTimeout(() => {
        console.log('Executing redirect now');
        router.push('/login');
      }, 50);
    }
  }

  async function checkAuthOnLoad() {
    const storedToken = localStorage.getItem('authToken');
    const storedUserJson = localStorage.getItem('authUser'); // Загружаем сохраненного пользователя

     if (storedToken) { // Доверяем только токену для определения статуса входа
      token.value = storedToken; 
       let userIdFromToken;
       let seedForAvatar;
       let userRoleFromToken = null;
       let userEmailFromStorage = storedUserJson ? JSON.parse(storedUserJson)?.email : null; // Email из хранилища для аватара
       
       try {
         const decodedToken = jwtDecode(storedToken);
         // --- ИСПРАВЛЕНИЕ 3: Используем user_id ---
         userIdFromToken = decodedToken.user_id; 
         // -------------------------------------
         userRoleFromToken = decodedToken.role || null; // Роль из токена

         if (!userIdFromToken) throw new Error('User ID (user_id) not found in token');

         // Устанавливаем базовое состояние ДО загрузки данных
         isLoggedIn.value = true; 
         userId.value = userIdFromToken;
         userEmail.value = userEmailFromStorage; // Временно ставим email из хранилища
         // Генерируем аватар по email из хранилища или ID
         avatarUrl.value = `https://api.dicebear.com/8.x/identicon/svg?seed=${userEmailFromStorage || userIdFromToken}`;
         // Временно ставим минимальные данные пользователя для проверки роли
         user.value = { id: userIdFromToken, role: userRoleFromToken, email: userEmailFromStorage }; 
         
         console.log('Auth token found, attempting to fetch user data...');
         // Пытаемся обновить данные пользователя с сервера
         await fetchUser(userIdFromToken); 
         // Если fetchUser не удастся, logoutAction сбросит isLoggedIn

       } catch (decodeError) {
          console.error('Failed to decode stored token:', decodeError);
          logoutAction(false); 
       }
    } else {
       logoutAction(false); 
    }
  }
  
  checkAuthOnLoad(); 

  return { 
    isLoggedIn, 
    user, // Объект пользователя (теперь должен быть правильной структуры)
    userId, userEmail, userRole, // Отдельные геттеры
    avatarUrl, token,
    isAuthenticated, 
    // username, // Геттер username убрали, используйте displayName или userEmail
    displayName, // Добавили для примера
    userAvatar,
    login, 
    register, 
    logout: logoutAction,
    fetchUser, 
    checkAuthOnLoad 
  }
})