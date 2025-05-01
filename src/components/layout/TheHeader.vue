<template>
  <header class="bg-[var(--color-primary)] shadow-md md:rounded-b-[2vw] sticky top-0 z-50">
    <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
      <router-link to="/" class="flex items-center">
        <img src="/src/assets/Logo.svg" alt="Logo" class="h-[min(15vw,150px)]" />
      </router-link>

      <div class="hidden md:flex items-center justify-between w-full ml-10"> 
        <div class="flex items-center space-x-2 md:space-x-4 lg:space-x-6 mx-auto">
          <router-link to="/" class="fluid-nav-link dynamic-text">Home</router-link>
          <router-link to="/tournaments" class="fluid-nav-link dynamic-text">Tournaments</router-link>
          <router-link to="/about" class="fluid-nav-link dynamic-text">About Us</router-link>
          <router-link to="/contacts" class="fluid-nav-link dynamic-text">Contacts</router-link>
        </div>

        <div class="flex items-center fluid-space-x relative">
          
          <div v-if="!authStore.isAuthenticated" class="flex items-center fluid-space-x">
            <router-link to="/login" class="login-button dynamic-text">Login</router-link>
            <router-link to="/signup" class="signup-button dynamic-text bg-[var(--color-myyellow)] text-[var(--color-primary)] px-4 py-1 rounded-[0.7vw] hover:text-[var(--color-myred)] transition-colors">Sign Up</router-link>
          </div>

          <div v-else>
             <button @click="toggleUserDropdown" class="flex items-center fluid-space-x focus:outline-none">
               <img 
                  v-if="authStore.userAvatar" 
                  :src="authStore.userAvatar" 
                  alt="User Avatar" 
                  class="w-8 h-8 rounded-full border-2 border-[var(--color-myyellow)]" 
               />
               <div v-else class="w-8 h-8 rounded-full bg-[var(--color-secondary)] border-2 border-[var(--color-myyellow)] flex items-center justify-center text-sm text-[var(--color-text-light)]">
                 {{ authStore.username?.charAt(0).toUpperCase() }}
               </div>

               <span class="mobile-jaro dynamic-text text-[var(--color-text-light)]">
                 {{ authStore.userEmail }}
               </span>

               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[var(--color-text-light)] ml-1 transition-transform duration-200" :class="{'rotate-180': isUserDropdownOpen}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
               </svg>
            </button>
            
            <transition  >
              <div v-show="isUserDropdownOpen" @click="closeUserDropdown" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-[var(--color-primary)] ring-1 ring-[var(--color-secondary)] ring-opacity-5 focus:outline-none z-50">
                <router-link to="/profile" class="block px-4 py-2 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-myyellow)]">My Profile</router-link>
                <router-link to="/settings" class="block px-4 py-2 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-myyellow)]">Settings</router-link>
                <hr class="border-t border-[var(--color-secondary)] my-1"/> 
                <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-myred)]">Logout</button>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <div class="md:hidden">
        <button @click="toggleMobileMenu" aria-label="Toggle menu">
          <svg class="w-8 h-8 text-[var(--color-text-light)]" > ... </svg>
        </button>
      </div>
    </nav>

    <transition  >
      <div v-show="isMobileMenuOpen" class="md:hidden ..." >
        <div class="flex flex-col space-y-4">
          <hr class="border-t border-[var(--color-secondary)] my-3" />
          <div class="flex flex-col space-y-3">
             <template v-if="!authStore.isAuthenticated">
             </template>
             <template v-else>
                <div class="flex items-center justify-center space-x-3 py-2">
                   <img v-if="authStore.userAvatar" :src="authStore.userAvatar" alt="User Avatar" class="w-10 h-10 rounded-full border-2 border-[var(--color-myyellow)]" />
                   <div v-else class="w-10 h-10 rounded-full ... flex items-center justify-center ...">
                     {{ authStore.username?.charAt(0).toUpperCase() }}
                   </div>
                   <span class="mobile-jaro text-lg text-center text-[var(--color-text-light)] truncate max-w-[150px]">
                    {{ authStore.userEmail }}
                   </span>
                </div>
                <router-link to="/profile" @click="closeMobileMenu" class="mobile-jaro text-lg text-center ...">My Profile</router-link>
                <router-link to="/settings" @click="closeMobileMenu" class="mobile-jaro text-lg text-center ...">Settings</router-link>
                <hr class="border-t border-[var(--color-secondary)] my-3"/> 
                <button @click="handleLogoutMobile" class="mobile-jaro text-xl text-center bg-myred ..." > Logout </button>
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
   color: var(--color-myyellow);
   font-weight: 600; 
}
</style>