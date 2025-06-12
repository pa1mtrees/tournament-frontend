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
            <button v-if="isCaptainOfCurrentTeam" @click="openEditTeamModal" title="Edit Team Details" class="bg-myred hover:bg-myreddarker px-3 py-1.5 rounded-lg text-[var(--color-text-light)] font-semibold transition duration-200 ease-in-out shadow-lg shadow-secondary/70 flex items-center">Edit Team</button>
            <button v-if="isCaptainOfCurrentTeam" @click="openInviteModal" class="bg-myred hover:bg-myreddarker px-3 py-1.5 rounded-lg text-[var(--color-text-light)] font-semibold transition duration-200 ease-in-out shadow-lg shadow-secondary/70 flex items-center">Invite Member</button>
        <BasePopConfirm
        :visible="showDeleteTeamConfirm"
        :team-name="authStore.user?.team?.name || 'this team'"
        @confirm="handleDeleteTeamConfirm"
        @cancel="handleDeleteTeamCancel"
        >
        <button
            v-if="isCaptainOfCurrentTeam"
            @click="showDeleteTeamConfirm = true"
            :disabled="isDeletingTeam"
            class="font-medium bg-transparent border border-myred text-myred hover:bg-myreddarker hover:text-white px-3 py-2 rounded-lg transition-colors text-sm"
        >
            <span v-if="!isDeletingTeam">Delete Team</span>
            <span v-else>Deleting...</span>
        </button>
        </BasePopConfirm>
        
        <BasePopConfirm
        :visible="showLeaveTeamConfirm"
        message="Are you sure you want to leave this team?"
        @confirm="handleLeaveTeamConfirm"
        @cancel="handleLeaveTeamCancel"
        >
        <button 
            v-if="authStore.user?.team_id && !isCaptainOfCurrentTeam"
            @click="showLeaveTeamConfirm = true"
            :disabled="isLeavingTeam"
            title="Leave Team"
            class="text-sm bg-myred hover:bg-myreddarker px-3 py-1.5 rounded-lg text-[var(--color-text-light)] font-semibold transition duration-200 ease-in-out shadow-lg shadow-secondary/70 flex items-center"
        >
            <span v-if="!isLeavingTeam">Leave Team</span>
            <span v-else>Leaving...</span>
        </button>
        </BasePopConfirm>
        </div>
         <p v-if="removeMemberError" class="text-red-500 text-sm text-right mt-2">{{ removeMemberError }}</p>
         <p v-if="deleteTeamError" class="text-red-500 text-sm text-right mt-2">{{ deleteTeamError }}</p>
         <p v-if="leaveTeamError" class="text-red-500 text-sm text-right mt-2">{{ leaveTeamError }}</p>
      </template>
      
      <template #create-team-action>
         <button 
            v-if="authStore.user && !authStore.user.team_id"
            @click="openCreateTeamModal"
            class="bg-myred hover:bg-myreddarker px-3 py-1.5 rounded-lg text-[var(--color-text-light)] font-semibold transition duration-200 ease-in-out shadow-lg shadow-secondary/70"
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
import { ElMessage } from 'element-plus';

import UserDisplayDetails from '@/components/profile/UserDisplayDetails.vue';
import CreateTeamModal from '@/components/modals/CreateTeamModal.vue'; 
import EditProfileModal from '@/components/modals/EditProfileModal.vue'; 
import InviteTeamMemberModal from '@/components/modals/InviteTeamMemberModal.vue'; 
import EditTeamModal from '@/components/modals/EditTeamModal.vue'; 
import BasePopConfirm from '@/components/ui/BasePopConfirm.vue';

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

const isLeavingTeam = ref(false);
const leaveTeamError = ref('');

const showDeleteTeamConfirm = ref(false);
const showLeaveTeamConfirm = ref(false);
const confirmDeleteTeam = () => {
  deleteTeamError.value = '';
  showDeleteTeamConfirm.value = true;
};

const confirmLeaveTeam = () => {
  leaveTeamError.value = '';
  showLeaveTeamConfirm.value = true;
};

const handleDeleteTeamConfirm = () => {
  showDeleteTeamConfirm.value = false;
  deleteTeam();
};
const handleDeleteTeamCancel = () => {
  showDeleteTeamConfirm.value = false;
};

const handleLeaveTeamConfirm = () => {
  showLeaveTeamConfirm.value = false;
  leaveTeam();
};
const handleLeaveTeamCancel = () => {
  showLeaveTeamConfirm.value = false;
};

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
        ElMessage.success('Member removed successfully.');
        await fetchTeamMembers(authStore.user.team.id); 
    } catch (err) { 
        removeMemberError.value = err.response?.data?.message || 'Failed to remove member.'; 
        ElMessage.error(removeMemberError.value);
    } finally { isRemovingMember.value = null; }
};

// const confirmDeleteTeam = () => {
//     deleteTeamError.value = '';
//     const teamName = authStore.user?.team?.name || 'this team';
//     if (window.confirm(`Are you sure you want to permanently delete the team "${teamName}"? This action cannot be undone.`)) {
//         deleteTeam();
//     }
// };

const deleteTeam = async () => {
    if (!authStore.user?.team?.id) return;
    isDeletingTeam.value = true; deleteTeamError.value = '';
    try {
        await apiClient.delete(`/teams/${authStore.user.team.id}`);
        ElMessage.success('Team deleted successfully!'); 
        await authStore.fetchUser(authStore.userId); 
    } catch (err) { 
        deleteTeamError.value = err.response?.data?.message || 'Failed to delete team. Please kick all the members first.';
        ElMessage.error(deleteTeamError.value);
    } finally { isDeletingTeam.value = false; }
};

// const confirmLeaveTeam = () => {
//     leaveTeamError.value = '';
//     if (window.confirm('Are you sure you want to leave this team?')) {
//         leaveTeam();
//     }
// };

const leaveTeam = async () => {
    if (!authStore.user?.team?.id || !authStore.userId || isCaptainOfCurrentTeam.value) {
        leaveTeamError.value = "Cannot leave team. Captains must delete the team or transfer captaincy.";
        ElMessage.error(leaveTeamError.value);
        return;
    }
    isLeavingTeam.value = true;
    leaveTeamError.value = '';
    try {
        // Используем эндпоинт удаления участника, передавая ID текущего пользователя
        await apiClient.delete(`/teams/${authStore.user.team.id}/members/${authStore.userId}`);
        ElMessage.success('You have successfully left the team.');
        // Обновляем данные пользователя, чтобы team_id и team стали null
        await authStore.fetchUser(authStore.userId);
        // teamMembers обновится через watch
    } catch (err) {
        console.error("Error leaving team:", err);
        leaveTeamError.value = err.response?.data?.message || 'Failed to leave team.';
        ElMessage.error(leaveTeamError.value);
    } finally {
        isLeavingTeam.value = false;
    }
};

watch(() => authStore.user?.team_id, (newTeamId) => { fetchTeamMembers(newTeamId); }, { immediate: true } );
watch(() => authStore.userId, (newUserId) => { if(newUserId) fetchMyOrganizedTournaments(newUserId); }, { immediate: true } );

onMounted(() => {
  if (metaStore.sports.length === 0) metaStore.fetchSports();
  //if (metaStore.formats.length === 0) metaStore.fetchFormats(); 
});
</script>

<style scoped>

</style>