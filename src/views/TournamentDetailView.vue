<template>
    <div class="space-y-6">
      
      <!-- {/* Кнопка Назад */} -->
      <div class="mb-4">
        <router-link 
          to="/tournaments" 
          class="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-myyellow)] inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tournaments
        </router-link>
      </div>
  
      <!-- {/* Загрузка/Ошибка */} -->
      <div v-if="isLoading" class="text-center py-10 text-[var(--color-text-muted)]">
        Loading tournament details...
      </div>
      <div v-else-if="errorMsg" class="text-center py-10 text-red-500">
        Error: {{ errorMsg }}
      </div>
  
      <!-- {/* Основной контент, если турнир загружен */} -->
      <div v-else-if="tournament" class="bg-[var(--color-primary)] p-6 rounded-[1vw] shadow-lg space-y-6">
        
        <!-- {/* Заголовок и Статус */} -->
        <div class="flex justify-between items-start gap-4">
          <h1 class="text-3xl md:text-4xl font-['Jaro'] text-[var(--color-text-light)] break-words">
            {{ tournament.name }}
          </h1>
           <span 
            :class="[getStatusBgClass(tournament.status), 'text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap mt-1']"
          >
            {{ tournament.status }}
          </span>
        </div>
        
        <!-- {/* TODO: Табы (About, Participants, Bracket, Results) */}
        {/* Пока просто выводим секцию "About" */} -->
        <div class="border-t border-[var(--color-secondary)] pt-6">
            <h2 class="text-2xl text-[var(--color-text-light)] mb-4">About</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
               <!-- {/* Левая колонка инфо */} -->
               <div class="space-y-2">
                   <p><strong class="text-[var(--color-text-muted)] w-28 inline-block">Sport:</strong> <span class="text-[var(--color-text-light)] capitalize">{{ sportName }}</span></p>
                   <p><strong class="text-[var(--color-text-muted)] w-28 inline-block">Format:</strong> <span class="text-[var(--color-text-light)] capitalize">{{ formatName }}</span></p>
                   <p><strong class="text-[var(--color-text-muted)] w-28 inline-block">Organizer ID:</strong> <span class="text-[var(--color-text-light)]">{{ tournament.organizer_id }}</span></p> 
                   <!-- {/* TODO: Загрузить имя организатора */} -->
                   <p v-if="tournament.location"><strong class="text-[var(--color-text-muted)] w-28 inline-block">Location:</strong> <span class="text-[var(--color-text-light)]">{{ tournament.location }}</span></p>
                   <p><strong class="text-[var(--color-text-muted)] w-28 inline-block">Participants:</strong> <span class="text-[var(--color-text-light)]">? / {{ tournament.max_participants }}</span></p> 
                   <!-- {/* TODO: Загрузить текущее кол-во */} -->
               </div>
               <!-- {/* Правая колонка инфо (Даты) */} -->
               <div class="space-y-2">
                 <h3 class="text-2xl text-[var(--color-text-light)] mb-2">Key Dates</h3>
                 <!-- {/* --- НОВЫЙ КОМПОНЕНТ TIMELINE --- */} -->
                 <el-timeline v-if="tournamentTimeline.length > 0">
                    <el-timeline-item
                        v-for="(activity, index) in tournamentTimeline"
                        :key="index"
                        :timestamp="activity.formattedTimestamp" 
                        placement="top" 
                        :color="activity.color || '#ffb300'" 
                    >
                       <span class="text-[var(--color-text-light)]">{{ activity.content }}</span>
                    </el-timeline-item>
                 </el-timeline>
                 <p v-else class="text-[var(--color-myred)] italic">Date information not available.</p>
                 <!-- {/* --- КОНЕЦ TIMELINE --- */} -->
             </div>

                <!-- {/* Описание */} -->
               <div class="md:col-span-2 pt-4 space-y-2">
                  <h3 class="text-2xl text-[var(--color-text-light)]">Description</h3>
                  <p v-if="tournament.description" class="text-[var(--color-text-light)] whitespace-pre-wrap">{{ tournament.description }}</p>
                  <p v-else class="text-[var(--color-text-muted)] italic">No description provided.</p>
               </div>
            </div>
  
            <!-- {/* Кнопка регистрации (пока заглушка) */} -->
             <div class="mt-6 text-center">
                  <button 
                    v-if="canRegister"
                    class="bg-[var(--color-myred)] text-white text-lg px-8 py-3 rounded-xl hover:bg-opacity-80 font-bold"
                  >
                    Register Now
                  </button>
                   <p v-else-if="tournament.status !== 'canceled'" class="text-sm text-[var(--color-text-muted)]">
                      Registration is currently closed for this tournament.
                   </p>
             </div>
        </div>
  
         <!-- {/* TODO: Placeholder для других табов */} -->
          <div class="border-t border-[var(--color-secondary)] pt-6 mt-6 text-center text-[var(--color-text-muted)]">
              Participants, Bracket, and Results sections coming soon...
          </div>
  
      </div>
       <div v-else class="text-center py-10 text-[var(--color-text-muted)]">
         Tournament not found.
      </div>
  
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute, RouterLink } from 'vue-router';
  import apiClient from '@/services/apiClient';
  import { useMetaStore } from '@/stores/metaStore'; 
  import { useAuthStore } from '@/stores/authStore'; // Для проверки статуса регистрации
  
  // Получаем ID из пропсов роутера
  const props = defineProps({
    id: {
      type: [String, Number], // Роутер передает как строку
      required: true
    }
  });


