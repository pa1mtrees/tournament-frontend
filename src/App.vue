<template>
  <div class="relative min-h-screen"> 

<!-- {/* --- ЗАСТАВКА (Splash Screen) --- */} -->
<transition
  v-if="showSplashScreen" 
  leave-active-class="transition ease-in duration-1000"
  leave-from-class="opacity-100"
  leave-to-class="opacity-0"
>
  <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-secondary)]">
     <div class="absolute inset-0 animated-dot-pattern"></div>
     <div class="relative z-10 text-center">
        <img 
            src="/src/assets/heart.gif" 
            alt="Logo" 
            class="h-20 md:h-28 mx-auto mb-2 animate-pulse" 
        />
        <p class="jersey text-5xl text-[var(--color-myred)]">heartbit</p>
     </div>
  </div>
</transition>
<!-- {/* --- КОНЕЦ ЗАСТАВКИ --- */} -->


<!-- {/* --- ОСНОВНОЙ ЛЕЙАУТ ПРИЛОЖЕНИЯ --- */}
{/* Оборачиваем основной контент в свой <transition> для плавного появления */} -->
<transition
   enter-active-class="transition ease-out duration-1000 delay-300"
   enter-from-class="opacity-0"
   enter-to-class="opacity-100"
 >
   <!-- {/* v-else не нужен, так как v-if на transition выше */}
   {/* Используем v-show чтобы элемент оставался в DOM, но был скрыт до конца анимации splash */}
   {/* Или оставляем v-if, но тогда анимация появления сработает только после исчезновения splash */} -->
   <div v-if="!showSplashScreen" class="flex flex-col min-h-screen">
    <TheHeader /> 
    <main class="flex-grow container mx-auto px-4">
      <router-view />
    </main>
    <TheFooter />
  </div>
</transition>
<!-- {/* ----------------------------------- */} -->

</div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import TheHeader from './components/layout/TheHeader.vue'; 
import TheFooter from './components/layout/TheFooter.vue';
import { RouterView } from 'vue-router';
import { ref, onMounted } from 'vue'; // Добавили ref и onMounted

// Состояние для показа/скрытия заставки
const showSplashScreen = ref(true);

// Хук onMounted срабатывает после того, как компонент App.vue (и его дочерние)
// был примонтирован к DOM
onMounted(() => {
  // Устанавливаем таймер, чтобы скрыть заставку через N миллисекунд
  setTimeout(() => {
    showSplashScreen.value = false;
  }, 1000); // Показываем заставку 2 секунды (настройте по желанию)
});

const route = useRoute(); // Получаем текущий маршрут

// Вычисляемое свойство, чтобы определить, является ли текущий маршрут страницей входа/регистрации
const isAuthRoute = computed(() => {
  // Проверяем по имени маршрута (name), которое мы задали в router/index.js
  return route.name === 'login' || route.name === 'signup'; 
});

</script>