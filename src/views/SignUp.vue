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
          <h2 class="text-center text-3xl text-[var(--color-myyellow)] font-['Jaro']">
            First time here?
          </h2>
          <form class="space-y-6" @submit.prevent="handleSignUp">
            
            <div>
              <label for="username" class="block text-sm font-medium text-[var(--color-text-muted)]">
                Username
              </label>
              <div class="mt-1">
                <input 
                  id="username" 
                  name="username" 
                  type="text" 
                  v-model="username"
                  required 
                  placeholder="Choose a username"
                  class="appearance-none block w-full px-3 py-2 border border-[var(--color-secondary)] rounded-md shadow-sm placeholder-[var(--color-text-muted)] bg-[var(--color-secondary)] text-[var(--color-text-light)] focus:outline-none focus:ring-[var(--color-myyellow)] focus:border-[var(--color-myyellow)] sm:text-sm"
                >
              </div>
            </div>
  
            <div>
              <label for="email" class="block text-sm font-medium text-[var(--color-text-muted)]">
                Email address
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
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  v-model="password"
                  required 
                  placeholder="Create a password"
                  class="appearance-none block w-full px-3 py-2 border border-[var(--color-secondary)] rounded-md shadow-sm placeholder-[var(--color-text-muted)] bg-[var(--color-secondary)] text-[var(--color-text-light)] focus:outline-none focus:ring-[var(--color-myyellow)] focus:border-[var(--color-myyellow)] sm:text-sm"
                >
              </div>
            </div>
  
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-[var(--color-text-muted)]">
                Confirm Password
              </label>
              <div class="mt-1">
                <input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password" 
                  v-model="confirmPassword"
                  required 
                  placeholder="Confirm your password"
                  class="appearance-none block w-full px-3 py-2 border border-[var(--color-secondary)] rounded-md shadow-sm placeholder-[var(--color-text-muted)] bg-[var(--color-secondary)] text-[var(--color-text-light)] focus:outline-none focus:ring-[var(--color-myyellow)] focus:border-[var(--color-myyellow)] sm:text-sm"
                >
              </div>
            </div>
   
            <div>
              <button 
                type="submit" 
                class="mobile-jaro text-xl w-full flex justify-center py-2 px-4 border border-transparent rounded-[0.7vw] shadow-sm font-medium text-[var(--color-primary)] bg-[var(--color-myyellow)] hover:text-[var(--color-myred)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-myyellow)] transition-colors"
              >
                Sign Up
              </button>
            </div>
          </form>
   
          <p class="mt-6 text-center text-sm text-[var(--color-text-muted)]">
            Already have an account? 
            <router-link 
              to="/login" 
              class="font-medium text-[var(--color-myyellow)] hover:text-[var(--color-myred)]"
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
          class="w-full h-full object-fill lg:object-cover min-h-[calc(100vh-150px)] overflow-visible"
          />
      </div>
   
    </div>
  </template>
   
  <script setup>
  import { ref } from 'vue';
  import { RouterLink, useRouter } from 'vue-router'; 
   
  const router = useRouter(); 
   
  const username = ref('');
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
   
  const handleSignUp = () => {
    if (password.value !== confirmPassword.value) {
      alert("Passwords do not match!"); // Replace with better notification
      return;
    }
    console.log('Signing up with:', { 
      username: username.value, 
      email: email.value,
      password: password.value // Do not send confirmPassword to backend
    });
    // TODO: Add actual API call logic
  
    // Example redirect after sign up
    router.push('/login');
  };
  </script>
   
  <style scoped>
  /* Стили специфичные для SignUpView */
  </style>