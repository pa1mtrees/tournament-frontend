// src/services/apiClient.js
import axios from 'axios';
// import { useAuthStore } from '@/stores/authStore'; // Старайтесь избегать импорта store здесь

// Получаем базовый URL API из переменных окружения Vite
// Создайте файл .env в корне проекта и добавьте VITE_API_BASE_URL=http://localhost:8080 (или ваш порт Go)
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'; 

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// --- Перехватчик запросов (Request Interceptor) ---
// Добавляем токен авторизации к КАЖДОМУ запросу, если он есть
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Получаем токен из localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }, 
  (error) => {
    return Promise.reject(error);
  }
);

// --- Перехватчик ответов (Response Interceptor) ---
// Используем для глобальной обработки ошибок, например, 401 Unauthorized
apiClient.interceptors.response.use(
  response => response, // Просто возвращаем успешный ответ
  error => {
    // Проверяем, есть ли ответ и статус код 401
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized (401)! Redirecting to login.");
      
      // Очищаем данные аутентификации из localStorage
      // Это безопаснее, чем пытаться вызвать logout из store здесь
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser'); // Также удаляем данные пользователя

      // Перенаправляем пользователя на страницу входа
      // window.location.href обеспечивает полную перезагрузку, сбрасывая состояние приложения
      window.location.href = '/login'; 
      
      // Важно: Не возвращаем ошибку дальше, чтобы предотвратить
      // дальнейшую обработку в компоненте после редиректа.
      // Можно вернуть специальный объект или просто ничего не возвращать,
      // но редирект уже произойдет.
      // Возврат Promise.reject(error) здесь привел бы к выполнению .catch() в компоненте.
      return new Promise(() => {}); // Возвращаем промис, который никогда не разрешится
                                    // чтобы остановить цепочку .catch в исходном вызове
    }
    // Для всех других ошибок - пробрасываем их дальше
    return Promise.reject(error);
  }
);

export default apiClient;