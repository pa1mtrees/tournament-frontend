<template>
  <div class="py-8 poppins">
    <!-- Custom Loading State -->
    <div v-if="isLoading" class="text-center py-10">
      <p class="text-xl text-[var(--color-text-muted)]">Loading team details...</p>
      <!-- You can add a simple spinner here if desired -->
      <div class="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-myred)] mx-auto"></div>
    </div>

    <!-- Custom Error Display -->
    <div v-else-if="errorMsg" class="text-center py-10 container mx-auto px-4">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative shadow-md" role="alert">
        <strong class="font-bold">Error Loading Team!</strong>
        <span class="block sm:inline ml-2">{{ errorMsg }}</span>
        <div class="mt-4">
          <button
            @click="fetchTeamDetails"
            class="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-[var(--color-text-light)] bg-[var(--color-myred)] hover:bg-[var(--color-myreddarker)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-myyellow)]"
          >
            Retry
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="team" class="container mx-auto px-4 space-y-8">
      <!-- Team Header -->
      <div class="bg-[var(--color-primary)] rounded-[1vw] shadow-xl p-6 md:p-8">
        <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <img 
            :src="teamDisplayAvatarUrl" 
            :alt="`${team.name} Logo`" 
            class="w-24 h-24 md:w-32 md:h-32 rounded-lg object-contain border-2 border-[var(--color-secondary)] shadow-md"
          >
          <div class="text-center sm:text-left flex-grow">
            <h1 class="text-3xl md:text-4xl font-bold text-[var(--color-text-light)]">{{ team.name }}</h1>
            <p v-if="team.sport" class="text-lg text-[var(--color-text-muted)]">{{ team.sport.name }}</p>
            <p v-else-if="team.sport_id" class="text-lg text-[var(--color-text-muted)] italic">Loading sport...</p>
            
            <p v-if="team.captain" class="text-sm text-[var(--color-text-muted)] mt-1">
              Captain: 
              <router-link v-if="team.captain.id" :to="{ name: 'user-profile', params: { id: team.captain.id } }" class="text-[var(--color-myred)] hover:underline">
                {{ team.captain.first_name }} {{ team.captain.last_name }}
                 <span v-if="team.captain.nickname">({{ team.captain.nickname }})</span>
              </router-link>
              <span v-else-if="team.captain.first_name">{{ team.captain.first_name }} {{ team.captain.last_name }}</span>
            </p>
             <p v-else-if="team.captain_id" class="text-sm text-[var(--color-text-muted)] mt-1 italic">Loading captain...</p>
          </div>
          <div v-if="isCaptain" class="sm:ml-auto flex space-x-2 pt-2 sm:pt-0">
            <button
              class="bg-myred hover:bg-myreddarker px-3 py-1.5 rounded-lg text-[var(--color-text-light)] font-semibold flex items-center space-x-1"
              @click="openEditTeamModal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Team</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Custom Tab Navigation -->
      <div class="border-b border-[var(--color-myreddarker)]">
        <nav class="-mb-px flex space-x-4" aria-label="Tabs">
          <button
            v-for="tabItem in tabs"
            :key="tabItem.id"
            @click="activeTab = tabItem.id"
            :class="[
              activeTab === tabItem.id
                ? 'border-[var(--color-myred)] text-[var(--color-myred)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-light)] hover:border-[var(--color-text-muted)]',
              'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none'
            ]"
          >
            {{ tabItem.label }}
            <!-- You can add simple SVG icons here if needed, or use text like (i) for InfoFilled -->
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="bg-[var(--color-primary)] rounded-[1vw] shadow-xl p-6">
        <div v-if="activeTab === 'about'">
          <h2 class="text-2xl text-[var(--color-text-light)] mb-4">About Team</h2>
          <p v-if="team.description" class="text-[var(--color-text-muted)] whitespace-pre-line">{{ team.description }}</p>
          <p v-else class="text-[var(--color-text-muted)] italic">No description provided.</p>
          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Created On">
              {{ formatDate(team.created_at) }}
            </InfoItem>
            <InfoItem v-if="team.sport" label="Discipline">
              {{ team.sport.name }}
            </InfoItem>
          </div>
        </div>

        <div v-if="activeTab === 'members'">
          <h2 class="text-2xl text-[var(--color-text-light)] mb-4">Members ({{ team.members?.length || 0 }})</h2>
          <ul v-if="team.members && team.members.length > 0" class="space-y-3">
            <li v-for="member in team.members" :key="member.id" class="flex items-center space-x-3 p-3 bg-[var(--color-secondary)] rounded-lg">
              <img :src="getMemberAvatar(member)" :alt="member.first_name" class="w-10 h-10 rounded-full object-cover">
              <div>
                <router-link :to="{ name: 'user-profile', params: { id: member.id } }" class="font-semibold text-[var(--color-text-light)] hover:text-[var(--color-myred)]">
                  {{ member.first_name }} {{ member.last_name }}
                  <span v-if="member.nickname" class="text-xs text-[var(--color-text-muted)]"> ({{ member.nickname }})</span>
                </router-link>
                <span v-if="member.id === team.captain_id" class="ml-2 text-xs bg-[var(--color-myred)] text-[var(--color-primary)] px-1.5 py-0.5 rounded-sm font-semibold">Captain</span>
              </div>
            </li>
          </ul>
          <!-- Custom Empty State for Members -->
          <div v-else class="text-center py-6">
            <p class="text-[var(--color-text-muted)]">No members found for this team.</p>
          </div>
        </div>

        <div v-if="activeTab === 'tournaments'">
          <h2 class="text-2xl text-[var(--color-text-light)] mb-4">Tournaments</h2>
          <!-- Custom Empty State for Tournaments -->
          <div class="text-center py-6">
            <p class="text-[var(--color-text-muted)]">No tournament history found for this team yet.</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Custom "Team Not Found" Display -->
    <div v-else class="text-center py-10 container mx-auto px-4">
       <div class="bg-[var(--color-primary)] rounded-[1vw] shadow-xl p-6 md:p-8">
        <h2 class="text-2xl text-[var(--color-text-light)] mb-2">Team Not Found</h2>
        <p class="text-[var(--color-text-muted)] mb-4">The team you are looking for does not exist or could not be loaded.</p>
        <router-link :to="{ name: 'home' }">
          <button
            class="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-[var(--color-text-light)] bg-[var(--color-myred)] hover:bg-[var(--color-myreddarker)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-myyellow)]"
          >
            Go Home
          </button>
        </router-link>
      </div>
    </div>

    <EditTeamModal v-if="team && isEditModalOpen" :is-open="isEditModalOpen" :team-data="team" @close="isEditModalOpen = false" @team-updated="handleTeamUpdated" />
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps } from 'vue'; // Removed markRaw as icons are not complex components now
import { useRouter } from 'vue-router';
import apiClient from '@/services/apiClient';
import { useAuthStore } from '@/stores/authStore';
import { getDiceBearAvatarUrl } from '@/utils/avatarUtils';
// Removed Element Plus imports
// Removed CustomTabs import
import EditTeamModal from '@/components/modals/EditTeamModal.vue';

