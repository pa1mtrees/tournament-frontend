<template>
  <header class="bg-[var(--color-primary)] shadow-md md:rounded-b-[2vw] sticky top-0 z-50">
    <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
      <router-link to="/" class="flex items-center">
        <img src="/src/assets/Logo.svg" alt="Logo" class="h-[min(15vw,150px)]" />
      </router-link>

      <div class="hidden md:flex items-center justify-between w-full ml-10"> 
        <div class="flex items-center space-x-2 md:space-x-4 lg:space-x-6 mx-auto">
          <router-link to="/" class="fluid-nav-link dynamic-text">Home</router-link>
          <router-link to="/tournaments" class="fluid-nav-link dynamic-text"
            >Tournaments</router-link
          >
          <router-link to="/about" class="fluid-nav-link dynamic-text">About Us</router-link>
          <router-link to="/contacts" class="fluid-nav-link dynamic-text">Contacts</router-link>
        </div>

        <div class="flex items-center fluid-space-x">
          <div v-if="!authStore.isAuthenticated" class="flex items-center fluid-space-x">
            
            <router-link
              to="/login"
              class="login-button dynamic-text" 
            >
              Login
            </router-link>

            <router-link
              to="/signup"
              class="signup-button dynamic-text bg-[var(--color-myyellow)] text-[var(--color-primary)] px-4 py-1 rounded-[0.7vw] hover:text-[var(--color-myred)] transition-colors"
            >
              Sign Up
            </router-link>

          </div>
          <div v-else class="flex items-center fluid-space-x">
             <span class="mobile-jaro dynamic-text text-[var(--color-text-light)]">
              {{ authStore.username }} 
            </span>
            <button 
              @click="handleLogout"
              class="mobile-jaro dynamic-text bg-myred hover:text-myyellow text-[var(--color-primary)] px-4 py-1 rounded-[0.7vw] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div class="md:hidden">
        <button @click="toggleMobileMenu" aria-label="Toggle menu">
          <svg
            class="w-8 h-8 text-[var(--color-text-light)]"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
    </nav>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-show="isMobileMenuOpen"
        class="md:hidden absolute top-full left-0 right-0 bg-[var(--color-primary)] shadow-lg py-4 px-4 z-40 rounded-b-[2vw]"
      >
        <div class="flex flex-col space-y-4">
          <div class="flex flex-col items-center space-y-4">
            <router-link
              to="/"
              @click="closeMobileMenu"
              class="mobile-jaro text-[min(5vw,50px)] text-[var(--color-text-light)] hover:text-[var(--color-myred)] transition-colors"
              >Home</router-link
            >
            <router-link
              to="/tournaments"
              @click="closeMobileMenu"
              class="mobile-jaro text-[min(5vw,50px)] text-[var(--color-text-light)] hover:text-[var(--color-myred)] transition-colors"
              >Tournaments</router-link
            >
            <router-link
              to="/about"
              @click="closeMobileMenu"
              class="mobile-jaro text-[min(5vw,50px)] text-[var(--color-text-light)] hover:text-[var(--color-myred)] transition-colors"
              >About Us</router-link
            >
            <router-link
              to="/contacts"
              @click="closeMobileMenu"
              class="mobile-jaro text-[min(5vw,50px)] text-[var(--color-text-light)] hover:text-[var(--color-myred)] transition-colors"
              >Contacts</router-link
            >
          </div>

          <hr class="border-t border-[var(--color-secondary)] my-3" />

          <div class="flex flex-col space-y-3">
             <template v-if="!authStore.isAuthenticated">
               <router-link
                to="/login"
                @click="closeMobileMenu"
                class="login-button mobile-jaro text-xl text-center" 
              >
                Login
              </router-link>
              <router-link
                to="/signup"
                @click="closeMobileMenu"
                class="signup-button mobile-jaro text-xl text-center bg-[var(--color-myyellow)] text-[var(--color-primary)] px-4 py-2 rounded-[0.7vw] hover:text-[var(--color-myred)] transition-colors"
              >
                Sign Up
              </router-link>
            </template>
             <template v-else>
               <span class="mobile-jaro text-xl text-center text-[var(--color-text-light)] py-2">
                {{ authStore.username }}
              </span>
               <button 
                @click="handleLogoutMobile"
                class="mobile-jaro text-xl text-center bg-myred hover:text-myyellow text-[var(--color-primary)] px-4 py-2 rounded-[0.7vw] transition-colors"
              >
                Logout
              </button>
            </template>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router' // useRoute больше не нужен для стилей
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleLogout = () => {
  authStore.logout();
};

const handleLogoutMobile = () => {
  closeMobileMenu(); 
  authStore.logout(); 
}
</script>

<style scoped>
</style>