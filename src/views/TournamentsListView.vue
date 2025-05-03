<template>
  <div class="space-y-8">
    <h1 class="text-4xl font-['Jaro'] text-[var(--color-myyellow)]">Tournaments</h1>
    <div class="bg-[var(--color-primary)] p-4 rounded-[1vw] shadow-md space-y-4">
        <!-- {/* Верхний ряд: Меню спорта и Поиск */} -->
        <div class="flex flex-col md:flex-row">
            <!-- {/* Меню Спорта */} -->
            <div class="flex-grow">
                <label for="sportFilter" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Sport</label>
                <div class="flex flex-wrap gap-2">
                     <button 
                        @click="selectedSportId = null"
                        :class="[
                            'px-3 py-1 rounded-full text-xs font-medium transition-colors', 
                            selectedSportId === null ? 'bg-[var(--color-myyellow)] text-[var(--color-primary)]' : 'bg-[var(--color-secondary)] text-[var(--color-text-muted)] hover:bg-gray-600'
                        ]">
                        All
                     </button>
                     <button 
                        v-for="sport in sportsList" :key="sport.id"
                        @click="selectedSportId = sport.id"
                         :class="[
                            'px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize', 
                            selectedSportId === sport.id ? 'bg-[var(--color-myyellow)] text-[var(--color-primary)]' : 'bg-[var(--color-secondary)] text-[var(--color-text-muted)] hover:bg-gray-600'
                        ]">
                        {{ sport.name }}
                     </button>
                     <span v-if="sportsLoading" class="text-xs text-[var(--color-text-muted)] self-center">Loading...</span>
                     <!-- {/* TODO: Dropdown для > N видов спорта */} -->
                </div>
                 <p v-if="sportsError" class="text-xs text-red-500 mt-1">{{ sportsError }}</p>
            </div>
        </div>
    </div>
    <!-- {/* --- Блок Фильтров, Сортировки, Поиска и Создания --- */} -->
    <div class="bg-[var(--color-primary)] p-4 rounded-[1vw] shadow-md space-y-4">
      
        <!-- {/* Нижний ряд: Фильтры и Сортировка */} -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
                      <!-- {/* Поиск */} -->
              <div class="col-span-2">
                <label for="search" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Search</label>
                <input 
                    type="text" 
                    id="search" 
                    v-model="searchQuery" 
                    placeholder="Search by name..."
                    class="appearance-none block w-full px-3 py-1.5 border border-[var(--color-secondary)] rounded-md shadow-sm placeholder-[var(--color-text-muted)] bg-[var(--color-secondary)] text-[var(--color-text-light)] focus:outline-none focus:ring-[var(--color-myyellow)] focus:border-[var(--color-myyellow)] sm:text-sm"
                />
            </div>
             <div>
                <label for="statusFilter" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Status</label>
                <select id="statusFilter" v-model="selectedStatus" class="select-style">
                    <option class="option-style" value="all">All</option>
                    <option class="option-style" value="soon">Soon</option>
                    <option value="registration">Registration</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                </select>
            </div>
             <div>
                <label for="timeframeFilter" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Timeframe</label>
                 <select id="timeframeFilter" v-model="selectedTimeframe" class="select-style">
                    <option value="all">All</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                    <!-- {/* TODO: Date Range Picker */} -->
                </select>
            </div>
             <div>
                 <label for="sortOrder" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Sort By</label>
                 <select id="sortOrder" v-model="selectedSort" class="select-style">
                    <option value="start_date_desc">Start Date (Newest)</option>
                    <option value="start_date_asc">Start Date (Oldest)</option>
                    <option value="name_asc">Name (A-Z)</option>
                    <option value="name_desc">Name (Z-A)</option>
                    <!-- {/* Добавить другие опции */} -->
                </select>
            </div>
            <!-- {/* Кнопка Create Tournament */} -->
             <div class="self-end">
                <button 
                    
                    @click="openCreateTournamentModal"
                    class="w-full bg-[var(--color-myyellow)] text-[var(--color-primary)] px-4 py-1.5 rounded-[0.7vw] hover:text-[var(--color-myred)] transition-colors text-sm font-medium"
                >
                    Create Tournament
                </button>
             </div>
        </div>
        <hr class="pt-4">
        <div v-if="isLoading" class="text-center py-10 text-[var(--color-text-muted)]">
      Loading tournaments...
    </div>
    <div v-else-if="errorMsg" class="text-center py-10 text-red-500">
      Error: {{ errorMsg }}
    </div>
    <!-- {/* Отображаем отфильтрованный/отсортированный список */} -->
    <div v-else-if="filteredAndSortedTournaments.length === 0" class="text-center py-10 text-[var(--color-text-muted)]">
      No tournaments match your criteria.
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <TournamentCard 
        v-for="tournament in filteredAndSortedTournaments" 
        :key="tournament.id"
        :tournament="tournament" 
      />
    </div>
    </div>
    <!-- {/* --- КОНЕЦ Блока Фильтров --- */}
 -->



    <!-- {/* Модальное окно создания турнира */} -->
    <CreateTournamentModal 
      :is-open="isCreateTournamentModalOpen" 
      @close="closeCreateTournamentModal" 
      @tournament-created="handleTournamentCreated" 
    />

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import TournamentCard from '@/components/cards/TournamentCard.vue'; 
import CreateTournamentModal from '@/components/modals/CreateTournamentModal.vue'; // Импортируем модалку турнира
import { useAuthStore } from '@/stores/authStore';
import apiClient from '@/services/apiClient';

