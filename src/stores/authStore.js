// src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router' 
import apiClient from '@/services/apiClient'; 
import { jwtDecode } from 'jwt-decode'; 

export const useAuthStore = defineStore('auth', () => {
  // Загружаем user из localStorage целиком
  const storedUser = JSON.parse(localStorage.getItem('authUser') || 'null');

  const isLoggedIn = ref(localStorage.getItem('authToken') ? true : false); 
  const user = ref(storedUser); // Инициализируем user из localStorage
  // Аватар берем из сохраненного юзера или генерируем
  const avatarUrl = ref(storedUser?.avatarUrl || (storedUser?.username ? `https://api.dicebear.com/8.x/identicon/svg?seed=${storedUser.username}` : null)); 
  const token = ref(localStorage.getItem('authToken') || null); 

  const isAuthenticated = computed(() => isLoggedIn.value);
  const username = computed(() => user.value?.username || null); // Должен быть в ответе /users/{id}
  const userAvatar = computed(() => avatarUrl.value);
  const userEmail = computed(() => user.value?.email || null);
  // Геттер для роли (если нужна)
  const userRole = computed(() => user.value?.role || null); 
  // Геттер для ID (если нужен)
  const userId = computed(() => user.value?.id || null); 

  async function fetchUser(userId) {
    try {
      // Запрос к GET /users/{id}
      const response = await apiClient.get(`/users/${userId}`); 
      const receivedUser = response.data; 
      
      // Сохраняем ПОЛНЫЙ объект пользователя
      user.value = receivedUser; 
      // Обновляем аватар (из ответа бэка или генерируем)
      avatarUrl.value = receivedUser?.avatarUrl || `https://api.dicebear.com/8.x/identicon/svg?seed=${receivedUser.username}`; // Убедитесь, что username возвращается
      
      // Сохраняем актуальные данные пользователя в localStorage
      localStorage.setItem('authUser', JSON.stringify(receivedUser)); 

      console.log('User data fetched/updated:', user.value);
      return user.value; 
    } catch (error) {
      console.error('Failed to fetch user data:', error.response?.data || error.message);
      // При ошибке загрузки данных - выходим из системы
      logoutAction(false); 
      return null;
    }
  }

  async function login(credentials) {
     // ... (Логика получения токена и userId без изменений) ...
    try {
      const response = await apiClient.post('/users/signin', {
        email: credentials.email,     
        password: credentials.password, 
      });

      if (response.data && response.data.token) {
        const receivedToken = response.data.token;
        let userId = response.data.userId; 

        localStorage.setItem('authToken', receivedToken);
        token.value = receivedToken; 

        if (!userId) {
          try {
            const decodedToken = jwtDecode(receivedToken);
            userId = decodedToken.id; 
            if (!userId) throw new Error('User ID (id) not found in token');
          } catch (decodeError) {
            console.error('Failed to decode token:', decodeError);
            logoutAction(false); 
            return { success: false, message: 'Invalid token received.' };
          }
        }

        // Запрашиваем данные пользователя ПОСЛЕ получения токена
        const fetchedUser = await fetchUser(userId); 

        if (fetchedUser) {
          isLoggedIn.value = true; // Устанавливаем статус входа
          console.log('Login successful for:', fetchedUser.username);
          router.push('/'); 
          return { success: true };
        } else {
          // Не удалось получить данные пользователя, но токен есть? logoutAction уже вызван
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

  // --- Register Action (без изменений) ---
   async function register(userData) { /* ... */ }

  // --- Logout Action (без изменений) ---
   function logoutAction(shouldRedirect = true) { /* ... */ }

   // --- Check Auth On Load ---
   // Логика остается прежней: если есть токен, декодируем, получаем ID, вызываем fetchUser
   async function checkAuthOnLoad() {
     const storedToken = localStorage.getItem('authToken');
     const storedUserJson = localStorage.getItem('authUser'); // Прочитаем сохраненного юзера

     if (storedToken && storedUserJson) {
       token.value = storedToken; 
       user.value = JSON.parse(storedUserJson); // Восстанавливаем юзера
       avatarUrl.value = user.value?.avatarUrl || `https://api.dicebear.com/8.x/identicon/svg?seed=${user.value.username}`; // Восстанавливаем аватар
       isLoggedIn.value = true; // Считаем залогиненным
       console.log('Auth restored from localStorage.');
       // Опционально: можно добавить фоновую проверку токена / обновление данных пользователя
       // fetchUser(user.value.id); 
     } else {
       logoutAction(false); // Если чего-то нет, считаем разлогиненным
     }
   }
  
  checkAuthOnLoad(); 

  return { 
    isLoggedIn, user, avatarUrl, token,
    isAuthenticated, username, userAvatar, userEmail, userRole, userId, // Добавили userRole, userId
    login, 
    register, 
    logout: logoutAction,
    fetchUser, 
    checkAuthOnLoad 
  }
})