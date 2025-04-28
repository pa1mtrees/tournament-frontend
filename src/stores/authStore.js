import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router' // Импортируем роутер для перенаправлений

export const useAuthStore = defineStore('auth', () => {
  // --- State ---
  // Флаг, показывающий, вошел ли пользователь в систему
  const isLoggedIn = ref(false) 
  // Информация о пользователе (пока просто имя)
  const user = ref(null) 
  // Добавляем URL аватара (пока null)
  const avatarUrl = ref(null) 

  // --- Getters ---
  // Удобный getter для проверки аутентификации
  const isAuthenticated = computed(() => isLoggedIn.value)
  // Getter для получения имени пользователя
  const username = computed(() => user.value?.username || null)
  // Getter для аватара
  const userAvatar = computed(() => avatarUrl.value)
  // --- Actions ---
  // Действие для "входа"
  function login(userData) {
    // --- СИМУЛЯЦИЯ ---
    // В реальном приложении здесь будет вызов API к бэкенду:
    // const response = await api.post('/login', { username: userData.username, password: userData.password });
    // const loggedInData = response.data; // Данные пользователя и токен

    // Пока просто устанавливаем флаг и фейковые данные пользователя
    isLoggedIn.value = true;
    user.value = { username: userData.username }; // Сохраняем имя пользователя
    // Устанавливаем фейковый URL. Позже здесь будет URL из ответа API
    avatarUrl.value = `https://api.dicebear.com/8.x/identicon/svg?seed=${userData.username}`
    console.log('Simulated login successful for:', user.value.username);

    // --- КОНЕЦ СИМУЛЯЦИИ ---

    // После успешного входа перенаправляем на главную
    router.push('/'); 
  }

  // Действие для "выхода"
  function logout() {
    // --- СИМУЛЯЦИЯ ---
    // В реальном приложении здесь может быть вызов API /logout
    // и очистка токена из localStorage

    // Просто сбрасываем состояние
    isLoggedIn.value = false;
    user.value = null;
    avatarUrl.value = null;
    console.log('User logged out');
    // --- КОНЕЦ СИМУЛЯЦИИ ---

    // После выхода перенаправляем на страницу входа
    router.push('/login');
  }

  // Возвращаем state, getters и actions, чтобы их можно было использовать в компонентах
  return { 
    isLoggedIn, 
    user, 
    avatarUrl,
    isAuthenticated,
    username,
    userAvatar,
    login, 
    logout 
  }
})