const InfoItem = {
  props: ['label', 'value', 'isLoading', 'capitalize', 'suffix'],
  template: `
    <div class="flex items-start space-x-3 py-1">
      <strong class="text-[var(--color-text-muted)] w-32 inline-block flex-shrink-0 poppins">{{ label }}:</strong>
      <span v-if="isLoading" class="text-[var(--color-text-muted)] italic poppins">Loading...</span>
      <span v-else :class="['text-[var(--color-text-light)] poppins', { 'capitalize': capitalize }]">
        <slot>{{ value || 'N/A' }}</slot>
        <span v-if="suffix" class="text-[var(--color-text-light)] poppins">{{ suffix }}</span>
      </span>
    </div>
  `
};

const props = defineProps({
  teamId: {
    type: [String, Number],
    required: true
  }
});

const router = useRouter();
const authStore = useAuthStore();

const team = ref(null);
const isLoading = ref(true);
const errorMsg = ref('');
const activeTab = ref('about');
const isEditModalOpen = ref(false);

const tabs = ref([
  { id: 'about', label: 'About' /* icon property removed or can be simple text/SVG path */ },
  { id: 'members', label: 'Members' },
  { id: 'tournaments', label: 'Tournaments' },
]);

const fetchTeamDetails = async () => {
  if (!props.teamId) {
    errorMsg.value = 'Team ID is missing or invalid.';
    isLoading.value = false;
    team.value = null;
    console.warn('fetchTeamDetails called without a valid teamId.');
    return;
  }

  isLoading.value = true;
  errorMsg.value = '';
  team.value = null; 

  try {
    const teamResponse = await apiClient.get(`/teams/${props.teamId}`);
    let fetchedTeam = teamResponse.data.team;

    // Fetch members
    try {
      const membersResponse = await apiClient.get(`/teams/${props.teamId}/members`);
      fetchedTeam.members = membersResponse.data.members || [];
    } catch (membersErr) {
      console.error(`Error fetching team members for team ${props.teamId}:`, membersErr);
      fetchedTeam.members = []; 
    }

    // Conditionally fetch sport details if only sport_id is present
    if (fetchedTeam.sport_id && !fetchedTeam.sport) {
      try {
        const sportResponse = await apiClient.get(`/sports/${fetchedTeam.sport_id}`);
        fetchedTeam.sport = sportResponse.data.sport;
      } catch (sportErr) {
        console.error(`Error fetching sport details for sport_id ${fetchedTeam.sport_id}:`, sportErr);
      }
    }

    // Conditionally fetch captain details if only captain_id is present
    if (fetchedTeam.captain_id && !fetchedTeam.captain) {
      try {
        const captainResponse = await apiClient.get(`/users/${fetchedTeam.captain_id}`); 
        fetchedTeam.captain = captainResponse.data.user;
      } catch (captainErr) {
        console.error(`Error fetching captain details for captain_id ${fetchedTeam.captain_id}:`, captainErr);
      }
    }
    
    team.value = fetchedTeam;

  } catch (err) {
    console.error(`Error fetching team details for team ${props.teamId}:`, err);
    if (err.response && err.response.status === 404) {
        errorMsg.value = `Team with ID ${props.teamId} not found.`;
    } else {
        errorMsg.value = err.response?.data?.message || 'Failed to load team details.';
    }
    team.value = null;
  } finally {
    isLoading.value = false;
  }
};

const teamDisplayAvatarUrl = computed(() => {
  if (team.value?.logo_url) {
    return team.value.logo_url;
  }
  if (team.value) {
    return getDiceBearAvatarUrl(team.value);
  }
  return '';
});

const getMemberAvatar = (member) => {
  return member.logo_url || member.avatarUrl || getDiceBearAvatarUrl(member);
};

const isCaptain = computed(() => {
  return authStore.isAuthenticated && team.value && team.value.captain_id === authStore.userId;
});

const openEditTeamModal = () => {
  if (isCaptain.value) {
    isEditModalOpen.value = true;
  }
};

const handleTeamUpdated = () => {
  isEditModalOpen.value = false;
  fetchTeamDetails(); 
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString(undefined, { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
};

watch(() => props.teamId, (newId) => {
  if (newId) {
    activeTab.value = 'about'; 
    fetchTeamDetails();
  } else {
    team.value = null;
    errorMsg.value = 'No team selected or ID is invalid.';
    isLoading.value = false;
  }
}, { immediate: true });

</script>

<style scoped>
.poppins {
  font-family: 'Poppins', sans-serif;
}
/* Add any specific styles for TeamView here if needed */
</style>