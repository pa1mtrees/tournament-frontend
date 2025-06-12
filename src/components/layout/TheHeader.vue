<template>
  <header class="bg-[var(--color-primary)] shadow-md md:rounded-b-[2vw] sticky top-0 z-50">
    <nav class="container mx-auto px-3 py-2 sm:px-4 sm:py-3 flex justify-between items-center">
      <router-link to="/" class="flex items-center gap-2">
        <img src="/src/assets/heart.gif" alt="Logo" class="w-10 h-8 sm:w-22 sm:h-10" />
        <h1 class="text-3xl sm:text-5xl text-myred pb-1 jersey tracking-wide">heartbit</h1>
      </router-link>

      <div class="hidden md:flex items-center justify-between w-full ml-10">
        <div class="flex items-center space-x-2 md:space-x-4 lg:space-x-6 mx-auto">
          <router-link to="/" class="fluid-nav-link dynamic-text">Home</router-link>
          <router-link to="/tournaments" class="fluid-nav-link dynamic-text">Tournaments</router-link>
          <router-link to="/about" class="fluid-nav-link dynamic-text">About Us</router-link>
          <router-link v-if="authStore.userRole === 'admin'" to="/admin" class="fluid-nav-link dynamic-text">
              Admin
          </router-link>
        </div>

        <div class="flex items-center fluid-space-x relative">

          <div v-if="!authStore.isAuthenticated" class="flex items-center fluid-space-x">
            <router-link to="/login" class="login-button dynamic-text">Login</router-link>
            <router-link to="/signup" class="login-button dynamic-text hover:text-[var(--color-text-light)] transition-colors">Sign Up</router-link>
          </div>

          <div v-else class="flex items-center fluid-space-x">

            <div class="relative">
              <button @click="toggleUserDropdown" class="flex items-center fluid-space-x focus:outline-none">
          <img
              v-if="authStore.userAvatar"
              :src="authStore.userAvatar"
              alt="User Avatar"
              class="w-8 h-8 object-cover rounded-lg"
          />
          <div v-else class="w-8 h-8 rounded-full bg-[var(--color-secondary)] border-2 border-[var(--color-myred)] flex items-center justify-center text-sm text-[var(--color-text-light)]">?</div>

          <span class="mobile-jaro dynamic-text text-[var(--color-text-light)]">
            {{ authStore.user.nickname || authStore.user.email }}
          </span>

          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[var(--color-text-light)] ml-1 transition-transform duration-200" :class="{'rotate-180': isUserDropdownOpen}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
              </button>
              <transition>
          <div v-show="isUserDropdownOpen" @click="closeUserDropdown" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-[var(--color-primary)] ring-1 ring-[var(--color-secondary)] ring-opacity-5 focus:outline-none z-50">
            <router-link to="/profile" class="block px-4 py-2 text-sm md:text-xl text-[var(--color-text-muted)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-myred)]">My Profile</router-link>
            <router-link to="/settings" class="block px-4 py-2 text-sm md:text-xl text-[var(--color-text-muted)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-myred)]">Settings</router-link>
            <hr class="border-t border-[var(--color-secondary)] my-1"/>
            <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm md:text-lg mobile-jaro text-[var(--color-text-muted)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-myred)]">Logout</button>
          </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <div class="md:hidden">
        <button @click="toggleMobileMenu" aria-label="Toggle menu">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[var(--color-text-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </button>
      </div>
    </nav>

    <transition name="slide-fade">
      <div
        v-show="isMobileMenuOpen"
        class="md:hidden fixed inset-0 bg-[var(--color-primary)] bg-opacity-95 backdrop-blur-sm p-4 z-40 overflow-y-auto"
        @click.self="closeMobileMenu"
      >
        <div class="flex flex-col space-y-4 pt-16">
          <button @click="closeMobileMenu" class="absolute top-5 right-5 text-[var(--color-text-light)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <template v-if="authStore.isAuthenticated">
            <div class="flex flex-col items-center space-y-3 py-2 border-b border-[var(--color-secondary)] pb-4 mb-2">
               <img v-if="authStore.userAvatar" :src="authStore.userAvatar" alt="User Avatar" class="w-16 h-16 rounded-full" />
               <div v-else class="w-16 h-16 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-2xl text-[var(--color-text-light)]">
                 {{ (authStore.user?.nickname || authStore.user?.email)?.charAt(0).toUpperCase() || '?' }}
               </div>
               <span class="mobile-jaro text-xl text-center text-[var(--color-text-light)] truncate max-w-[200px]">
                {{ authStore.user?.nickname || authStore.user?.email }}
               </span>
            </div>
            <router-link to="/profile" @click="closeMobileMenu" class="mobile-jaro text-xl text-center py-2 text-[var(--color-text-light)] hover:text-[var(--color-myred)] transition-colors">My Profile</router-link>
          </template>

          <router-link to="/" @click="closeMobileMenu" class="mobile-jaro text-xl text-center py-2 text-[var(--color-text-light)] hover:text-[var(--color-myred)] transition-colors">Home</router-link>
          <router-link to="/tournaments" @click="closeMobileMenu" class="mobile-jaro text-xl text-center py-2 text-[var(--color-text-light)] hover:text-[var(--color-myred)] transition-colors">Tournaments</router-link>
          <router-link to="/about" @click="closeMobileMenu" class="mobile-jaro text-xl text-center py-2 text-[var(--color-text-light)] hover:text-[var(--color-myred)] transition-colors">About Us</router-link>

          <hr class="border-t border-[var(--color-secondary)] my-3"/>

          <div class="flex flex-col space-y-3 items-center">
             <template v-if="!authStore.isAuthenticated">
                <router-link to="/login" @click="closeMobileMenu" class="mobile-jaro text-xl text-center py-2 px-6 bg-[var(--color-secondary)] text-[var(--color-text-light)] rounded-md hover:bg-opacity-80 transition-colors w-full max-w-xs">Login</router-link>
                <router-link to="/signup" @click="closeMobileMenu" class="mobile-jaro text-xl text-center py-2 px-6 bg-[var(--color-myred)] text-[var(--color-text-light)] rounded-md hover:bg-opacity-80 transition-colors w-full max-w-xs">Sign Up</router-link>
             </template>
             <template v-else>
                <button @click="handleLogoutMobile" class="mobile-jaro text-xl text-center py-2 px-6 bg-myred text-white rounded-md hover:bg-opacity-80 transition-colors w-full max-w-xs" > Logout </button>
             </template>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const isMobileMenuOpen = ref(false);
const isUserDropdownOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  isUserDropdownOpen.value = false;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value;
}

const closeUserDropdown = () => {
  isUserDropdownOpen.value = false;
}

const handleLogout = () => {
  closeUserDropdown();
  authStore.logout();
};

const handleLogoutMobile = () => {
  closeMobileMenu();
  authStore.logout();
};
</script>

<style scoped>
.fluid-nav-link.router-link-exact-active {
   color: var(--color-myred);
   font-weight: 400;
}
</style>
