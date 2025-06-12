<template>
  <div class="relative flex items-center bg-primary rounded-3xl shadow-md p-6 hover:shadow-lg transition-shadow gap-6 overflow-hidden">

    <img
      v-if="displayLogoUrl"
      :src="displayLogoUrl"
      alt="Background Logo"
      class="absolute left-0 top-0 w-full h-full object-cover opacity-10 blur-sm pointer-events-none select-none"
      style="z-index:1;"
    />

    <div class="relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex items-center justify-center z-10 bg-primary">
       <img
          v-if="displayLogoUrl"
          :src="displayLogoUrl"
          alt="Tournament Logo"
          class="object-cover w-full h-full"
        />
        <span v-else class="text-3xl text-[var(--color-myyellow)]">🏆</span>
    </div>

    <div class="relative flex-1 min-w-0 z-10">
      <div class="flex items-center gap-3 mb-2 flex-wrap">
        <span class="text-xl md:text-2xl text-white mobile-jaro" :title="tournament.name">{{ tournament.name }}</span>
        <span
          :class="[getStatusBgClass(tournament.status), 'text-[10px] md:text-xs px-2 py-0.5 rounded-full font-bold whitespace-nowrap']"
        >
          {{ tournament.status }}
        </span>
      </div>

      <div class="md:flex flex-wrap gap-x-4 gap-y-1 text-gray-300 text-[11px] md:text-xs hidden">
        <div>
          <span class="text-gray-400">Starts:</span>
          <span class="ml-1 text-white font-medium">{{ formatDate(tournament.start_date) }}</span>
        </div>
        <div v-if="sportName">
          <span class="text-gray-400">Discipline:</span>
          <span class="ml-1 text-white font-medium capitalize">{{ sportName }}</span>
        </div>
        <div v-if="formatName">
          <span class="text-gray-400">Format:</span>
          <span class="ml-1 text-white font-medium">{{ formatName }}</span>
        </div>
        <div>
          <span class="text-gray-400">Max Players:</span>
          <span class="ml-1 text-white font-medium">{{ tournament.max_participants }}</span>
        </div>
        <div v-if="tournament.location">
            <span class="text-gray-400">Location:</span>
            <span class="ml-1 text-white font-medium">{{ tournament.location }}</span>
        </div>
         <div>
            <span class="text-gray-400">Reg. Ends:</span>
            <span class="ml-1 text-white font-medium">{{ formatDate(tournament.reg_date) }}</span>
        </div>
      </div>
    </div>

    <div class="relative z-10 ml-auto self-center flex-shrink-0">
       <router-link
        :to="{ name: 'tournament-detail', params: { id: tournament.id } }"
        class="poppins text-sm bg-myred hover:bg-myreddarker px-3 py-1.5 rounded-lg text-[var(--color-text-light)] font-semibold transition duration-200 ease-in-out shadow-lg shadow-secondary/70 flex items-center"
      >
        Details &gt;
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useMetaStore } from '@/stores/metaStore';

const props = defineProps({
  tournament: { type: Object, required: true },
});

const metaStore = useMetaStore();
const sportName = computed(() => metaStore.sportsMap[props.tournament.sport_id] || null);

const formatName = computed(() => metaStore.formatsMap[props.tournament.format_id] || null);

const displayLogoUrl = computed(() => {
    if (props.tournament.logo_url) {
        return props.tournament.logo_url;
    }
    return null;
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-CA');
  } catch (e) { return dateString; }
};

const getStatusBgClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'ongoing':
      return 'bg-myred text-white';
    case 'registration':
      return 'bg-myyellow text-primary';
    case 'completed':
    case 'ended':
      return 'bg-gray-700 text-gray-300';
     case 'soon':
      return 'bg-blue-600 text-white';
     case 'canceled':
      return 'bg-black text-gray-500';
    default:
      return 'bg-secondary text-white';
  }
};
</script>

<style scoped>
</style>
