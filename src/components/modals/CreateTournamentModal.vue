<template>
  <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="isOpen" class="fixed inset-0 bg-secondary/90 bg-opacity-70 z-40 flex items-center justify-center p-4" @click.self="closeModal">
      <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
        <div v-if="isOpen" class="bg-[var(--color-primary)] rounded-[1vw] shadow-xl w-full max-w-lg overflow-hidden">
          <form @submit.prevent="handleCreateTournament">
            <div class="p-6 space-y-4">
              <h3 class="text-3xl text-center text-[var(--color-text-light)] font-['Jaro']">
                Create New Tournament
              </h3>

              <div>
                <label for="tNameModal" class="label-style">Name</label>
                <input id="tNameModal" v-model="tournamentData.name" type="text" required placeholder="Tournament Name" class="input-style">
              </div>
              <div>
                <label for="tDescModal" class="label-style">Description (Optional)</label>
                <textarea id="tDescModal" v-model="tournamentData.description" placeholder="Details about the tournament..." rows="3" class="input-style"></textarea>
              </div>

              <div>
                <label class="label-style" for="tournamentLogoUpload">Tournament Logo (Optional)</label>
                <div class="mt-1 flex items-center space-x-4">
                    <img v-if="logoPreviewUrl" :src="logoPreviewUrl" alt="Logo Preview" class="w-16 h-16 rounded-md object-contain bg-[var(--color-secondary)]">
                    <div v-else class="w-16 h-16 rounded-md bg-[var(--color-secondary)] flex items-center justify-center text-[var(--color-text-muted)] text-sm">Preview</div>

                    <input
                        id="tournamentLogoUpload"
                        type="file"
                        @change="handleTournamentLogoFileChange"
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        class="block w-full text-sm text-[var(--color-text-muted)]
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[var(--color-myred)] file:text-[var(--color-text-light)]
                                hover:file:bg-opacity-80 cursor-pointer"
                    />
                </div>
                <p class="text-xs text-[var(--color-text-muted)] mt-1">Max 2MB. PNG, JPG, WEBP, SVG.</p>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-2 gap-4">
                <div>
                  <label for="tSportModal" class="label-style">Sport</label>
                  <select id="tSportModal" v-model="tournamentData.sport_id" required class="select-style-modal">
                     <option value="" disabled>Select sport</option>
                     <option v-for="sport in metaStore.sports" :key="sport.id" :value="sport.id">{{ sport.name }}</option>
                  </select>
                  <p v-if="metaStore.sportsLoading" class="text-xs text-[var(--color-text-muted)] mt-1">Loading...</p>
                  <p v-if="metaStore.sportsError" class="text-xs text-red-500 mt-1">{{ metaStore.sportsError }}</p>
                </div>
                 <div>
                  <label for="tFormatModal" class="label-style">Format</label>
                      <select id="tFormatModal" v-model="tournamentData.format_id" required class="select-style-modal">
                       <option value="" disabled>Select format</option>
                       <option v-for="format in metaStore.formats" :key="format.id" :value="format.id">{{ format.bracket_type }}</option>
                      </select>
                   <p v-if="metaStore.formatsLoading" class="text-xs text-[var(--color-text-muted)] mt-1">Loading formats...</p>
                   <p v-if="metaStore.formatsError" class="text-xs text-red-500 mt-1">{{ metaStore.formatsError }}</p>
                </div>
              </div>
              <div class="grid grid-cols-3 sm:grid-cols-3 gap-4">
                 <div>
                     <label for="tRegDateModal" class="label-style">Reg Starts</label>
                     <input id="tRegDateModal" v-model="tournamentData.reg_date" type="datetime-local" required class="input-style">
                 </div>
                 <div>
                     <label for="tStartDateModal" class="label-style">Start Date</label>
                     <input id="tStartDateModal" v-model="tournamentData.start_date" type="datetime-local" required class="input-style">
                 </div>
                  <div>
                     <label for="tEndDateModal" class="label-style">End Date</label>
                     <input id="tEndDateModal" v-model="tournamentData.end_date" type="datetime-local" required class="input-style">
                 </div>
              </div>
               <div class="grid grid-cols-2 sm:grid-cols-2 gap-4">
                 <div>
                    <label for="tLocationModal" class="label-style">Location (Optional)</label>
                    <input id="tLocationModal" v-model="tournamentData.location" type="text" placeholder="e.g., City Stadium or Online" class="input-style">
                 </div>
                  <div>
                    <label for="tMaxParticipantsModal" class="label-style">Max Participants</label>
                    <input id="tMaxParticipantsModal" v-model.number="tournamentData.max_participants" type="number" min="2" required placeholder="e.g., 16" class="input-style">
                 </div>
              </div>

               <div v-if="errorMsg" class="text-red-500 text-sm text-center pt-2"> {{ errorMsg }} </div>
               <div v-if="successMsg" class="text-green-500 text-sm text-center pt-2"> {{ successMsg }} </div>

           </div>
           <div class="bg-[var(--color-primary)] px-6 py-3 flex justify-end space-x-3">
             <button type="button" @click="closeModal" :disabled="isLoading" class="poppins px-4 py-2 text-sm font-medium rounded-md border border-myred text-[var(--color-myred)] hover:bg-secondary focus:outline-none disabled:opacity-50"> Cancel </button>
             <button type="submit" :disabled="isLoading || !tournamentData.name || !tournamentData.sport_id || !tournamentData.format_id" class="poppins px-4 py-2 text-sm font-medium rounded-md border border-transparent shadow-sm text-[var(--color-text-light)] bg-[var(--color-myred)] hover:bg-myreddarker focus:outline-none disabled:opacity-50">
               <span v-if="!isLoading">Create Tournament</span>
               <span v-else>Creating...</span>
             </button>
           </div>
         </form>
       </div>
     </transition>
   </div>
 </transition>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import apiClient from '@/services/apiClient';
