<template>
  <div>
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
      :team-members="viewedUserTeamMembers"
      :is-loading-members="isLoadingViewedUserMembers"
      :members-error="viewedUserMembersError"
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

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
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

const viewedUserTeamMembers = ref([]);
const isLoadingViewedUserMembers = ref(false);
const viewedUserMembersError = ref('');

const viewedUserOrganizedTournaments = ref([]);
const isLoadingViewedUserTournaments = ref(false);
const viewedUserTournamentsError = ref('');

const isEditProfileModalOpen = ref(false);

const isOwnProfile = computed(() => {
  return authStore.isAuthenticated && viewedUserData.value && authStore.userId === Number(props.id);
});

const fetchViewedUserProfile = async (userId) => {
  isLoading.value = true; errorMsg.value = ''; viewedUserData.value = null;
  if (!userId) { errorMsg.value = 'Invalid User ID.'; isLoading.value = false; return; }
  try {
    const response = await apiClient.get(`/users/${userId}`);
    viewedUserData.value = response.data?.user;
    if (!viewedUserData.value) throw new Error('User data not found in response.');
  } catch (err) {
    console.error("Error fetching user profile:", err);
    errorMsg.value = err.response?.data?.message || 'Failed to load profile.';
    if (err.response?.status === 404) errorMsg.value = 'User not found.';
  } finally { isLoading.value = false; }
};

const fetchViewedUserTeamMembers = async (teamId) => {
    if (!teamId) { viewedUserTeamMembers.value = []; return; }
    isLoadingViewedUserMembers.value = true; viewedUserMembersError.value = ''; viewedUserTeamMembers.value = [];
    try {
        const response = await apiClient.get(`/teams/${teamId}/members`);
        viewedUserTeamMembers.value = response.data?.members || [];
    } catch (err) { viewedUserMembersError.value = 'Failed to load team members.'; } 
    finally { isLoadingViewedUserMembers.value = false; }
};

const fetchViewedUserOrganizedTournaments = async (userId) => {
    if (!userId) return;
    isLoadingViewedUserTournaments.value = true; viewedUserTournamentsError.value = ''; viewedUserOrganizedTournaments.value = [];
    try {
        const response = await apiClient.get('/tournaments', { params: { organizer_id: userId, limit: 50 } });
        viewedUserOrganizedTournaments.value = response.data?.tournaments || [];
    } catch (err) { viewedUserTournamentsError.value = 'Failed to load organized tournaments.'; } 
    finally { isLoadingViewedUserTournaments.value = false; }
};

const openEditProfileModal = () => { if(isOwnProfile.value) isEditProfileModalOpen.value = true; };
const closeEditProfileModal = () => { isEditProfileModalOpen.value = false; };
const handleProfileUpdated = async () => {
    if (props.id) {
       await fetchViewedUserProfile(props.id); // Перезагружаем данные этого профиля
       if(isOwnProfile.value && authStore.userId) { // Если это был свой, обновляем и в store
           authStore.fetchUser(authStore.userId);
       }
    }
};


watch(
  () => props.id, 
  async (newId) => {
    if (newId) {
      await fetchViewedUserProfile(newId);
      if (viewedUserData.value) {
        if (viewedUserData.value.team_id) {
          fetchViewedUserTeamMembers(viewedUserData.value.team_id);
        } else {
          viewedUserTeamMembers.value = []; 
        }
        fetchViewedUserOrganizedTournaments(viewedUserData.value.id);
      }
    } else {
      viewedUserData.value = null; viewedUserTeamMembers.value = []; viewedUserOrganizedTournaments.value = [];
    }
  },
  { immediate: true } 
);

onMounted(() => {
  if (metaStore.sports.length === 0) metaStore.fetchSports();
  // if (metaStore.formats.length === 0) metaStore.fetchFormats();
});

</script>