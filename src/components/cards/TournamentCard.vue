<template>
  <div class="relative flex items-center bg-primary rounded-3xl shadow-md p-6 hover:shadow-lg transition-shadow gap-6 overflow-hidden">
    
    <img
      v-if="displayLogoUrl" 
      :src="displayLogoUrl" 
      alt="Background Logo"
      class="absolute left-0 top-0 w-full h-full object-cover opacity-10 blur-sm pointer-events-none select-none"
      style="z-index:1;"
    />
    
    <div class="relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex items-center justify-center z-10 bg-primary">
       <img 
          v-if="displayLogoUrl" 
          :src="displayLogoUrl" 
          alt="Tournament Logo" 
          class="object-contain w-full h-full p-1" 
        />
        <span v-else class="text-3xl text-[var(--color-myyellow)]">🏆</span> 
    </div>
    
    <div class="relative flex-1 min-w-0 z-10">
      <div class="flex items-center gap-3 mb-2 flex-wrap">
        <span class="text-xl md:text-2xl text-white truncate mobile-jaro" :title="tournament.name">{{ tournament.name }}</span>
        <span 
          :class="[getStatusBgClass(tournament.status), 'text-[10px] md:text-xs px-2 py-0.5 rounded-full font-bold whitespace-nowrap']"
        >
          {{ tournament.status }}
        </span>
      </div>
      
      <div class="flex flex-wrap gap-x-4 gap-y-1 text-gray-300 text-[11px] md:text-xs">
        <div>
          <span class="text-gray-400">Starts:</span>
          <span class="ml-1 text-white font-medium">{{ formatDate(tournament.start_date) }}</span>
        </div>
        <div v-if="sportName">
          <span class="text-gray-400">Discipline:</span>
          <span class="ml-1 text-white font-medium capitalize">{{ sportName }}</span>
        </div>
        <div v-if="formatName">
          <span class="text-gray-400">Format:</span> 
          <span class="ml-1 text-white font-medium">{{ formatName }}</span>
        </div>
        <div>
          <span class="text-gray-400">Max Players:</span>
          <span class="ml-1 text-white font-medium">{{ tournament.max_participants }}</span>
        </div>
        <div v-if="tournament.location">
            <span class="text-gray-400">Location:</span>
            <span class="ml-1 text-white font-medium">{{ tournament.location }}</span>
        </div>
         <div>
            <span class="text-gray-400">Reg. Ends:</span>
            <span class="ml-1 text-white font-medium">{{ formatDate(tournament.reg_date) }}</span>
        </div>
      </div>
    </div>

    <div class="relative z-10 ml-auto self-center flex-shrink-0">
       <router-link 
        :to="{ name: 'tournament-detail', params: { id: tournament.id } }"
        class="poppins bg-myred text-white text-sm px-4 py-2 md:px-6 rounded-xl hover:bg-myreddarker font-bold whitespace-nowrap" 
      >
        Details &gt;
      </router-link>
    </div>
  </div>
  <!-- <div class="relative flex items-center bg-secondary rounded-3xl shadow-md p-6 hover:shadow-lg transition-shadow gap-6 overflow-hidden">
    
    <img
      v-if="tournamentLogo" 
      :src="tournamentLogo" 
      alt="Background Logo"
      class="absolute left-0 top-0 w-full h-full object-cover opacity-20 blur-sm pointer-events-none select-none"
      style="z-index:1;"
    />
    
    <div class="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center z-10 bg-primary">
       <img 
          v-if="tournamentLogo" 
          :src="tournamentLogo" 
          alt="Tournament Logo" 
          class="object-contain w-full h-full" 
        />
        <span v-else class="text-3xl">🏅</span> 
    </div>
    
    <div class="relative flex-1 min-w-0 z-10">
      <div class="flex items-center gap-2 mb-2 flex-wrap">
        <span class="text-xl text-white truncate mobile-jaro font-semibold" :title="tournament.name">{{ tournament.name }}</span>
        <span 
          :class="[getStatusBgClass(tournament.status), 'text-xs px-2 py-0.5 rounded-full font-bold whitespace-nowrap']"
        >
          {{ tournament.status }}
        </span>
      </div>
      
      <div class="flex flex-wrap gap-x-4 gap-y-1 text-gray-300 text-xs">
        <div>
          <span class="text-gray-400">Starts:</span>
          <span class="ml-1 text-white font-medium">{{ formatDate(tournament.start_date) }}</span>
        </div>
        <div v-if="sportName">
          <span class="text-gray-400">Sport:</span>
          <span class="ml-1 text-white font-medium capitalize">{{ sportName }}</span>
        </div>
        <div>
          <span class="text-gray-400">Format ID:</span>
          <span class="ml-1 text-white font-medium">{{ tournament.format_id }}</span>
        </div>
        <div>
          <span class="text-gray-400">Max Players:</span>
          <span class="ml-1 text-white font-medium">{{ tournament.max_participants }}</span>
        </div>
        <div v-if="tournament.location">
            <span class="text-gray-400">Location:</span>
            <span class="ml-1 text-white font-medium">{{ tournament.location }}</span>
        </div>
      </div>
    </div>

    <div class="relative z-10 ml-auto self-center flex-shrink-0">
      <router-link 
        :to="{ name: 'tournament-detail', params: { id: tournament.id } }"
        class="bg-myred text-white text-sm px-4 py-2 rounded-xl hover:bg-primary-dark font-bold whitespace-nowrap" 
      >
        Details &gt;
      </router-link>
    </div>
  </div> -->
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useMetaStore } from '@/stores/metaStore'; // Импортируем metaStore

