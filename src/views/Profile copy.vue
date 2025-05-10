<template>
  <div class="space-y-8">
    <h1 class="text-4xl font-['Jaro'] text-[var(--color-text-light)]">My Profile</h1>

    <div v-if="authStore.user" class="bg-[var(--color-primary)] p-6 rounded-[1vw] shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
       <div class="flex-shrink-0">
          <img v-if="authStore.userAvatar" :src="authStore.userAvatar" alt="User Avatar" class="w-24 h-24 rounded-full border-4 border-[var(--color-text-light)]" />
           <div v-else class="w-24 h-24 rounded-full bg-[var(--color-secondary)] border-4 border-[var(--color-myyellow)] flex items-center justify-center text-4xl text-[var(--color-text-light)] font-bold">
             {{ authStore.displayName?.charAt(0).toUpperCase() || '?' }}
            </div>
        </div>
        <div class="text-center sm:text-left flex-grow">
          <h2 class="text-2xl text-[var(--color-text-light)]">
             {{ authStore.user.first_name }} {{ authStore.user.last_name }}
             <span v-if="authStore.user.nickname" class="text-lg mobile-jaro text-[var(--color-text-muted)]"> ({{ authStore.user.nickname }})</span>
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
          <button 
              @click="openEditProfileModal"
              class="inline-block poppins bg-[var(--color-myred)] text-[var(--color-text-light)] px-5 py-2 rounded-[0.7vw] text-sm font-medium"
            >
              Edit Profile
            </button> 
         </div>
    </div>
     <div v-else class="text-center poppins text-[var(--color-text-muted)]"> Loading profile... </div>

    <div class="space-y-4">
        <div class="flex justify-between poppins items-center gap-4">
            <h3 class="text-4xl font-['Jaro'] text-[var(--color-text-light)]">My Team</h3>
            <div class="flex items-center space-x-2">
              <button 
                  v-if="isCaptainOfCurrentTeam" 
                  @click="openEditTeamModal"
                  title="Edit Team Details"
                  class="bg-myred hover:bg-myreddarker text-[var(--color-text-light)] px-3 py-2 rounded-[0.7vw] transition-colors"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                 </button>
                <button 
                  v-if="isCaptainOfCurrentTeam" 
                  @click="openInviteModal"
                  class="bg-myred hover:bg-myreddarker text-[var(--color-text-light)] px-3 py-1.5 rounded-[0.7vw] transition-colors text-xs sm:text-sm font-medium"
                 >
                   Invite Member
                 </button>
                 <button 
                    v-if="isCaptainOfCurrentTeam" 
                    @click="confirmDeleteTeam"
                    :disabled="isDeletingTeam"
                    title="Delete Team"
                    class="bg-transparent border border-red-600 text-red-500 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-[0.7vw] transition-colors text-xs sm:text-sm font-medium disabled:opacity-50"
                 >
                   <span v-if="!isDeletingTeam">Delete Team</span>
                   <span v-else>Deleting...</span>
                 </button>
                 <button 
                  v-if="authStore.user" 
                  @click="openCreateTeamModal"
                  class="bg-myred hover:bg-myreddarker text-[var(--color-text-light)] px-4 py-1.5 rounded-[0.7vw] text-sm font-medium"
                 >
                    Create Team
                 </button>
            </div>
        </div>
        
        <div class="bg-[var(--color-primary)] p-6 rounded-[1vw] shadow-lg">
             <div v-if="authStore.user && authStore.user.team_id"> 
                <div v-if="isLoadingMembers" class="text-center text-[var(--color-text-muted)]">Loading members...</div>
                <div v-else-if="membersError" class="text-center text-red-500">{{ membersError }}</div>
                <table v-else-if="teamMembers.length > 0" class="w-full table-auto border-collapse border border-[var(--color-secondary)]">
                  <thead class="bg-[var(--color-secondary)] text-left">
                    <tr>
                      <th class="p-3 text-[var(--color-text-light)] font-medium">
                        Team: {{ authStore.user?.team?.name || '...' }}
                      </th>
                      <th class="p-3 text-[var(--color-text-light)] font-medium text-right">Role</th>
                      <th v-if="isCaptainOfCurrentTeam" class="p-3 text-[var(--color-text-light)] font-medium text-right">Actions</th> 
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="member in teamMembers" :key="member.id" class="border-t border-[var(--color-secondary)]">
                      <td class="p-3">
                        <div class="flex items-center space-x-3">
                           <img 
                              :src="member.avatarUrl || `https://api.dicebear.com/8.x/identicon/svg?seed=${member.email || member.id}`" 
                              alt="Avatar"
                              class="w-8 h-8 rounded-full flex-shrink-0"
                           />
                           <div class="flex-grow">
                             <router-link :to="{ name: 'user-profile', params: { id: member.id } }" class="font-medium text-[var(--color-text-light)] hover:text-[var(--color-myyellow)]">
                                 {{ member.first_name }} {{ member.last_name }} <span v-if="member.nickname" class="text-sm text-[var(--color-text-muted)]">({{ member.nickname }})</span>
                             </router-link>
                             <p class="text-xs text-[var(--color-text-muted)]">{{ member.email }}</p>
                           </div>
                        </div>
                      </td>
                      <td class="p-3 text-sm text-right">
                         <span v-if="authStore.user?.team?.captain_id === member.id" class="font-bold text-[var(--color-myred)]">Captain</span>
                         <span v-else class="text-[var(--color-text-muted)] capitalize">{{ member.role }}</span>
                      </td>
                      <td v-if="isCaptainOfCurrentTeam" class="p-3 text-right">
                           <button 
                              v-if="member.id !== authStore.userId" 
                              @click="confirmRemoveMember(member)"
                              title="Remove Member"
                              class="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                              :disabled="isRemovingMember === member.id" 
                           >
                              <span v-if="isRemovingMember === member.id">...</span> 
                              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                 <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                           </button>
                       </td>
                    </tr>
                  </tbody>
                </table>
                <div v-else class="text-center text-[var(--color-text-muted)]">Could not load team members.</div>
            </div>
             <div v-else-if="authStore.user && !authStore.user.team_id" class="text-center text-[var(--color-text-muted)]">
                Not in a team yet.
            </div>
             <div v-else-if="!authStore.user" class="text-center text-[var(--color-text-muted)]">
                Loading user data...
             </div>
             <p v-if="removeMemberError" class="text-red-500 text-sm text-center mt-4">{{ removeMemberError }}</p>
             <p v-if="deleteTeamError" class="text-red-500 text-sm text-center mt-4">{{ deleteTeamError }}</p>

        </div>
    </div>

    <!-- {/* --- ОБНОВЛЕННАЯ СЕКЦИЯ: My Tournaments --- */} -->
     <div class="space-y-4">
        <h3 class="text-4xl text-[var(--color-text-light)]">My Tournaments</h3>
        <div v-if="isLoadingMyTournaments" class="text-center text-[var(--color-text-muted)]">Loading tournaments...</div>
        <div v-else-if="myTournamentsError" class="text-center text-red-500">{{ myTournamentsError }}</div>
        <div v-else-if="myOrganizedTournaments.length === 0" class="text-center text-[var(--color-text-muted)]">
          <div class="space-y-6">
      <div>
        <div class="bg-[var(--color-primary)] p-6 rounded-[1vw] shadow-lg text-center text-[var(--color-text-muted)]">
          <el-empty :image-size="200" />
        </div>
      </div>
    </div>
        </div>
        <!-- {/* Используем TournamentCard и sportsMap из metaStore */} -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           <TournamentCard 
              v-for="tournament in myOrganizedTournaments" 
              :key="tournament.id"
              :tournament="tournament" 
              :sports-map="metaStore.sportsMap" 
            />
        </div>
         <!-- {/* TODO: Добавить отображение турниров, где пользователь УЧАСТНИК (требует API) */} -->
     </div>
    <!-- {/* --- КОНЕЦ СЕКЦИИ My Tournaments --- */} -->

    <div class="space-y-6">
      <div>
        <h3 class="text-4xl text-[var(--color-text-light)] mb-4">Match History</h3>
        <div class="bg-[var(--color-primary)] p-6 rounded-[1vw] shadow-lg text-center text-[var(--color-text-muted)]">
          <el-empty :image-size="200" />
        </div>
      </div>
    </div>

    <CreateTeamModal 
      :is-open="isCreateTeamModalOpen" 
      @close="closeCreateTeamModal" 
      @team-created="handleTeamCreated" 
    />

    <EditProfileModal 
      v-if="authStore.user" 
      :is-open="isEditProfileModalOpen" 
      :current-user="authStore.user" 
      @close="closeEditProfileModal" 
      @profile-updated="handleProfileUpdated" 
    />

    <InviteTeamMemberModal 
      v-if="authStore.user?.team?.id" 
      :is-open="isInviteModalOpen" 
      :team-id="authStore.user.team.id" 
      @close="closeInviteModal" 
     />

     <EditTeamModal 
        v-if="authStore.user?.team" 
        :is-open="isEditTeamModalOpen" 
        :current-team="authStore.user.team" 
        @close="closeEditTeamModal" 
        @team-updated="handleTeamUpdated" 
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useMetaStore } from '@/stores/metaStore'; // Используем metaStore
import { RouterLink } from 'vue-router';
import apiClient from '@/services/apiClient';
import TournamentCard from '@/components/cards/TournamentCard.vue'; // Импортируем карточку
import CreateTeamModal from '@/components/modals/CreateTeamModal.vue'; 
import EditProfileModal from '@/components/modals/EditProfileModal.vue'; 
import InviteTeamMemberModal from '@/components/modals/InviteTeamMemberModal.vue'; 
import EditTeamModal from '@/components/modals/EditTeamModal.vue'; // Импортируем новую модалку


