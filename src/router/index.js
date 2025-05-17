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
    {
      path: '/id/:id',     // Ваш путь для просмотра профилей
      name: 'user-profile', // Имя этого маршрута
      component: () => import('../views/UserProfileView.vue'),
      props: true 
      // meta: { requiresAuth: true } // Если просмотр чужих профилей требует входа
    },
    { 
      path: '/tournaments', 
      name: 'tournaments-list', 
      component: () => import('../views/TournamentsListView.vue') 
    },
    // --- КОНЕЦ МАРШРУТА СПИСКА ТУРНИРОВ ---

    // --- ДОБАВЛЯЕМ МАРШРУТ ДЕТАЛЕЙ ТУРНИРА (понадобится для ссылок с карточек) ---
     { 
      path: '/tournaments/:id', // Динамический :id
      name: 'tournament-detail', 
      component: () => import('../views/TournamentDetailView.vue'), // СОЗДАЙТЕ ЭТОТ ФАЙЛ ПОЗЖЕ
      props: true 
    },
    { 
      path: '/invites/:inviteToken', // Динамический токен приглашения
      name: 'accept-invite', 
      component: () => import('../views/AcceptInvite.vue'), // Новый компонент
      props: true, // Передаем inviteToken как пропс
      meta: { requiresAuth: true } // Пользователь должен быть залогинен, чтобы принять инвайт
    },
    // ... другие маршруты ...
  ],
})

// --- ИСПРАВЛЕННЫЙ НАВИГАЦИОННЫЙ СТРАЖ ---
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore(); // Получаем store

  // --- НОВАЯ ЛОГИКА ПЕРЕНАПРАВЛЕНИЯ ---
  // Проверяем, пытается ли пользователь перейти на страницу чужого профиля (/id/:id)
  if (to.name === 'user-profile' && to.params.id) {
    // Сравниваем ID из URL с ID залогиненного пользователя
    // Убедимся, что authStore.userId существует и to.params.id тоже
    // to.params.id приходит как строка, поэтому сравниваем с Number() или приводим оба к строке
    if (authStore.isAuthenticated && authStore.userId && String(authStore.userId) === String(to.params.id)) {
      // Если ID совпадают, это свой профиль, перенаправляем на /profile
      console.log(`Redirecting from /id/${to.params.id} to /profile`);
      next({ name: 'profile' });
      return; // Завершаем выполнение стража
    }
  }
  // --- КОНЕЦ НОВОЙ ЛОГИКИ ---
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