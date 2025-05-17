<template>
  <div class="py-8">
    <UserDisplayDetails
      :user="authStore.user"
      :is-own-profile="true"
      :is-captain="isCaptainOfCurrentTeam"
      :current-user-id="authStore.userId"
      :team-members="teamMembers"
      :is-loading-members="isLoadingMembers"
      :members-error="membersError"
      :is-removing-member-id="isRemovingMember" 
      :organized-tournaments="myOrganizedTournaments"
      :is-loading-organized-tournaments="isLoadingMyTournaments"
      :organized-tournaments-error="myTournamentsError"
      @open-edit-profile="openEditProfileModal"
      @request-remove-member="confirmRemoveMember"
    >
      <template #team-actions>
        <div v-if="authStore.user && authStore.user.team_id" class="flex justify-end items-center gap-2 flex-wrap mt-2">
            <button v-if="isCaptainOfCurrentTeam" @click="openEditTeamModal" title="Edit Team Details" class="font-medium poppins bg-myred hover:bg-myreddarker text-[var(--color-text-light)] px-3 py-2 rounded-[0.7vw] transition-colors text-sm">Edit Team</button>
            <button v-if="isCaptainOfCurrentTeam" @click="openInviteModal" class="font-medium poppins bg-myred hover:bg-myreddarker text-[var(--color-text-light)] px-3 py-2 rounded-[0.7vw] transition-colors text-sm">Invite Member</button>
            <button v-if="isCaptainOfCurrentTeam" @click="confirmDeleteTeam" :disabled="isDeletingTeam" title="Delete Team" class="font-medium bg-transparent border border-myred text-myred hover:bg-myreddarker hover:text-white px-3 py-2 rounded-[0.7vw] transition-colors text-sm">
              <span v-if="!isDeletingTeam">Delete Team</span>
              <span v-else>Deleting...</span>
            </button>
        </div>
         <p v-if="removeMemberError" class="text-red-500 text-sm text-right mt-2">{{ removeMemberError }}</p>
         <p v-if="deleteTeamError" class="text-red-500 text-sm text-right mt-2">{{ deleteTeamError }}</p>
      </template>
      
      <template #create-team-action>
         <button 
            v-if="authStore.user && !authStore.user.team_id"
            @click="openCreateTeamModal"
            class="bg-[var(--color-myyellow)] text-[var(--color-primary)] px-4 py-1.5 rounded-[0.7vw] hover:text-[var(--color-myred)] transition-colors text-sm font-medium"
           >
              Create Team
           </button>
      </template>
    </UserDisplayDetails>
    
    <CreateTeamModal :is-open="isCreateTeamModalOpen" @close="closeCreateTeamModal" @team-created="handleTeamCreated" />
    <EditProfileModal v-if="authStore.user" :is-open="isEditProfileModalOpen" :current-user="authStore.user" @close="closeEditProfileModal" @profile-updated="handleProfileUpdated" />
    <InviteTeamMemberModal v-if="authStore.user?.team?.id" :is-open="isInviteModalOpen" :team-id="authStore.user.team.id" @close="closeInviteModal" />
    <EditTeamModal v-if="authStore.user?.team" :is-open="isEditTeamModalOpen" :current-team="authStore.user.team" @close="closeEditTeamModal" @team-updated="handleTeamUpdated" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useMetaStore } from '@/stores/metaStore'; 
import apiClient from '@/services/apiClient';

import UserDisplayDetails from '@/components/profile/UserDisplayDetails.vue';
import CreateTeamModal from '@/components/modals/CreateTeamModal.vue'; 
import EditProfileModal from '@/components/modals/EditProfileModal.vue'; 
import InviteTeamMemberModal from '@/components/modals/InviteTeamMemberModal.vue'; 
import EditTeamModal from '@/components/modals/EditTeamModal.vue'; 

const authStore = useAuthStore();
const metaStore = useMetaStore(); 

const isCreateTeamModalOpen = ref(false);
const isEditProfileModalOpen = ref(false);
const isInviteModalOpen = ref(false); 
const isEditTeamModalOpen = ref(false); 

const teamMembers = ref([]);
const isLoadingMembers = ref(false);
const membersError = ref('');

const myOrganizedTournaments = ref([]);
const isLoadingMyTournaments = ref(false);
const myTournamentsError = ref('');

const isRemovingMember = ref(null); 
const removeMemberError = ref('');
const isDeletingTeam = ref(false);
const deleteTeamError = ref('');

