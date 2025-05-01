// src/services/apiClient.js
import axios from 'axios';

// Получаем базовый URL API из переменных окружения Vite
// Создайте файл .env в корне проекта и добавьте VITE_API_BASE_URL=http://localhost:8080 (или ваш порт Go)
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.64:8085'; 

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
    const token = localStorage.getItem('authToken'); // Или где вы будете хранить токен
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }, 
  (error) => {
    return Promise.reject(error);
  }
);

// --- Перехватчик ответов (Response Interceptor) - Опционально ---
// Можно использовать для глобальной обработки ошибок, например, 401 Unauthorized
// apiClient.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response && error.response.status === 401) {
//       // Например, автоматический выход из системы или редирект на логин
//       console.error("Unauthorized! Logging out.");
//       // Нужно будет импортировать store или использовать другой механизм
//       // useAuthStore().logout(); // Осторожно с использованием store вне компонентов
//       // window.location.href = '/login'; 
//     }
//     return Promise.reject(error);
//   }
// );

export default apiClient;