const props = defineProps({
  tournament: { type: Object, required: true },
  // Оставляем sportsMap, но можно будет удалить, если перейдем на metaStore
  // sportsMap: { type: Object, default: () => ({}) } 
  // TODO: Добавить formatMap позже
});

// Пытаемся получить имя спорта из карты
// const sportName = computed(() => props.sportsMap[props.tournament.sport_id] || null);
const metaStore = useMetaStore(); // Инициализируем store
// Получаем имя спорта из store
const sportName = computed(() => metaStore.sportsMap[props.tournament.sport_id] || null);

// --- НОВОЕ: Получаем имя формата из store ---
const formatName = computed(() => metaStore.formatsMap[props.tournament.format_id] || null);
// -----------------------------------------

// --- ОБНОВЛЕННАЯ ЛОГИКА ДЛЯ ЛОГОТИПА ТУРНИРА ---
const displayLogoUrl = computed(() => {
    // 1. Проверяем, есть ли logo_url в данных турнира (от бэкенда)
    if (props.tournament.logo_url) {
        // Если это относительный путь от бэкенда, нужно будет добавить VITE_API_BASE_URL
        // Если это полный URL (например, из R2), то просто возвращаем его
        // Предположим, бэкенд возвращает ПОЛНЫЙ URL
        return props.tournament.logo_url;
    }
    // 2. Временная заглушка, если нет logo_url (можно убрать, когда будет реальное лого)
    // return '/images/travel.png'; // Если вы хотите оставить временное лого

    // 3. Если нет, возвращаем null (будет показана иконка 🏆)
    return null; 
}); 
// ---------------------------------------------

// Форматирование даты
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-CA'); // YYYY-MM-DD
  } catch (e) { return dateString; }
};

// Определение цвета для статуса
const getStatusBgClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'ongoing': // Добавим синоним
      return 'bg-myred text-white'; // Красный для активных
    case 'registration':
      return 'bg-myyellow text-primary'; // Желтый для регистрации
    case 'completed':
    case 'ended': // Добавим синоним
      return 'bg-gray-700 text-gray-300'; // Серый для завершенных
     case 'soon':
      return 'bg-blue-600 text-white'; // Синий для будущих
     case 'canceled':
      return 'bg-black text-gray-500'; // Черный/темный для отмененных
    default:
      return 'bg-secondary text-white'; // По умолчанию
  }
};
</script>

<style scoped>
/* Можно добавить стили, если нужно */
</style>