<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router'; 
import { useAuthStore } from '@/stores/authStore'; 
import { useMetaStore } from '@/stores/metaStore';
import apiClient from '@/services/apiClient';

import UserDisplayDetails from '@/components/profile/UserDisplayDetails.vue';
import EditProfileModal from '@/components/modals/EditProfileModal.vue'; 

const props = defineProps({
  id: { type: [String, Number], required: true }
});

const authStore = useAuthStore();
const metaStore = useMetaStore();
// const route = useRoute(); // props.id теперь основной источник ID

const viewedUserData = ref(null);
const isLoading = ref(false);
const errorMsg = ref('');

// Для участников команды просматриваемого пользователя
const viewedUserTeamMembers = ref([]);
const isLoadingViewedUserMembers = ref(false);
const viewedUserMembersError = ref('');

// Для турниров просматриваемого пользователя
const viewedUserOrganizedTournaments = ref([]);
const isLoadingViewedUserTournaments = ref(false);
const viewedUserTournamentsError = ref('');

const isEditProfileModalOpen = ref(false);

const isOwnProfile = computed(() => {
  // Убедимся, что props.id сравнивается как число с authStore.userId
  return authStore.isAuthenticated && viewedUserData.value && authStore.userId === Number(props.id);
});

// Является ли просматриваемый пользователь капитаном СВОЕЙ команды
const isViewedUserCaptain = computed(() => {
    return !!viewedUserData.value?.team && viewedUserData.value?.id === viewedUserData.value.team.captain_id;
});

const fetchUserProfile = async (userId) => {
  isLoading.value = true; 
  errorMsg.value = ''; 
  viewedUserData.value = null;
  viewedUserTeamMembers.value = []; // Сбрасываем при загрузке нового профиля
  viewedUserOrganizedTournaments.value = [];

  if (!userId) { 
    errorMsg.value = 'Invalid User ID.'; 
    isLoading.value = false; 
    return; 
  }
  try {
    const userResponse = await apiClient.get(`/users/${userId}`);
    let receivedUser = userResponse.data?.user; // Бэкенд возвращает { user: {...} }
    
    if (!receivedUser) {
      throw new Error('User data not found in API response for /users/:id.');
    }

    // --- ЗАГРУЗКА ПОЛНЫХ ДАННЫХ КОМАНДЫ, ЕСЛИ ОНА ЕСТЬ ---
    if (receivedUser.team_id && receivedUser.team) { 
      console.log(`UserProfileView: User ${userId} is in team ${receivedUser.team_id}. Fetching full team details...`);
      try {
        const teamResponse = await apiClient.get(`/teams/${receivedUser.team_id}`);
        if (teamResponse.data && teamResponse.data.team) {
          // Заменяем объект team в receivedUser на полный объект из /teams/{id}
          receivedUser.team = teamResponse.data.team; 
          console.log('UserProfileView: Full team details fetched and merged:', receivedUser.team);
        } else {
          console.warn(`UserProfileView: Could not fetch full details for team ${receivedUser.team_id}, using partial data from /users/:id response.`);
        }
      } catch (teamErr) {
        console.error(`UserProfileView: Error fetching full details for team ${receivedUser.team_id}:`, teamErr);
        // Оставляем receivedUser.team как есть (с частичными данными), если запрос /teams/{id} не удался
      }
    }
    // --- КОНЕЦ ЗАГРУЗКИ ДАННЫХ КОМАНДЫ ---

    viewedUserData.value = receivedUser;

    // После загрузки данных пользователя, загружаем связанные данные
    if (viewedUserData.value) {
        if (viewedUserData.value.team_id) {
          fetchViewedUserTeamMembers(viewedUserData.value.team_id);
        }
        fetchViewedUserOrganizedTournaments(viewedUserData.value.id);
    }

  } catch (err) {
    console.error("Error fetching user profile in UserProfileView:", err);
    errorMsg.value = err.response?.data?.message || 'Failed to load profile.';
    if (err.response?.status === 404) {
        errorMsg.value = 'User not found.';
    }
  } finally { 
    isLoading.value = false; 
  }
};