import { useMetaStore } from '@/stores/metaStore';
import { ElMessage } from 'element-plus';

const props = defineProps({ isOpen: { type: Boolean, required: true } });
const emit = defineEmits(['close', 'tournamentCreated']);
const metaStore = useMetaStore();

const tournamentData = reactive({
  name: '',
  description: '',
  sport_id: '',
  format_id: '',
  reg_date: '',
  start_date: '',
  end_date: '',
  location: '',
  max_participants: '',
});

const selectedTournamentLogoFile = ref(null);
const logoPreviewUrl = ref('');

const isLoading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

const resetForm = () => {
    Object.assign(tournamentData, { name: '', description: '', sport_id: '', format_id: '', reg_date: '', start_date: '', end_date: '', location: '', max_participants: '' });
    selectedTournamentLogoFile.value = null;
    logoPreviewUrl.value = '';
    errorMsg.value = '';
    successMsg.value = '';
    isLoading.value = false;
};

const handleTournamentLogoFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            ElMessage.error("Tournament logo file is too large (max 2MB).");
            event.target.value = null;
            selectedTournamentLogoFile.value = null;
            logoPreviewUrl.value = '';
            return;
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            ElMessage.error('Logo must be JPG, PNG, WEBP or SVG format!');
            event.target.value = null;
            selectedTournamentLogoFile.value = null;
            logoPreviewUrl.value = '';
            return false;
        }
        selectedTournamentLogoFile.value = file;
        logoPreviewUrl.value = URL.createObjectURL(file);
        errorMsg.value = '';
    } else {
        selectedTournamentLogoFile.value = null;
        logoPreviewUrl.value = '';
    }
};

const handleCreateTournament = async () => {
  isLoading.value = true; errorMsg.value = ''; successMsg.value = '';
  let createdTournamentResponseData = null;

  try {
    const payload = {
      name: tournamentData.name,
      sport_id: parseInt(tournamentData.sport_id),
      format_id: parseInt(tournamentData.format_id),
      max_participants: parseInt(tournamentData.max_participants),
      reg_date: tournamentData.reg_date ? new Date(tournamentData.reg_date).toISOString() : null,
      start_date: tournamentData.start_date ? new Date(tournamentData.start_date).toISOString() : null,
      end_date: tournamentData.end_date ? new Date(tournamentData.end_date).toISOString() : null,
    };
    if (tournamentData.description) payload.description = tournamentData.description;
    if (tournamentData.location) payload.location = tournamentData.location;

    console.log("Sending payload to POST /tournaments:", payload);
    const response = await apiClient.post('/tournaments', payload);

    createdTournamentResponseData = response.data?.tournament || response.data;
    if (!createdTournamentResponseData || !createdTournamentResponseData.id) {
        throw new Error("Failed to get created tournament ID from response.");
    }

    successMsg.value = `Tournament "${createdTournamentResponseData.name}" created. `;

    if (selectedTournamentLogoFile.value) {
        successMsg.value += 'Uploading logo...';
        const logoFormData = new FormData();
        logoFormData.append('logo', selectedTournamentLogoFile.value);

        try {
            const logoResponse = await apiClient.post(
                `/tournaments/${createdTournamentResponseData.id}/logo`,
                logoFormData,
                { headers: { 'Content-Type': undefined } }
            );
            if (logoResponse.data?.tournament) {
                createdTournamentResponseData = logoResponse.data.tournament;
            }
            successMsg.value = `Tournament "${createdTournamentResponseData.name}" created and logo uploaded!`;
        } catch (logoErr) {
            console.error("Error uploading tournament logo:", logoErr);
            successMsg.value = `Tournament "${createdTournamentResponseData.name}" created, but logo upload failed: ${logoErr.response?.data?.message || logoErr.message}`;
        }
    }

    emit('tournamentCreated', createdTournamentResponseData);
    setTimeout(closeModal, successMsg.value.includes('failed') ? 3500 : 1500);

  } catch (err) {
     console.error("Error creating tournament:", err);
     errorMsg.value = err.response?.data?.message || err.response?.data?.error || 'Failed to create tournament.';
  } finally {
    isLoading.value = false;
  }
};

const closeModal = () => {
  resetForm();
  emit('close');
};

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        resetForm();
        if (metaStore.sports.length === 0 && !metaStore.sportsLoading) {
            metaStore.fetchSports();
        }
        if (metaStore.formats.length === 0 && !metaStore.formatsLoading) {
            metaStore.fetchFormats();
        }
    }
});

</script>

<style scoped>
</style>