const authStore = useAuthStore(); // Получаем auth store для проверки роли

const tournaments = ref([]); // Массив для ВСЕХ загруженных (mock) турниров
const isLoading = ref(false);
const errorMsg = ref('');

// Состояния для фильтров, сортировки, поиска
const searchQuery = ref('');
const selectedStatus = ref('all'); // 'all', 'soon', 'registration', etc.
const selectedTimeframe = ref('all'); // 'all', 'upcoming', 'past'
const selectedSort = ref('start_date_desc'); // 'start_date_desc', 'start_date_asc', 'name_asc', 'name_desc'
const selectedSportId = ref(null); // null для всех видов спорта

// Состояние для списка видов спорта
const sportsList = ref([]);
const sportsLoading = ref(false);
const sportsError = ref('');

// Состояние для модального окна
const isCreateTournamentModalOpen = ref(false);

// --- MOCK DATA (как в прошлый раз) ---
const mockTournaments = [
    { id: 1, name: "Summer Football Championship", description: "Annual summer football cup", sport_id: 1, format_id: 1, organizer_id: 1, reg_date: "2025-05-10T00:00:00Z", start_date: "2025-06-01T00:00:00Z", end_date: "2025-06-15T00:00:00Z", location: "City Stadium", status: "registration", max_participants: 32 },
    { id: 2, name: "Winter E-Sports League", description: null, sport_id: 2, format_id: 2, organizer_id: 2, reg_date: "2025-11-01T00:00:00Z", start_date: "2025-12-01T00:00:00Z", end_date: "2026-01-31T00:00:00Z", location: "Online", status: "soon", max_participants: 64 },
    { id: 3, name: "Local Tennis Open", description: "Open tennis tournament", sport_id: 3, format_id: 1, organizer_id: 1, reg_date: "2025-07-01T00:00:00Z", start_date: "2025-07-15T00:00:00Z", end_date: "2025-07-20T00:00:00Z", location: "Tennis Club", status: "active", max_participants: 16 },
    { id: 4, name: "Grandmaster Chess Challenge", description: "Elite chess competition", sport_id: 4, format_id: 3, organizer_id: 3, reg_date: "2025-08-01T00:00:00Z", start_date: "2025-09-01T00:00:00Z", end_date: "2025-09-05T00:00:00Z", location: "Grand Hall", status: "completed", max_participants: 8 },
    { id: 5, name: "Football Friendly Cup", description: "One day cup", sport_id: 1, format_id: 1, organizer_id: 1, reg_date: "2025-04-20T00:00:00Z", start_date: "2025-05-05T00:00:00Z", end_date: "2025-05-05T00:00:00Z", location: "Local Field", status: "completed", max_participants: 8 },
];
// --- END MOCK DATA ---

// Имитация загрузки данных
const fetchMockTournaments = () => {
  // ... (такая же как раньше, просто присваивает mockTournaments в tournaments.value) ...
   isLoading.value = true; errorMsg.value = '';
   setTimeout(() => {
       try { tournaments.value = mockTournaments; isLoading.value = false; } catch(e) { /*...*/ }
   }, 500); // Уменьшим задержку
};

// Загрузка видов спорта
const fetchSports = async () => {
  sportsLoading.value = true; sportsError.value = ''; sportsList.value = [];
  try {
    const response = await apiClient.get('/sports');
    sportsList.value = response.data || [];
    // Добавляем Football, если его нет в ответе (на всякий случай для модалки)
    if (!sportsList.value.some(s => s.id === 1 || s.name.toLowerCase() === 'football')) {
        sportsList.value.push({ id: 1, name: 'football' });
    }
  } catch (err) {
    console.error("Error fetching sports:", err);
    sportsError.value = 'Failed to load sports.';
  } finally {
    sportsLoading.value = false;
  }
};

// --- Computed свойство для фильтрации и сортировки ---
const filteredAndSortedTournaments = computed(() => {
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
const handleTournamentCreated = (newTournament) => {
    console.log('Tournament created (event received):', newTournament);
    // В идеале, просто добавить newTournament в начало tournaments.value
    // Но так как у нас mock data, просто перезапросим (сымитируем)
    fetchMockTournaments(); 
};

// Загружаем данные при монтировании
onMounted(() => {
  fetchMockTournaments(); // Загружаем mock-турниры
  fetchSports(); // Загружаем виды спорта для фильтра
});

</script>

<style scoped>

</style>