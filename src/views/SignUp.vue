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
        <h2 class="text-center text-4xl text-[var(--color-text-light)] font-['Jaro']">
          Sign Up
        </h2>
        <form class="space-y-6" @submit.prevent="handleSignUp">
          
          <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-6 sm:space-y-0">
            <div class="w-full sm:w-1/2">
              <label for="firstName" class="block text-sm font-medium text-[var(--color-text-muted)]">First Name</label>
              <div class="mt-1">
                <input id="firstName" name="firstName" type="text" v-model="firstName" required placeholder="Your first name" class="appearance-none block w-full px-3 py-2 border border-[var(--color-secondary)] rounded-md shadow-sm placeholder-[var(--color-text-muted)] bg-[var(--color-secondary)] text-[var(--color-text-light)] focus:outline-none focus:ring-[var(--color-myred)] focus:border-[var(--color-myyellow)] sm:text-sm">
              </div>
            </div>
             <div class="w-full sm:w-1/2">
              <label for="lastName" class="block text-sm font-medium text-[var(--color-text-muted)]">Last Name</label>
              <div class="mt-1">
                <input id="lastName" name="lastName" type="text" v-model="lastName" required placeholder="Your last name" class="appearance-none block w-full px-3 py-2 border border-[var(--color-secondary)] rounded-md shadow-sm placeholder-[var(--color-text-muted)] bg-[var(--color-secondary)] text-[var(--color-text-light)] focus:outline-none focus:ring-[var(--color-myyellow)] focus:border-[var(--color-myyellow)] sm:text-sm">
              </div>
            </div>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-[var(--color-text-muted)]">Email address</label>
            <div class="mt-1">
              <input id="email" name="email" type="email" v-model="email" autocomplete="email" required placeholder="Enter your email" class="appearance-none block w-full px-3 py-2 border border-[var(--color-secondary)] rounded-md shadow-sm placeholder-[var(--color-text-muted)] bg-[var(--color-secondary)] text-[var(--color-text-light)] focus:outline-none focus:ring-[var(--color-myyellow)] focus:border-[var(--color-myyellow)] sm:text-sm">
            </div>
          </div>
 
          <div>
            <label for="password" class="block text-sm font-medium text-[var(--color-text-muted)]">Password</label>
            <div class="mt-1">
              <input id="password" name="password" type="password" v-model="password" required placeholder="Create a password" class="appearance-none block w-full px-3 py-2 border border-[var(--color-secondary)] rounded-md shadow-sm placeholder-[var(--color-text-muted)] bg-[var(--color-secondary)] text-[var(--color-text-light)] focus:outline-none focus:ring-[var(--color-myyellow)] focus:border-[var(--color-myyellow)] sm:text-sm">
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-[var(--color-text-muted)]">Confirm Password</label>
            <div class="mt-1">
              <input id="confirmPassword" name="confirmPassword" type="password" v-model="confirmPassword" required placeholder="Confirm your password" class="appearance-none block w-full px-3 py-2 border border-[var(--color-secondary)] rounded-md shadow-sm placeholder-[var(--color-text-muted)] bg-[var(--color-secondary)] text-[var(--color-text-light)] focus:outline-none focus:ring-[var(--color-myyellow)] focus:border-[var(--color-myyellow)] sm:text-sm">
            </div>
          </div>
 
          <div v-if="errorMsg" class="text-red-500 text-sm text-center pt-2">
            {{ errorMsg }}
          </div>
          <div v-if="successMsg" class="text-green-500 text-sm text-center pt-2">
            {{ successMsg }}
          </div>

          <div>
            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-[0.7vw] shadow-sm text-lg font-medium text-[var(--color-text-light)] bg-[var(--color-myred)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-myyellow)] transition-colors disabled:opacity-50"
            >
              <span v-if="!isLoading">Sign Up</span>
              <span v-else>Signing Up...</span>
            </button>
          </div>
        </form>
 
        <p class="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Already have an account? 
          <router-link 
            to="/login" 
            class="font-medium text-[var(--color-myred)]"
          >
            Sign In
          </router-link>
        </p>
      </div>
    </div>
 
    <div class="hidden lg:block h-full lg:col-span-1">
      <img 
        src="/src/assets/logback2.svg" 
        alt="Decorative graphic" 
        class="w-full h-full object-fill lg:object-cover min-h-[calc(100vh-150px)] overflow-visible animate-pulse"
        />
    </div>
 
  </div>
</template>
 
<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router'; 
import { useAuthStore } from '@/stores/authStore';

const router = useRouter(); 
const authStore = useAuthStore();
 
const firstName = ref(''); // Добавили
const lastName = ref('');  // Добавили
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMsg = ref(''); 
const successMsg = ref(''); 
const isLoading = ref(false); 
 
const handleSignUp = async () => {
  errorMsg.value = ''; 
  successMsg.value = '';
  
  if (password.value !== confirmPassword.value) {
    errorMsg.value = "Passwords do not match!"; 
    return;
  }
  
  isLoading.value = true; 

  // Передаем объект с нужными полями в store
  const result = await authStore.register({ 
    firstName: firstName.value, 
    lastName: lastName.value,
    email: email.value,
    password: password.value,
  });

  isLoading.value = false; 

  if (result.success) {
     successMsg.value = result.message || 'Registration successful!';
     // Опционально: очистить форму или перенаправить
     firstName.value = ''; lastName.value = ''; email.value = ''; password.value = ''; confirmPassword.value = '';
     setTimeout(() => router.push('/login'), 2000); 
  } else {
    errorMsg.value = result.message || 'Registration failed.';
  }
};
</script>
 
<style scoped>
/* Стили специфичные для SignUpView */
</style>