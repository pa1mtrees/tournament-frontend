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
                     </button>
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
                <label for="search" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Search</label>
                <input type="text" id="search" v-model="searchQuery" placeholder="Search by name..." class="input-style w-full py-1.5" />
            </div>
            <div>
              <label for="typeFilter" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Format</label>
              <select id="typeFilter" v-model="selectedType" class="select-style">
                <option value="all">All</option>
                <option value="solo">Solo</option>
                <option value="team">Team</option>
              </select>
            </div>
            <div>
              <label for="statusFilter" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Status</label>
              <select id="statusFilter" v-model="selectedStatus" class="select-style">
                <option value="all">All</option>
                <option value="soon">Soon</option>
                <option value="registration">Registration</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
             <div>
               <label for="sortOrder" class="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Sort By</label>
               <select id="sortOrder" v-model="selectedSort" class="select-style">
                 <option value="start_date_desc">Start Date (Newest)</option>
                 <option value="start_date_asc">Start Date (Oldest)</option>
                 <option value="name_asc">Name (A-Z)</option>
                 <option value="name_desc">Name (Z-A)</option>
               </select>
            </div>
             <div class="self-end mb-1">
              <button
                v-if="authStore.userRole === 'player' || authStore.userRole === 'organizer' || authStore.userRole === 'admin'"
                @click="openCreateTournamentModal"
                class="poppins text-sm w-full bg-myred hover:bg-myreddarker px-3 py-1.5 rounded-lg text-[var(--color-text-light)] font-semibold transition duration-200 ease-in-out shadow-lg shadow-secondary/70">
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
import { useRoute } from 'vue-router';
import TournamentCard from '@/components/cards/TournamentCard.vue';
import CreateTournamentModal from '@/components/modals/CreateTournamentModal.vue';
import { useAuthStore } from '@/stores/authStore';
import { useMetaStore } from '@/stores/metaStore'; // Используем metaStore
import apiClient from '@/services/apiClient';

const route = useRoute();
const authStore = useAuthStore(); // Получаем auth store для проверки роли
const metaStore = useMetaStore(); // Инициализируем metaStore

const tournaments = ref([]); // Массив для ВСЕХ загруженных (mock) турниров
const isLoading = ref(false);
const errorMsg = ref('');

const selectedType = ref('all');
const searchQuery = ref('');
const selectedStatus = ref('all');
const selectedSort = ref('start_date_desc');
const selectedSportId = ref(null);
const isCreateTournamentModalOpen = ref(false);

const fetchTournaments = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  console.log("Fetching tournaments from API with filters:", { status: selectedStatus.value, sport_id: selectedSportId.value });

  const params = { limit: 100, offset: 0 };
  if (selectedStatus.value !== 'all') params.status = selectedStatus.value;
  // Ensure selectedSportId.value is used for the API call if it's set
  if (selectedSportId.value !== null && selectedSportId.value !== undefined) {
    params.sport_id = selectedSportId.value;
  }

  try {
    const response = await apiClient.get('/tournaments', { params: params });
    tournaments.value = response.data?.tournaments || [];
    console.log("Tournaments loaded:", tournaments.value.length);
  } catch (err) {
    console.error("Error fetching tournaments:", err);
    errorMsg.value = err.response?.data?.message || err.message || "Failed to load tournaments.";
  }
  finally { isLoading.value = false; }
};

const SOLO_FORMAT_IDS = [1];
const TEAM_FORMAT_IDS = [2];

const displayTournaments  = computed(() => {
  let result = [...tournaments.value]; // Работаем с копией


  if (searchQuery.value) {
    result = result.filter(t =>
      t.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (selectedType.value === 'solo') {
    result = result.filter(t => SOLO_FORMAT_IDS.includes(t.format_id));
  } else if (selectedType.value === 'team') {
    result = result.filter(t => TEAM_FORMAT_IDS.includes(t.format_id));
  }

  if (selectedSportId.value !== null && selectedSportId.value !== undefined) {
      result = result.filter(t => t.sport_id === selectedSportId.value);
  }

  if (selectedStatus.value !== 'all') {
    result = result.filter(t => t.status === selectedStatus.value);
  }

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
  tournaments.value.push(newTournament); // Добавляем новый турнир в массив
  closeCreateTournamentModal(); // Закрываем модалку
  fetchTournaments();
};

// Следим за фильтрами и перезагружаем
watch([selectedStatus, selectedSportId], () => { fetchTournaments(); });

// Загружаем начальные данные
onMounted(async () => {
  // Fetch metadata first, as it might be needed to validate sportIdFromQuery
  if (!metaStore.sports || metaStore.sports.length === 0) {
    await metaStore.fetchSports();
  }
  if (!metaStore.formats || metaStore.formats.length === 0) {
    await metaStore.fetchFormats();
  }

  const sportIdFromQuery = route.query.sportId;
  let sportIdAppliedFromQuery = false;

  if (sportIdFromQuery) {
    const parsedSportId = parseInt(sportIdFromQuery, 10);
    // Check if the sportId from query is a valid one from the fetched sports
    if (!isNaN(parsedSportId) && metaStore.sports.some(s => s.id === parsedSportId)) {
      selectedSportId.value = parsedSportId; // This will trigger the watcher
      sportIdAppliedFromQuery = true;
    } else if (!isNaN(parsedSportId)) {
      // If it's a number but not in the list, log a warning.
      // selectedSportId will remain null, and all sports (or based on other filters) will be fetched.
      console.warn(`Sport ID ${parsedSportId} from query not found in available sports. Showing all or default.`);
    }
  }

  // If selectedSportId was NOT set/changed by the query parameter,
  // the watcher for selectedSportId won't fire. In this case,
  // we need to explicitly call fetchTournaments for the initial load
  // with default filters (e.g., selectedSportId is still null).
  if (!sportIdAppliedFromQuery) {
    fetchTournaments();
  }
  // If sportIdAppliedFromQuery is true, the watcher on selectedSportId
  // will have already triggered fetchTournaments().
});

</script>
<style scoped>

</style>
