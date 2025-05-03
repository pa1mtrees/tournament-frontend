<template>
  <div class="relative lg:grid lg:grid-cols-2 items-center">

    <div class="block md:block lg:hidden absolute inset-0 z-0">
      <img 
        src="/src/assets/logback2.svg" 
        alt="" 
        aria-hidden="true"
        class="w-full h-full object-cover"
        />
    </div>
 
    <div class="relative z-10 flex justify-center lg:justify-end items-center py-12 px-4 sm:min-h-[calc(100vh-150px)] lg:min-h-0"> 
      <div class="w-full max-w-md p-8 space-y-6 bg-[var(--color-primary)] rounded-[1vw] shadow-lg">
        <h2 class="text-center text-3xl font-bold text-[var(--color-myyellow)] font-['Jaro']">
          Sign In
        </h2>
        <form class="space-y-6" @submit.prevent="handleLogin">
          
          <div>
            <label for="email" class="block text-sm font-medium text-[var(--color-text-muted)]">
              Email
            </label>
            <div class="mt-1">
              <input 
                id="email" 
                name="email" 
                type="email" 
                v-model="email"
                autocomplete="email"
                required 
                placeholder="Enter your email"
                class="appearance-none block w-full px-3 py-2 border border-[var(--color-secondary)] rounded-md shadow-sm placeholder-[var(--color-text-muted)] bg-[var(--color-secondary)] text-[var(--color-text-light)] focus:outline-none focus:ring-[var(--color-myyellow)] focus:border-[var(--color-myyellow)] sm:text-sm"
              >
            </div>
          </div>
 
          <div>
            <label for="password" class="block text-sm font-medium text-[var(--color-text-muted)]">
              Password
            </label>
            
            <div class="mt-1">
              <input data-popover-target="popover-password" data-popover-placement="bottom"
                id="password" 
                name="password" 
                type="password" 
                v-model="password"
                required 
                placeholder="Enter your password"
                class="appearance-none block w-full px-3 py-2 border border-[var(--color-secondary)] rounded-md shadow-sm placeholder-[var(--color-text-muted)] bg-[var(--color-secondary)] text-[var(--color-text-light)] focus:outline-none focus:ring-[var(--color-myyellow)] focus:border-[var(--color-myyellow)] sm:text-sm"
              >
            </div>
          </div>

          <div v-if="errorMsg" class="text-red-500 text-sm text-center pt-2">
             {{ errorMsg }}
          </div>
 
          <div>
            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-[0.7vw] shadow-sm text-lg font-medium text-[var(--color-text-light)] bg-[var(--color-myred)] hover:text-[var(--color-myyellow)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-myred)] transition-colors disabled:opacity-50"
            >
               <span v-if="!isLoading">Sign In</span>
               <span v-else>Loading...</span>
            </button>
          </div>
        </form>
 
        <p class="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Do not have an account? 
          <router-link 
            to="/signup" 
            class="font-medium text-[var(--color-myyellow)] hover:text-[var(--color-myred)]"
          >
            Sign Up
          </router-link>
        </p>
      </div>
    </div>
 
    <div class="hidden lg:block h-full lg:col-span-1">
      <img 
        src="/src/assets/logback2.svg" 
        alt="Decorative graphic" 
        class="w-full h-full object-fill lg:object-cover min-h-[calc(100vh-150px)] overflow-visible"
        />
    </div>
 
  </div>
</template>
 
<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router'; 
import { useAuthStore } from '@/stores/authStore'; 

const authStore = useAuthStore(); 
 
const email = ref(''); // Переименовали username -> email
const password = ref('');
const errorMsg = ref(''); 
const isLoading = ref(false); 

const handleLogin = async () => { 
  errorMsg.value = ''; 
  isLoading.value = true; 

  // Передаем email и password в store
  const result = await authStore.login({ 
    email: email.value, 
    password: password.value 
  });

  isLoading.value = false; 

  if (!result.success) {
    errorMsg.value = result.message || 'Failed to log in.'; 
  }
  // Успешный редирект обрабатывается в store
};
</script>
 
<style scoped>
/* Стили специфичные для LoginView */
</style>