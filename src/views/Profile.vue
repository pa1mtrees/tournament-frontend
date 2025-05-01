<template>
  <div class="space-y-8">
    <h1 class="text-4xl font-['Jaro'] text-[var(--color-myyellow)]">My Profile</h1>

    <div v-if="authStore.user" class="bg-[var(--color-primary)] p-6 rounded-[1vw] shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
       <div class="flex-shrink-0">
          <img v-if="authStore.userAvatar" :src="authStore.userAvatar" alt="User Avatar" class="w-24 h-24 rounded-full border-4 border-[var(--color-myyellow)]" />
           <div v-else class="w-24 h-24 rounded-full bg-[var(--color-secondary)] border-4 border-[var(--color-myyellow)] flex items-center justify-center text-4xl text-[var(--color-text-light)] font-bold">
              {{ authStore.username?.charAt(0).toUpperCase() }}
            </div>
        </div>
        <div class="text-center sm:text-left flex-grow">
          <h2 class="text-2xl font-semibold text-[var(--color-text-light)]">
            {{ authStore.user.first_name }} {{ authStore.user.last_name }}
          </h2>
          <p class="text-sm text-[var(--color-text-muted)]">{{ authStore.user.email }}</p>
          <p v-if="authStore.user.role" class="text-sm text-[var(--color-text-muted)] capitalize mt-1">
            Role: {{ authStore.user.role }}
          </p>
          <p v-if="authStore.user.created_at" class="text-xs text-[var(--color-text-muted)] mt-2">
            Joined: {{ formattedJoinDate }}
          </p>
        </div>
         <div class="sm:ml-auto flex-shrink-0">
            <router-link to="/settings" class="inline-block bg-[var(--color-myyellow)] text-[var(--color-primary)] px-5 py-2 rounded-[0.7vw] hover:text-[var(--color-myred)] transition-colors text-sm font-medium"> Edit Profile </router-link>
         </div>
    </div>
     <div v-else class="text-center text-[var(--color-text-muted)]"> Loading profile... </div>

    <div class="space-y-4">
        <div class="flex justify-between items-center">
            <h3 class="text-2xl font-semibold text-[var(--color-text-light)]">My Teams</h3>
            <button 
              @click="openCreateTeamModal"
              class="bg-[var(--color-myyellow)] text-[var(--color-primary)] px-4 py-1.5 rounded-[0.7vw] hover:text-[var(--color-myred)] transition-colors text-sm font-medium"
             >
                Create Team
             </button>
        </div>
        
        <div class="bg-[var(--color-primary)] p-6 rounded-[1vw] shadow-lg">
            <div v-if="isLoadingTeams" class="text-center text-[var(--color-text-muted)]">Loading teams...</div>
            <div v-else-if="teamsError" class="text-center text-red-500">{{ teamsError }}</div>
            <div v-else-if="myFilteredTeams.length === 0" class="text-center text-[var(--color-text-muted)]">Not in a team yet.</div> 
            <div v-else class="space-y-3">
                <div v-for="team in myFilteredTeams" :key="team.id" class="p-3 bg-[var(--color-secondary)] rounded-md flex justify-between items-center">
                    <span class="text-[var(--color-text-light)] font-medium">{{ team.name }}</span>
                    <span class="text-xs text-[var(--color-text-muted)]">
                      {{ team.captain_id === authStore.userId ? 'Captain' : 'Member' }} 
                      (Sport ID: {{ team.sport_id }})
                    </span> 
                </div>
            </div>
        </div>
    </div>


    <div class="space-y-6">
      {/* ... My Tournaments ... */}
      {/* ... Match History ... */}
    </div>

    <CreateTeamModal 
      :is-open="isCreateTeamModalOpen" 
      @close="closeCreateTeamModal" 
      @team-created="handleTeamCreated" 
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { RouterLink } from 'vue-router';
import apiClient from '@/services/apiClient';
import CreateTeamModal from '@/components/modals/CreateTeamModal.vue'; 

const authStore = useAuthStore();

// Состояние для команд
const allTeams = ref([]); // Все команды
const isLoadingTeams = ref(false);
const teamsError = ref('');

// Состояние для модального окна
const isCreateTeamModalOpen = ref(false);

// Форматирование даты (без изменений)
const formattedJoinDate = computed(() => { 
    if (!authStore.user?.created_at) return '';
    try {
        return new Date(authStore.user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) { return authStore.user.created_at; }
});

// --- НОВОЕ Computed Свойство для Фильтрации Команд ---
const myFilteredTeams = computed(() => {
  if (!authStore.user || !authStore.userId) {
    return []; // Если данных пользователя нет, вернуть пустой массив
  }
  const currentUserId = authStore.userId;
  const currentUserTeamId = authStore.user.team_id; // Получаем team_id пользователя

  return allTeams.value.filter(team => {
    // Команда подходит, если пользователь ее капитан ИЛИ ID команды совпадает с team_id пользователя
    return team.captain_id === currentUserId || (currentUserTeamId && team.id === currentUserTeamId);
  });
});
// -----------------------------------------------------

// Функция загрузки ВСЕХ команд
const fetchTeams = async () => {
    isLoadingTeams.value = true;
    teamsError.value = '';
    allTeams.value = [];
    try {
        const response = await apiClient.get('/teams'); 
        allTeams.value = response.data || [];
    } catch (err) {
        console.error("Error fetching teams:", err);
        teamsError.value = 'Failed to load teams.';
    } finally {
        isLoadingTeams.value = false;
    }
};

// Функции для управления модалкой (без изменений)
const openCreateTeamModal = () => { isCreateTeamModalOpen.value = true; };
const closeCreateTeamModal = () => { isCreateTeamModalOpen.value = false; };

// Обработчик события создания команды (без изменений)
const handleTeamCreated = (newTeam) => {
    console.log('Team created:', newTeam);
    fetchTeams(); // Перезагружаем список команд
    // Возможно, нужно обновить и данные пользователя (authStore.user), если бэкенд меняет team_id при создании
    // authStore.fetchUser(authStore.userId); // Перезагрузить данные текущего пользователя
};

// Загружаем команды при монтировании компонента
onMounted(() => {
    // Убедимся, что данные пользователя загружены перед загрузкой команд, если это важно для фильтрации
    if (authStore.user) {
        fetchTeams();
    } else {
        // Можно подождать или показать сообщение, что профиль еще грузится
        console.warn("User data not available yet for team filtering.");
        // Можно попробовать загрузить команды позже, используя watch на authStore.user
    }
});

</script>

<style scoped>
/* Стили для страницы профиля */
</style>