const formattedJoinDate = computed(() => { 
    if (!authStore.user?.created_at) return '';
    try { return new Date(authStore.user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); } 
    catch (e) { return authStore.user.created_at; }
});

const isCaptainOfCurrentTeam = computed(() => {
    return !!authStore.user?.team && authStore.userId === authStore.user.team.captain_id;
});

const fetchTeamMembers = async (teamId) => {
    if (!teamId) { teamMembers.value = []; return; }
    isLoadingMembers.value = true; membersError.value = ''; teamMembers.value = [];
    try {
        const response = await apiClient.get(`/teams/${teamId}/members`);
        teamMembers.value = response.data?.members || []; 
    } catch (err) { membersError.value = 'Failed to load team members.'; } 
    finally { isLoadingMembers.value = false; }
};

const fetchMyOrganizedTournaments = async (userId) => {
    if (!userId) return;
    isLoadingMyTournaments.value = true; myTournamentsError.value = ''; myOrganizedTournaments.value = [];
    try {
        const response = await apiClient.get('/tournaments', { params: { organizer_id: userId, limit: 50 } });
        myOrganizedTournaments.value = response.data?.tournaments || [];
    } catch (err) { myTournamentsError.value = 'Failed to load your organized tournaments.'; } 
    finally { isLoadingMyTournaments.value = false; }
};

const openCreateTeamModal = () => { isCreateTeamModalOpen.value = true; };
const closeCreateTeamModal = () => { isCreateTeamModalOpen.value = false; };
const openEditProfileModal = () => { isEditProfileModalOpen.value = true; };
const closeEditProfileModal = () => { isEditProfileModalOpen.value = false; };
const openInviteModal = () => { isInviteModalOpen.value = true; };
const closeInviteModal = () => { isInviteModalOpen.value = false; };
const openEditTeamModal = () => { isEditTeamModalOpen.value = true; }; 
const closeEditTeamModal = () => { isEditTeamModalOpen.value = false; }; 

const handleTeamCreated = async (newTeam) => { if (authStore.userId) await authStore.fetchUser(authStore.userId); };
const handleTeamUpdated = async () => { if (authStore.userId) await authStore.fetchUser(authStore.userId); };
const handleProfileUpdated = async () => { if (authStore.userId) await authStore.fetchUser(authStore.userId); };

const confirmRemoveMember = (member) => {
    removeMemberError.value = '';
    if (window.confirm(`Are you sure you want to remove ${member.first_name} ${member.last_name} from the team?`)) {
        removeMember(member.id);
    }
};

const removeMember = async (memberIdToRemove) => {
    if (!authStore.user?.team?.id || !memberIdToRemove) return;
    isRemovingMember.value = memberIdToRemove; removeMemberError.value = '';
    try {
        await apiClient.delete(`/teams/${authStore.user.team.id}/members/${memberIdToRemove}`);
        await fetchTeamMembers(authStore.user.team.id); 
    } catch (err) { removeMemberError.value = err.response?.data?.message || 'Failed to remove member.'; } 
    finally { isRemovingMember.value = null; }
};

const confirmDeleteTeam = () => {
    deleteTeamError.value = '';
    const teamName = authStore.user?.team?.name || 'this team';
    if (window.confirm(`Are you sure you want to permanently delete the team "${teamName}"? This action cannot be undone.`)) {
        deleteTeam();
    }
};

const deleteTeam = async () => {
    if (!authStore.user?.team?.id) return;
    isDeletingTeam.value = true; deleteTeamError.value = '';
    try {
        await apiClient.delete(`/teams/${authStore.user.team.id}`);
        alert('Team deleted successfully!'); 
        await authStore.fetchUser(authStore.userId); 
    } catch (err) { deleteTeamError.value = err.response?.data?.message || 'Failed to delete team. Please kick all the members first.'; } 
    finally { isDeletingTeam.value = false; }
};

watch(() => authStore.user?.team_id, (newTeamId) => { fetchTeamMembers(newTeamId); }, { immediate: true } );
watch(() => authStore.userId, (newUserId) => { if(newUserId) fetchMyOrganizedTournaments(newUserId); }, { immediate: true } );

onMounted(() => {
  if (metaStore.sports.length === 0) metaStore.fetchSports();
  // if (metaStore.formats.length === 0) metaStore.fetchFormats(); 
});
</script>

<style scoped>
/* Стили для страницы профиля */
</style>