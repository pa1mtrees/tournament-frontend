<template>
  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 bg-secondary/90 z-40 flex items-center justify-center p-4" @click.self="closeModal">

    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      enter-to-class="opacity-100 translate-y-0 sm:scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0 sm:scale-100"
      leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    >
      <div v-if="isOpen" class="bg-[var(--color-primary)] rounded-[1vw] shadow-xl w-full max-w-md overflow-hidden">
      <div class="p-6 space-y-4">
        <h3 class="text-2xl text-center text-[var(--color-myred)] font-['Jaro']">
        Create New Team
        </h3>

        <form @submit.prevent="handleCreateTeam">
        <div class="poppins space-y-4">
          <div>
          <label for="teamName" class="block text-sm font-medium text-[var(--color-text-muted)]">Team Name</label>
          <input
            id="teamName"
            v-model="teamName"
            type="text"
            required
            placeholder="Enter team name"
            class="mt-1 appearance-none block w-full px-3 py-2 border border-[var(--color-secondary)] rounded-md shadow-sm placeholder-[var(--color-text-muted)] bg-[var(--color-secondary)] text-[var(--color-text-light)] focus:outline-none focus:ring-[var(--color-myyellow)] focus:border-[var(--color-myyellow)] sm:text-sm"
          />
          </div>

          <div>
          <label for="discipline" class="block text-sm font-medium text-[var(--color-text-muted)]">Discipline</label>
          <select
            id="discipline"
            v-model="selectedSportId"
            required
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-[var(--color-secondary)] focus:outline-none focus:ring-[var(--color-myyellow)] focus:border-[var(--color-myyellow)] sm:text-sm rounded-md bg-[var(--color-secondary)] text-[var(--color-text-light)]"
          >
            <option v-for="sport in sports" :key="sport.id" :value="sport.id">
            {{ sport.name }}
            </option>
          </select>
          <p v-if="sportsLoading" class="text-xs text-[var(--color-text-muted)] mt-1">Loading disciplines...</p>
          <p v-if="sportsError" class="text-xs text-red-500 mt-1">{{ sportsError }}</p>
          </div>

           <div v-if="errorMsg" class="text-red-500 text-sm text-center pt-2">
            {{ errorMsg }}
           </div>
           <div v-if="successMsg" class="text-green-500 text-sm text-center pt-2">
            {{ successMsg }}
           </div>

          <div class="flex justify-end space-x-3 pt-2">
           <button
            type="button"
            @click="closeModal"
            :disabled="isLoading"
            class="px-4 py-2 text-sm font-medium rounded-md border border-myred text-[var(--color-myred)] hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
            Cancel
           </button>
           <button
            type="submit"
            :disabled="isLoading || !teamName || !selectedSportId"
            class="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-[var(--color-text-light)] bg-[var(--color-myred)] hover:bg-[var(--color-myreddarker)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-myyellow)] disabled:opacity-50"
           >
            <span v-if="!isLoading">Create Team</span>
            <span v-else>Creating...</span>
           </button>
          </div>
        </div>
        </form>
      </div>
      </div>
    </transition>
    </div>
  </transition>
  </template>

  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import apiClient from '@/services/apiClient';

  const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  }
  });

  const emit = defineEmits(['close', 'teamCreated']);

  const teamName = ref('');
  const selectedSportId = ref('');
  const sports = ref([]);
  const sportsLoading = ref(false);
  const sportsError = ref('');

  const isLoading = ref(false);
  const errorMsg = ref('');
  const successMsg = ref('');

  const fetchSports = async () => {
  sportsLoading.value = true;
  sportsError.value = '';
  sports.value = [];
  try {
    const response = await apiClient.get('/sports');
    sports.value = response.data.sports || [];
  } catch (err) {
    console.error("Error fetching sports:", err);
    sportsError.value = 'Failed to load disciplines.';
  } finally {
    sportsLoading.value = false;
  }
  };

  const handleCreateTeam = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  successMsg.value = '';
  try {
    const response = await apiClient.post('/teams/', {
    name: teamName.value,
    sport_id: parseInt(selectedSportId.value)
    });

    successMsg.value = `Team created successfully!`;
    emit('teamCreated', response.data);

    setTimeout(() => {
      closeModal();
    }, 1500);

  } catch (err) {
     console.error("Error creating team:", err);
     errorMsg.value = err.response?.data?.message || 'Failed to create team.';
  } finally {
    isLoading.value = false;
  }
  };

  const closeModal = () => {
  teamName.value = '';
  selectedSportId.value = '';
  errorMsg.value = '';
  successMsg.value = '';
  isLoading.value = false;
  emit('close');
  };

  watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    fetchSports();
  }
  });

  onMounted(fetchSports);

  </script>
