<template>
    <div class="space-y-8">
      <h1 class="text-4xl font-['Jaro'] text-[var(--color-myyellow)]">My Profile</h1>
  
      <div class="bg-[var(--color-primary)] p-6 rounded-[1vw] shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
  
        <div class="flex-shrink-0">
          <img 
            v-if="authStore.userAvatar" 
            :src="authStore.userAvatar" 
            alt="User Avatar" 
            class="w-24 h-24 rounded-full border-4 border-[var(--color-myyellow)]" 
          />
           <div v-else class="w-24 h-24 rounded-full bg-[var(--color-secondary)] border-4 border-[var(--color-myyellow)] flex items-center justify-center text-4xl text-[var(--color-text-light)] font-bold">
              {{ authStore.username?.charAt(0).toUpperCase() }}
            </div>
        </div>
  
        <div class="text-center sm:text-left">
          <h2 class="text-2xl text-[var(--color-text-light)]">{{ authStore.username }}</h2>
          <p class="text-sm text-[var(--color-text-muted)]">email@example.com</p>
          <p class="text-sm text-[var(--color-text-muted)]">Joined: January 2025</p>
        </div>
  
        <div class="sm:ml-auto">
          <router-link 
            to="/settings" 
            class="inline-block bg-[var(--color-myyellow)] text-[var(--color-primary)] px-5 py-2 rounded-[0.7vw] hover:text-[var(--color-myred)] transition-colors text-sm font-medium"
          >
            Edit Profile
          </router-link>
        </div>
      </div>
  
      <div class="space-y-6">
        <div>
          <h3 class="text-2xl text-[var(--color-text-light)] mb-4">My Tournaments</h3>
          <div class="bg-[var(--color-primary)] p-6 rounded-[1vw] shadow-lg text-center text-[var(--color-text-muted)]">
            Tournaments you've joined or created will appear here. (Coming Soon)
          </div>
        </div>
  
        <div>
          <h3 class="text-2xl text-[var(--color-text-light)] mb-4">Match History</h3>
          <div class="bg-[var(--color-primary)] p-6 rounded-[1vw] shadow-lg text-center text-[var(--color-text-muted)]">
            Your recent match results will appear here. (Coming Soon)
          </div>
        </div>
      </div>
  
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '@/stores/authStore';
  import { RouterLink } from 'vue-router';
  
  const authStore = useAuthStore();
  
  // Здесь позже можно будет загружать доп. данные для профиля
  </script>
  
  <style scoped>
  /* Стили для страницы профиля */
  </style>