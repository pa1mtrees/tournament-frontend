<template>
  <div class="admin-layout mt-6">
    <el-container style="height: 100vh;">
      <!-- Sidebar -->
      <el-aside width="220px" class="admin-sidebar bg-[var(--color-primary-dark)] text-[var(--color-text-light)]">
        <div class="p-4 text-center border-b border-gray-700">
          <router-link to="/" class="jersey text-myred tracking-wide text-4xl">
            heartbit
          </router-link>
          <div class="text-sm text-[var(--color-text-muted)]">Admin Panel</div>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-admin"
          router
          background-color="transparent"
          text-color="var(--color-text-light)"
          active-text-color="var(--color-accent)"
        >
          <el-menu-item index="/admin/dashboard" :route="{ name: 'admin-dashboard' }">
            <el-icon><DataLine /></el-icon>
            <span>Dashboard</span>
          </el-menu-item>
          <el-menu-item index="/admin/users" :route="{ name: 'admin-users' }">
            <el-icon><User /></el-icon>
            <span>User Management</span>
          </el-menu-item>
        </el-menu>
        <div class="p-4 mt-auto border-t border-gray-700 text-center">
            <el-button type="danger" plain @click="logout" class="w-full">Logout</el-button>
        </div>
      </el-aside>

      <!-- Main Content Area -->
      <el-container>
        <el-header class="admin-header bg-[var(--color-primary)] flex items-center justify-between px-4 shadow">
          <div class="text-lg font-semibold text-[var(--color-text-light)]">{{ currentRouteTitle }}</div>
          <div>
            <span class="text-sm text-[var(--color-text-muted)] mr-2">Welcome, {{ authStore.user?.nickname || authStore.user?.first_name || 'Admin' }}!</span>
            <!-- Add any other header elements, like notifications or profile dropdown -->
          </div>
        </el-header>
        <el-main class="admin-main-content bg-[var(--color-background)] p-0">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElContainer, ElAside, ElMenu, ElMenuItem, ElIcon, ElHeader, ElMain, ElButton } from 'element-plus';
import { DataLine, User, Trophy, Setting, Football, Tickets } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const activeMenu = computed(() => {
  if (route.path.startsWith('/admin/users')) return '/admin/users';
  if (route.path.startsWith('/admin/tournaments')) return '/admin/tournaments';
  return route.path;
});

const currentRouteTitle = computed(() => {
    return route.meta.title || 'Admin Dashboard';
});

const logout = async () => {
  await authStore.logout(); // Assuming your authStore has a logout method
  router.push({ name: 'login' });
};

// Dummy routes for menu items - replace with your actual admin route names
// These are just for the :route prop in el-menu-item to work if you don't have these routes yet.
const adminRoutes = {
  'admin-dashboard': { name: 'admin-dashboard' }, // You'll need to create this route
  'admin-users': { name: 'admin-users' },
  'admin-tournaments': { name: 'admin-tournaments' }, // You'll need to create this route
  'admin-sports': { name: 'admin-sports' },
  'admin-formats': { name: 'admin-formats' },
  'admin-settings': { name: 'admin-settings' },
};

</script>

<style scoped>
.admin-layout {
  height: 100vh;
  overflow: hidden;
}

.admin-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.el-menu-vertical-admin {
  border-right: none;
  flex-grow: 1;
}

.el-menu-vertical-admin .el-menu-item {
  color: var(--color-text-light);
}
.el-menu-vertical-admin .el-menu-item:hover {
  background-color: var(--color-primary) !important;
}
.el-menu-vertical-admin .el-menu-item.is-active {
  background-color: var(--color-accent-dark) !important; /* Darker accent for active */
  color: var(--color-text-on-accent) !important;
}
.el-menu-vertical-admin .el-icon {
  color: var(--color-text-light); /* Ensure icons inherit color or set explicitly */
}
.el-menu-vertical-admin .el-menu-item.is-active .el-icon {
  color: var(--color-text-on-accent) !important;
}


.admin-header {
  border-bottom: 1px solid var(--color-border);
}

.admin-main-content {
  /* background-color: #f0f2f5; */ /* Or your desired background */
  /* padding: 20px; */
  overflow-y: auto; /* Allow scrolling for content longer than the viewport */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
