import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore';
import HomeView from '../views/HomeView.vue'
import AdminUserListView from '@/views/admin/AdminUserListView.vue';
import { ElMessage } from 'element-plus';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: () => import('../views/Login.vue') },
    { path: '/signup', name: 'signup', component: () => import('../views/SignUp.vue') },
    { path: '/about', name: 'about', component: () => import('../views/About.vue') },
    {
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'users',
        name: 'admin-users',
        component: AdminUserListView,
        meta: { title: 'User Management' }
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('../views/admin/AdminDashboard.vue'),
        meta: { requiresAuth: true, requiresAdmin: true, title: 'Dashboard' }
      },
    ]
    },
    {
      path: '/team/:teamId',
      name: 'team',
      component: () => import('../views/TeamView.vue'),
      props: true,
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/id/:id',
      name: 'user-profile',
      component: () => import('../views/UserProfileView.vue'),
      props: true
    },
    {
      path: '/tournaments',
      name: 'tournaments-list',
      component: () => import('../views/TournamentsListView.vue')
    },

     {
      path: '/tournaments/:id',
      name: 'tournament-detail',
      component: () => import('../views/TournamentDetailView.vue'),
      props: true
    },
    {
      path: '/invites/:inviteToken',
      name: 'accept-invite',
      component: () => import('../views/AcceptInvite.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/confirm-email',
      name: 'confirm-email',
      component: () => import('../views/EmailConfirmation.vue')
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/ResetPassword.vue')
    },
  ],
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

  if (to.name === 'user-profile' && to.params.id) {
    if (authStore.isAuthenticated && authStore.userId && String(authStore.userId) === String(to.params.id)) {
      console.log(`Redirecting from /id/${to.params.id} to /profile`);
      next({ name: 'profile' });
      return;
    }
  }
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    next();
  }
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    ElMessage.error('You are not authorized to access this page.');
    next({ name: 'home' });
  } else {
    next();
  }
});
export default router
