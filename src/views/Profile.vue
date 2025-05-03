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
            <h3 class="text-2xl font-semibold text-[var(--color-text-light)]">My Team</h3>
            <button 
              v-if="authStore.user && !authStore.user.team_id" 
              @click="openCreateTeamModal"
              class="bg-[var(--color-myyellow)] text-[var(--color-primary)] px-4 py-1.5 rounded-[0.7vw] hover:text-[var(--color-myred)] transition-colors text-sm font-medium"
             >
                Create Team
             </button>
        </div>
        
        <div class="bg-[var(--color-primary)] p-6 rounded-[1vw] shadow-lg">
            <div v-if="authStore.user && authStore.user.team" class="space-y-3">
              <table class="w-full table-auto border-collapse border border-[var(--color-secondary)]">
              <thead class="bg-[var(--color-secondary)] text-left">
                <tr>
                  <!-- Header: Team Name -->
                  <th class="p-3 text-[var(--color-text-light)] font-medium">{{ authStore.user.team.name }}</th>
                  <!-- Header: Role -->
                  <th class="p-3 text-[var(--color-text-light)] font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                <!-- Row for the current user -->
                <tr class="border-t border-[var(--color-secondary)]">
                  <!-- Cell: User's Nickname or Email -->
                  <td class="p-3 text-[var(--color-text-light)]">
                    {{ authStore.user.nickname || authStore.user.email }}
                  </td>
                  <!-- Cell: User's Role in Team -->
                  <td class="p-3 text-sm text-[var(--color-text-muted)]">
                    {{ authStore.user.team.captain_id === authStore.userId ? 'Captain' : 'Member' }}
                  </td>
                </tr>
                
                <!-- 
                  TODO: Add rows for other team members later if needed.
                  You would need to fetch the full team details including members.
                  Example structure for iterating over members:
                  <tr v-for="member in teamMembers" :key="member.id" class="border-t border-[var(--color-secondary)]">
                    <td class="p-3 text-[var(--color-text-light)]">{{ member.nickname || member.email }}</td>
                    <td class="p-3 text-sm text-[var(--color-text-muted)]">
                      {{ member.id === authStore.user.team.captain_id ? 'Captain' : 'Member' }}
                    </td>
                  </tr>
                -->
              </tbody>
            </table>
            </div>
            <div v-else-if="authStore.user && !authStore.user.team_id" class="text-center text-[var(--color-text-muted)]">
                Not in a team yet.
            </div>
             <div v-else-if="!authStore.user" class="text-center text-[var(--color-text-muted)]">
                Loading user data...
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
import CreateTeamModal from '@/components/modals/CreateTeamModal.vue'; 

const authStore = useAuthStore();

// Состояние для модального окна
const isCreateTeamModalOpen = ref(false);

// Форматирование даты (без изменений)
const formattedJoinDate = computed(() => { 
    if (!authStore.user?.created_at) return '';
    try {
        return new Date(authStore.user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) { return authStore.user.created_at; }
});

// Функции для управления модалкой (без изменений)
const openCreateTeamModal = () => { isCreateTeamModalOpen.value = true; };
const closeCreateTeamModal = () => { isCreateTeamModalOpen.value = false; };

// Обработчик события создания команды (без изменений)
const handleTeamCreated = async (newTeam) => {
    console.log('Team created:', newTeam);
    // Закрываем модалку (она сама закроется через таймаут, но можно и сразу)
    // closeCreateTeamModal(); 
    
    // Перезагружаем данные ТЕКУЩЕГО пользователя, чтобы обновить user.team и user.team_id
    if (authStore.userId) {
       await authStore.fetchUser(authStore.userId); 
    }
};

</script>

<style scoped>
/* Стили для страницы профиля */
</style>