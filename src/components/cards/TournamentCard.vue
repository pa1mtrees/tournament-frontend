<template>
    <div class="bg-[var(--color-secondary)] rounded-[1vw] shadow-lg p-4 flex flex-col space-y-3 transition transform hover:scale-105">
      <!-- <img src="/path/to/image.jpg" alt="" class="rounded-t-lg aspect-video object-cover mb-3"> -->
      
      <h3 class="text-xl font-semibold text-[var(--color-myyellow)] truncate" :title="tournament.name">
        {{ tournament.name }}
      </h3>
  
      <div class="text-sm text-[var(--color-text-muted)] space-y-1 grow">
         <p>Status: <span class="font-medium text-[var(--color-text-light)] capitalize">{{ tournament.status }}</span></p>
         <p>Sport ID: <span class="font-medium text-[var(--color-text-light)]">{{ tournament.sport_id }}</span></p>
         <p>Format ID: <span class="font-medium text-[var(--color-text-light)]">{{ tournament.format_id }}</span></p>
         <p>Starts: <span class="font-medium text-[var(--color-text-light)]">{{ formatDate(tournament.start_date) }}</span></p>
         <p>Ends: <span class="font-medium text-[var(--color-text-light)]">{{ formatDate(tournament.end_date) }}</span></p>
         <p>Max Participants: <span class="font-medium text-[var(--color-text-light)]">{{ tournament.max_participants }}</span></p>
      </div>
  
      <div class="pt-2">
        <router-link 
          :to="{ name: 'tournament-detail', params: { id: tournament.id } }"
          class="block w-full text-center bg-[var(--color-myyellow)] text-[var(--color-primary)] px-4 py-2 rounded-[0.7vw] hover:text-[var(--color-myred)] transition-colors text-sm font-semibold"
        >
          Details
        </router-link>
      </div>
    </div>
    
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router';
  
  // Принимаем объект турнира как prop
  const props = defineProps({
    tournament: {
      type: Object,
      required: true
    }
  });
  
  // Простая функция форматирования даты
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      // Можно использовать toLocaleDateString или библиотеку date-fns
      return date.toLocaleDateString('en-CA'); // Формат YYYY-MM-DD
    } catch (e) {
      return dateString; // Возвращаем как есть при ошибке
    }
  };
  </script>
  
  <style scoped>
  /* Стили для карточки */
  </style>