// --- НОВАЯ Логика для Timeline ---
// Форматирование даты для timestamp в таймлайне
const formatDateForTimeline = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); 
  } catch (e) { return ''; }
};

// Computed свойство для генерации данных таймлайна
const tournamentTimeline = computed(() => {
  const activities = [];
  const t = tournament.value; // Сокращение для удобства
  if (!t) return [];

  const now = new Date();

  // Добавляем событие окончания регистрации
  if (t.reg_date) {
      const regDate = new Date(t.reg_date);
      activities.push({
          content: `Registration Ends`,
          timestamp: t.reg_date, // Исходная дата для сортировки
          formattedTimestamp: formatDateForTimeline(t.reg_date),
          color: regDate < now ? '#a0a0a0' : '#e6a23c' // Серый если прошло, оранжевый если нет
      });
  }
  // Добавляем событие начала турнира
  if (t.start_date) {
       const startDate = new Date(t.start_date);
      activities.push({
          content: `Tournament Starts`,
          timestamp: t.start_date,
          formattedTimestamp: formatDateForTimeline(t.start_date),
          color: startDate < now ? '#a0a0a0' : '#67c23a' // Серый если прошло, зеленый если нет
      });
  }
  // Добавляем событие окончания турнира
  if (t.end_date) {
       const endDate = new Date(t.end_date);
      activities.push({
          content: `Tournament Ends`,
          timestamp: t.end_date,
          formattedTimestamp: formatDateForTimeline(t.end_date),
           color: endDate < now ? '#a0a0a0' : '#f56c6c' // Серый если прошло, красный если нет
      });
  }

  // Сортируем события по дате
  activities.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return activities;
});
// --- КОНЕЦ Логики для Timeline ---

  const metaStore = useMetaStore();
  const authStore = useAuthStore(); // Пока не используется, но может понадобиться для кнопки Register
  
  const tournament = ref(null);
  const isLoading = ref(true);
  const errorMsg = ref('');
  
  // Загрузка данных турнира
  const fetchTournamentDetails = async (tournamentId) => {
    // Проверяем, что ID валидный
    const id = parseInt(tournamentId);
    if (isNaN(id) || id <= 0) {
        errorMsg.value = 'Invalid Tournament ID.';
        isLoading.value = false;
        tournament.value = null;
        return;
    }
  
    isLoading.value = true;
    errorMsg.value = '';
    tournament.value = null;
    try {
      // Запрос GET /tournaments/{id}
      const response = await apiClient.get(`/tournaments/${id}`);
      // Ожидаем ответ { "tournament": { ... } }
      if (response.data && response.data.tournament) {
          tournament.value = response.data.tournament;
      } else {
           throw new Error('Tournament data not found in response.');
      }
    } catch (err) {
      console.error("Error fetching tournament details:", err);
      errorMsg.value = err.response?.data?.message || `Failed to load tournament (ID: ${id}).`;
       if (err.response?.status === 404) {
          errorMsg.value = `Tournament with ID ${id} not found.`;
      }
    } finally {
      isLoading.value = false;
    }
  };
  
  // Форматирование даты и времени
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-GB', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
      }); 
    } catch (e) { return dateString; }
  };
  
  // Определение класса для статуса (скопировано из TournamentCard)
  const getStatusBgClass = (status) => { /* ... как раньше ... */ };
  
  // Получение имен спорта и формата из store
  const sportName = computed(() => {
      return tournament.value ? (metaStore.sportsMap[tournament.value.sport_id] || `ID: ${tournament.value.sport_id}`) : '...';
  });
  const formatName = computed(() => {
      return tournament.value ? (metaStore.formatsMap[tournament.value.format_id] || `ID: ${tournament.value.format_id}`) : '...';
  });
  
  // Можно ли регистрироваться? (Примерная логика)
  const canRegister = computed(() => {
      return tournament.value?.status === 'registration';
      // TODO: Добавить проверку, не зарегистрирован ли пользователь уже
  });
  
  // Следим за изменением ID в пропсах (если используется <router-view :key="$route.path">)
  // или просто загружаем один раз при монтировании
  watch(
      () => props.id, 
      (newId) => {
          fetchTournamentDetails(newId);
      },
      { immediate: true } // Выполнить сразу при загрузке
  );
  
  // Убедимся, что метаданные (спорт, форматы) загружены
  onMounted(() => {
      if (metaStore.sports.length === 0) metaStore.fetchSports();
      if (metaStore.formats.length === 0) metaStore.fetchFormats();
  });
  
  </script>
  
  <style scoped>
  /* Стили для страницы деталей */
  </style>