const fetchViewedUserTeamMembers = async (teamId) => {
    if (!teamId) { viewedUserTeamMembers.value = []; return; }
    isLoadingViewedUserMembers.value = true; viewedUserMembersError.value = ''; viewedUserTeamMembers.value = [];
    try {
        const response = await apiClient.get(`/teams/${teamId}/members`);
        viewedUserTeamMembers.value = response.data?.members || [];
    } catch (err) { 
        console.error("Error fetching team members for viewed user:", err);
        viewedUserMembersError.value = 'Failed to load team members.'; 
    } finally { isLoadingViewedUserMembers.value = false; }
};

const fetchViewedUserOrganizedTournaments = async (userId) => {
    if (!userId) return;
    isLoadingViewedUserTournaments.value = true; viewedUserTournamentsError.value = ''; viewedUserOrganizedTournaments.value = [];
    try {
        const response = await apiClient.get('/tournaments', { params: { organizer_id: userId, limit: 50 } });
        viewedUserOrganizedTournaments.value = response.data?.tournaments || [];
    } catch (err) { 
        console.error("Error fetching organized tournaments for viewed user:", err);
        viewedUserTournamentsError.value = 'Failed to load organized tournaments.'; 
    } finally { isLoadingViewedUserTournaments.value = false; }
};


const openEditProfileModal = () => { if(isOwnProfile.value) isEditProfileModalOpen.value = true; };
const closeEditProfileModal = () => { isEditProfileModalOpen.value = false; };
const handleProfileUpdated = async () => {
    if (props.id) {
       await fetchUserProfile(props.id); 
       if(isOwnProfile.value && authStore.userId) { 
           authStore.fetchUser(authStore.userId);
       }
    }
};

watch(
  () => props.id, 
  (newId) => { // Убрали oldId, он не используется
    if (newId) {
      fetchUserProfile(newId); // fetchUserProfile теперь также инициирует загрузку team members и tournaments
    } else {
      viewedUserData.value = null; 
      viewedUserTeamMembers.value = []; 
      viewedUserOrganizedTournaments.value = [];
      errorMsg.value = 'No User ID provided.';
    }
  },
  { immediate: true } 
);

onMounted(() => {
  if (metaStore.sports.length === 0) metaStore.fetchSports();
  if (metaStore.formats.length === 0 && !metaStore.formatsLoading) metaStore.fetchFormats();
});
</script>

<template>
  <div class="py-8">
    <div v-if="isLoading" class="text-center py-10 text-[var(--color-text-muted)]">
      Loading profile...
    </div>
    <div v-else-if="errorMsg" class="text-center py-10 text-red-500">
      Error: {{ errorMsg }}
    </div>
    <UserDisplayDetails
      v-else-if="viewedUserData"
      :user="viewedUserData"
      :is-own-profile="isOwnProfile"
      :is-captain="isViewedUserCaptain"
      :current-user-id="authStore.userId"
      :team-members="viewedUserTeamMembers"
      :is-loading-members="isLoadingViewedUserMembers"
      :members-error="viewedUserMembersError"
      :is-removing-member-id="null" 
      :organized-tournaments="viewedUserOrganizedTournaments"
      :is-loading-organized-tournaments="isLoadingViewedUserTournaments"
      :organized-tournaments-error="viewedUserTournamentsError"
      @open-edit-profile="openEditProfileModal"
    />
    <div v-else class="text-center py-10 text-[var(--color-text-muted)]">
       User not found.
    </div>

    <EditProfileModal 
      v-if="isOwnProfile && viewedUserData" 
      :is-open="isEditProfileModalOpen" 
      :current-user="viewedUserData" 
      @close="closeEditProfileModal" 
      @profile-updated="handleProfileUpdated" 
    />
  </div>
</template>