const authStore = useAuthStore();
const metaStore = useMetaStore(); // Инициализируем metaStore

const isCreateTeamModalOpen = ref(false);
const isEditProfileModalOpen = ref(false);
const isInviteModalOpen = ref(false); 
const isEditTeamModalOpen = ref(false); // Новое состояние

const teamMembers = ref([]);
const isLoadingMembers = ref(false);
const membersError = ref('');

const myOrganizedTournaments = ref([]);
const isLoadingMyTournaments = ref(false);
const myTournamentsError = ref('');

const isRemovingMember = ref(null); // Хранит ID удаляемого участника или null
const removeMemberError = ref('');

const isDeletingTeam = ref(false);
const deleteTeamError = ref('');

const formattedJoinDate = computed(() => { 
    if (!authStore.user?.created_at) return '';
    try {
        return new Date(authStore.user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) { return authStore.user.created_at; }
});

const isCaptainOfCurrentTeam = computed(() => {
    return authStore.user?.team && authStore.userId === authStore.user.team.captain_id;
});

const fetchTeamMembers = async (teamId) => {
    if (!teamId) {
        teamMembers.value = []; 
        return;
    }
    isLoadingMembers.value = true;
    membersError.value = '';
    teamMembers.value = [];
    try {
        const response = await apiClient.get(`/teams/${teamId}/members`);
        teamMembers.value = response.data?.members || []; 
        console.log("Team Members:", teamMembers.value);
    } catch (err) {
        console.error("Error fetching team members:", err);
        membersError.value = 'Failed to load team members.';
    } finally {
        isLoadingMembers.value = false;
    }
};

// --- НОВАЯ: Функция загрузки турниров ОРГАНИЗАТОРА ---
const fetchMyOrganizedTournaments = async (userId) => {
    if (!userId) return;
    isLoadingMyTournaments.value = true;
    myTournamentsError.value = '';
    myOrganizedTournaments.value = [];
    try {
        // Запрашиваем турниры, фильтруя по organizer_id
        const response = await apiClient.get('/tournaments', { 
            params: { 
                organizer_id: userId,
                limit: 50 // Загружаем достаточное кол-во
            } 
        });
        myOrganizedTournaments.value = response.data?.tournaments || [];
    } catch (err) {
         console.error("Error fetching organized tournaments:", err);
         myTournamentsError.value = 'Failed to load your organized tournaments.';
    } finally {
        isLoadingMyTournaments.value = false;
    }
};

const openCreateTeamModal = () => { isCreateTeamModalOpen.value = true; };
const closeCreateTeamModal = () => { isCreateTeamModalOpen.value = false; };
const openEditProfileModal = () => { isEditProfileModalOpen.value = true; };
const closeEditProfileModal = () => { isEditProfileModalOpen.value = false; };
const openInviteModal = () => { isInviteModalOpen.value = true; };
const closeInviteModal = () => { isInviteModalOpen.value = false; };
const openEditTeamModal = () => { isEditTeamModalOpen.value = true; }; // Новая
const closeEditTeamModal = () => { isEditTeamModalOpen.value = false; }; // Новая

const handleTeamCreated = async (newTeam) => {
    console.log('Team created:', newTeam);
    if (authStore.userId) {
       await authStore.fetchUser(authStore.userId); 
    }
};
const handleTeamUpdated = async () => { // Новый обработчик
    console.log('Team updated event received');
    // Перезагружаем данные пользователя, т.к. team в них вложен
    if (authStore.userId) {
       await authStore.fetchUser(authStore.userId); 
    }
     // Модалка закроется сама
};
const confirmRemoveMember = (member) => {
    removeMemberError.value = ''; // Сбрасываем предыдущую ошибку
    if (window.confirm(`Are you sure you want to remove ${member.first_name} ${member.last_name} from the team?`)) {
        removeMember(member.id);
    }
};

const removeMember = async (memberIdToRemove) => {
    if (!authStore.user?.team?.id || !memberIdToRemove) return;

    isRemovingMember.value = memberIdToRemove; // Показываем индикатор загрузки для этой строки
    removeMemberError.value = '';

    try {
        // Отправляем DELETE запрос
        await apiClient.delete(`/teams/${authStore.user.team.id}/members/${memberIdToRemove}`);
        
        // Успех: перезагружаем список участников
        await fetchTeamMembers(authStore.user.team.id); 
        // Можно добавить сообщение об успехе, если нужно

    } catch (err) {
        console.error("Error removing team member:", err);
        removeMemberError.value = err.response?.data?.message || 'Failed to remove member.';
    } finally {
        isRemovingMember.value = null; // Убираем индикатор загрузки
    }
};
const confirmDeleteTeam = () => {
    deleteTeamError.value = ''; // Сбрасываем ошибку
    const teamName = authStore.user?.team?.name || 'this team';
    if (window.confirm(`Are you sure you want to permanently delete the team "${teamName}"? This action cannot be undone.`)) {
        deleteTeam();
    }
};

const deleteTeam = async () => {
    if (!authStore.user?.team?.id) return; // Нужен ID команды для удаления

    isDeletingTeam.value = true;
    deleteTeamError.value = '';

    try {
        // Отправляем DELETE запрос
        await apiClient.delete(`/teams/${authStore.user.team.id}`);
        
        // Успех: перезагружаем данные пользователя
        // Это должно обнулить team_id и team в authStore, что скроет секцию команды
        alert('Team deleted successfully!'); // Простое уведомление
        await authStore.fetchUser(authStore.userId); 
        // Список участников и так скроется, т.к. watch на team_id сработает

    } catch (err) {
        console.error("Error deleting team:", err);
        // Бэкенд может вернуть 403 (не капитан), 409 (команда не пуста?) и т.д.
        deleteTeamError.value = err.response?.data?.message || 'Failed to delete team.';
    } finally {
        isDeletingTeam.value = false;
    }
};
const handleProfileUpdated = async () => {
    console.log('Profile updated event received');
    if (authStore.userId) {
       await authStore.fetchUser(authStore.userId); 
    }
};

watch(
    () => authStore.user?.team_id, 
    (newTeamId, oldTeamId) => {
        console.log(`Watched team_id changed from ${oldTeamId} to ${newTeamId}`);
        if (newTeamId) {
            fetchTeamMembers(newTeamId); 
        } else {
            teamMembers.value = []; 
            membersError.value = ''; 
        }
    },
    { immediate: true } 
);

onMounted(() => {
  metaStore.fetchSports(); 
});

</script>

<style scoped>
.el-empty {
    --el-empty-padding: 40px 0;
    --el-empty-image-width: 160px;
    --el-empty-description-margin-top: 20px;
    --el-empty-bottom-margin-top: 20px;
    --el-empty-fill-color-0: var(--el-color-white);
    --el-empty-fill-color-1: #cccccd;
    --el-empty-fill-color-2: #cccccd;
    --el-empty-fill-color-3: #a0a0a0;
    --el-empty-fill-color-4: #eeeff3;
    --el-empty-fill-color-5: #eeeff3;
    --el-empty-fill-color-6: #e9ebef;
    --el-empty-fill-color-7: #a0a0a0;
    --el-empty-fill-color-8: #e0e3e9;
    --el-empty-fill-color-9: #a0a0a0;
}
    </style>