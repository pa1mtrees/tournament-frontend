<template>
  <div class="flex flex-col min-h-screen">
    <TheHeader /> 
    <main 
      class="flex-grow" 
      :class="{ 'container mx-auto px-4 py-8': !isAuthRoute }" 
    >      <router-view />
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import TheHeader from './components/layout/TheHeader.vue'; 
import TheFooter from './components/layout/TheFooter.vue';
import { RouterView } from 'vue-router';

const route = useRoute(); // Получаем текущий маршрут

// Вычисляемое свойство, чтобы определить, является ли текущий маршрут страницей входа/регистрации
const isAuthRoute = computed(() => {
  // Проверяем по имени маршрута (name), которое мы задали в router/index.js
  return route.name === 'login' || route.name === 'signup'; 
});

</script>