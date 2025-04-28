// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'; // Импорт остается здесь
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: () => import('../views/Login.vue') },
    { path: '/signup', name: 'signup', component: () => import('../views/SignUp.vue') },
    { 
      path: '/profile', 
      name: 'profile', 
      component: () => import('../views/Profile.vue'),
      meta: { requiresAuth: true } 
    },
     { 
      path: '/settings', 
      name: 'settings', 
      component: () => import('../views/Setting.vue'), 
      meta: { requiresAuth: true } 
    },
    // ... другие маршруты ...
  ],
})

// --- ИСПРАВЛЕННЫЙ НАВИГАЦИОННЫЙ СТРАЖ ---
router.beforeEach((to, from, next) => {
  // Сначала проверяем, требует ли маршрут аутентификации
  if (to.meta.requiresAuth) {
    // Получаем доступ к хранилищу ТОЛЬКО ЗДЕСЬ, когда он нужен
    const authStore = useAuthStore(); 
    if (!authStore.isAuthenticated) {
      // Если пользователь НЕ аутентифицирован, перенаправляем на /login
      next({ name: 'login' });
    } else {
       // Если пользователь аутентифицирован, разрешаем доступ
      next();
    }
  } else {
    // Если маршрут НЕ требует аутентификации, просто разрешаем доступ
    next(); 
  }
});
// --- КОНЕЦ ИСПРАВЛЕННОГО СТРАЖА ---

export default router