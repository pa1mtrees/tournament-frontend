<template>
  <div class="space-y-8 py-8">
    <h1 class="text-4xl font-['Jaro'] text-[var(--color-text-light)]">Tournaments</h1>
    
    <div class="bg-[var(--color-primary)] p-4 rounded-[1vw] shadow-md space-y-4">
        <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-grow">
                <label for="sportFilter" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Sport</label>
                <div class="flex flex-wrap gap-2">
                  <button 
                        @click="selectedSportId = null"
                        :class="[
                            'px-3 py-1 rounded-full text-xs font-medium transition-colors', 
                            selectedSportId === null ? 'bg-[var(--color-myred)] text-[var(--color-text-light)]' : 'bg-[var(--color-secondary)] text-[var(--color-text-muted)] hover:bg-gray-600'
                        ]">
                        All
                     </button>                     <!-- {/* Используем sportsList из metaStore */} -->
                     <button 
                        v-for="sport in metaStore.sports" :key="sport.id"
                        @click="selectedSportId = sport.id"
                         :class="[
                            'px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize', 
                            selectedSportId === sport.id ? 'bg-[var(--color-myyellow)] text-[var(--color-primary)]' : 'bg-[var(--color-secondary)] text-[var(--color-text-muted)] hover:bg-gray-600'
                        ]">
                        {{ sport.name }}
                     </button>
                     <span v-if="metaStore.sportsLoading" class="text-xs text-[var(--color-text-muted)] self-center">Loading...</span>
                </div>
                 <p v-if="metaStore.sportsError" class="text-xs text-red-500 mt-1">{{ metaStore.sportsError }}</p>
            </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
             <div class="col-span-2">
                <label for="search" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Search (Client-side)</label>
                <input type="text" id="search" v-model="searchQuery" placeholder="Search by name..." class="input-style w-full py-1.5" />
            </div>
             <div>
                <label for="statusFilter" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Status</label>
                <select id="statusFilter" v-model="selectedStatus" class="select-style"> ... </select>
            </div>
             <div>
                <label for="timeframeFilter" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Timeframe (Client-side)</label>
                 <select id="timeframeFilter" v-model="selectedTimeframe" class="select-style"> ... </select>
            </div>
             <div>
                 <label for="sortOrder" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Sort By (Client-side)</label>
                 <select id="sortOrder" v-model="selectedSort" class="select-style"> ... </select>
            </div>
             <div class="self-end">
              <button 
                v-if="authStore.userRole === 'player' || authStore.userRole === 'organizer'"
                @click="openCreateTournamentModal" 
                class="w-full bg-[var(--color-myred)] text-[var(--color-text-light)] px-4 py-1.5 rounded-[0.7vw] text-sm font-medium">
                Create Tournament
              </button>
             </div>
        </div>
    </div>
    <hr class="pt-4 border-[var(--color-secondary)]">

    <div v-if="isLoading" class="text-center py-10 text-[var(--color-text-muted)]"> Loading tournaments... </div>
    <div v-else-if="errorMsg" class="text-center py-10 text-red-500"> Error: {{ errorMsg }} </div>
    <div v-else-if="displayTournaments.length === 0" class="text-center py-10 text-[var(--color-text-muted)]"> No tournaments match your criteria. </div>
    <!-- {/* Используем TournamentCard и передаем sportsMap из metaStore */} -->
    <div v-else class="grid grid-cols-1 gap-6">
      <TournamentCard 
        v-for="tournament in displayTournaments" 
        :key="tournament.id"
        :tournament="tournament" 
      />
    </div>

    <CreateTournamentModal :is-open="isCreateTournamentModalOpen" @close="closeCreateTournamentModal" @tournament-created="handleTournamentCreated" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import TournamentCard from '@/components/cards/TournamentCard.vue'; 
import CreateTournamentModal from '@/components/modals/CreateTournamentModal.vue';
import { useAuthStore } from '@/stores/authStore';
import { useMetaStore } from '@/stores/metaStore'; // Используем metaStore
import apiClient from '@/services/apiClient';

const authStore = useAuthStore(); // Получаем auth store для проверки роли
const metaStore = useMetaStore(); // Инициализируем metaStore

const tournaments = ref([]); // Массив для ВСЕХ загруженных (mock) турниров
const isLoading = ref(false);
const errorMsg = ref('');

// Состояния для фильтров, сортировки, поиска
const searchQuery = ref('');
const selectedStatus = ref('all'); // 'all', 'soon', 'registration', etc.
const selectedTimeframe = ref('all'); // 'all', 'upcoming', 'past'
const selectedSort = ref('start_date_desc'); // 'start_date_desc', 'start_date_asc', 'name_asc', 'name_desc'
const selectedSportId = ref(null); // null для всех видов спорта
const isCreateTournamentModalOpen = ref(false);

const fetchTournaments = async () => { 
  isLoading.value = true; 
  errorMsg.value = '';
  console.log("Fetching tournaments from API with filters:", { status: selectedStatus.value, sport_id: selectedSportId.value });

  const params = { limit: 100, offset: 0 }; // Загружаем больше для клиентской фильтрации
  if (selectedStatus.value !== 'all') params.status = selectedStatus.value;
  if (selectedSportId.value !== null) params.sport_id = selectedSportId.value;
  
  try {
    const response = await apiClient.get('/tournaments', { params: params });
    tournaments.value = response.data?.tournaments || []; 
    console.log("Tournaments loaded:", tournaments.value.length);
  } catch (err) { /* ... обработка ошибок ... */ } 
  finally { isLoading.value = false; }
};

// --- Computed свойство для фильтрации и сортировки ---
const displayTournaments  = computed(() => {
  let result = [...tournaments.value]; // Работаем с копией

  // 1. Фильтрация по поиску (по имени)
  if (searchQuery.value) {
    result = result.filter(t => 
      t.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // 2. Фильтрация по статусу
  if (selectedStatus.value !== 'all') {
    result = result.filter(t => t.status === selectedStatus.value);
  }
  
  // 3. Фильтрация по виду спорта
  if (selectedSportId.value !== null) {
      result = result.filter(t => t.sport_id === selectedSportId.value);
  }

  // 4. Фильтрация по времени
  const now = new Date();
  if (selectedTimeframe.value === 'upcoming') {
    // Турниры, которые еще не начались
    result = result.filter(t => new Date(t.start_date) > now);
  } else if (selectedTimeframe.value === 'past') {
    // Турниры, которые уже закончились
     result = result.filter(t => new Date(t.end_date) < now);
  }
  // TODO: Добавить логику для Date Range, если будут пикеры

  // 5. Сортировка
  switch (selectedSort.value) {
    case 'start_date_desc':
      result.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
      break;
    case 'start_date_asc':
      result.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
      break;
    case 'name_asc':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
     case 'name_desc':
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }

  return result;
});

// Функции модального окна
const openCreateTournamentModal = () => { isCreateTournamentModalOpen.value = true; };
const closeCreateTournamentModal = () => { isCreateTournamentModalOpen.value = false; };
const handleTournamentCreated = (newTournament) => { /* ... */ };

// Следим за фильтрами и перезагружаем
watch([selectedStatus, selectedSportId], () => { fetchTournaments(); });

// Загружаем начальные данные
onMounted(() => {
  fetchTournaments(); 
  metaStore.fetchSports(); // Вызываем загрузку спортов из store
  metaStore.fetchFormats(); // Загружаем форматы

});

</script>
<style scoped>

</style>