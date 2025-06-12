<template>
  <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="isOpen" class="fixed inset-0 bg-secondary/90 z-40 flex items-center justify-center p-4" @click.self="closeModal">
      <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
        <div v-if="isOpen" class="bg-[var(--color-primary)] rounded-[1vw] shadow-xl w-full max-w-lg overflow-hidden">
          <form @submit.prevent="handleSaveChanges">
            <div class="p-6 space-y-4">
              <h3 class="text-3xl text-center text-[var(--color-text-light)] font-['Jaro']">
                Edit Tournament
              </h3>

              <div>
                <label for="editTournamentName" class="label-style">Name</label>
                <input id="editTournamentName" v-model="editableTournamentData.name" type="text" required placeholder="Tournament Name" class="input-style">
              </div>
              <div>
                <label for="editTournamentDesc" class="label-style">Description (Optional)</label>
                <textarea id="editTournamentDesc" v-model="editableTournamentData.description" placeholder="Details about the tournament..." rows="3" class="input-style"></textarea>
              </div>

              <div>
                <label class="label-style" for="editTournamentLogoUpload">Tournament Logo</label>
                <div class="mt-1 flex items-center space-x-4">
                    <img v-if="logoPreviewUrl" :src="logoPreviewUrl" alt="New Logo Preview" class="w-16 h-16 rounded-md object-cover bg-[var(--color-secondary)]">
                    <img v-else-if="currentLogoUrl" :src="currentLogoUrl" alt="Current Logo" class="w-16 h-16 rounded-md object-cover bg-[var(--color-secondary)]">
                    <div v-else class="w-16 h-16 rounded-md bg-[var(--color-secondary)] flex items-center justify-center text-[var(--color-text-muted)] text-sm">No Logo</div>

                    <input
                        id="editTournamentLogoUpload"
                        type="file"
                        @change="handleLogoFileChange"
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        class="block w-full text-sm text-[var(--color-text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-myred)] file:text-[var(--color-text-light)] hover:file:bg-opacity-80 cursor-pointer"
                    />
                </div>
                <p class="text-xs text-[var(--color-text-muted)] mt-1">Max 2MB. Select a new file to change the logo.</p>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                 <div>
                     <label for="editTournamentRegDate" class="label-style">Registration Starts</label>
                     <input id="editTournamentRegDate" v-model="editableTournamentData.reg_date" type="datetime-local" required class="input-style">
                 </div>
                 <div>
                     <label for="editTournamentStartDate" class="label-style">Start Date</label>
                     <input id="editTournamentStartDate" v-model="editableTournamentData.start_date" type="datetime-local" required class="input-style">
                 </div>
                  <div>
                     <label for="editTournamentEndDate" class="label-style">End Date</label>
                     <input id="editTournamentEndDate" v-model="editableTournamentData.end_date" type="datetime-local" required class="input-style">
                 </div>
              </div>
               <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label for="editTournamentLocation" class="label-style">Location (Optional)</label>
                    <input id="editTournamentLocation" v-model="editableTournamentData.location" type="text" placeholder="e.g., City Stadium or Online" class="input-style">
                 </div>
                  <div>
                    <label for="editTournamentMaxParticipants" class="label-style">Max Participants</label>
                    <input id="editTournamentMaxParticipants" v-model.number="editableTournamentData.max_participants" type="number" min="2" required placeholder="e.g., 16" class="input-style">
                 </div>
              </div>

               <div v-if="errorMsg" class="text-red-500 text-sm text-center pt-2"> {{ errorMsg }} </div>
               <div v-if="successMsg" class="text-green-500 text-sm text-center pt-2"> {{ successMsg }} </div>

           </div>
           <div class="bg-[var(--color-secondary)] px-6 py-3 flex justify-end space-x-3">
             <button type="button" @click="closeModal" :disabled="isLoading" class="poppins px-4 py-2 text-sm font-medium rounded-md border border-myred text-[var(--color-myred)] hover:bg-gray-700 focus:outline-none disabled:opacity-50"> Cancel </button>
             <button type="submit" :disabled="isLoading || !isFormChanged" class="poppins px-4 py-2 text-sm font-medium rounded-md border border-transparent shadow-sm text-[var(--color-text-light)] bg-[var(--color-myred)] hover:bg-myreddarker focus:outline-none disabled:opacity-50">
               <span v-if="!isLoading">Save Changes</span>
               <span v-else>Saving...</span>
             </button>
           </div>
         </form>
       </div>
     </transition>
   </div>
 </transition>
</template>

<script setup>
import { ref, reactive, watch, computed, nextTick } from 'vue';
import apiClient from '@/services/apiClient';
import { useMetaStore } from '@/stores/metaStore';
import { ElMessage } from 'element-plus';

const props = defineProps({
    isOpen: { type: Boolean, required: true },
    tournament: { type: Object, default: () => null }
});
const emit = defineEmits(['close', 'tournamentUpdated']);
const metaStore = useMetaStore();

const editableTournamentData = reactive({
  id: null,
  name: '',
  description: '',
  reg_date: '',
  start_date: '',
  end_date: '',
  location: '',
  max_participants: '',
});

const selectedLogoFile = ref(null);
const logoPreviewUrl = ref('');
const currentLogoUrl = ref('');

const isLoading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

const formatDateTimeForInput = (isoDateString) => {
    if (!isoDateString) return '';
    try {
        const date = new Date(isoDateString);
        return date.toISOString().slice(0, 16);
    } catch (e) { return ''; }
};

const populateForm = () => {

    errorMsg.value = '';
    successMsg.value = '';
    selectedLogoFile.value = null;
    logoPreviewUrl.value = '';

    if (props.tournament) {
        editableTournamentData.id = props.tournament.id;
        editableTournamentData.name = props.tournament.name || '';
        editableTournamentData.description = props.tournament.description || '';
        editableTournamentData.reg_date = formatDateTimeForInput(props.tournament.reg_date);
        editableTournamentData.start_date = formatDateTimeForInput(props.tournament.start_date);
        editableTournamentData.end_date = formatDateTimeForInput(props.tournament.end_date);
        editableTournamentData.location = props.tournament.location || '';
        editableTournamentData.max_participants = props.tournament.max_participants || '';
        currentLogoUrl.value = props.tournament.logo_url || '';
    } else {
        Object.assign(editableTournamentData, { id: null, name: '', description: '', reg_date: '', start_date: '', end_date: '', location: '', max_participants: '' });
        currentLogoUrl.value = '';
    }
};

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        populateForm();
    }
}, { immediate: true });

const isFormChanged = computed(() => {
    if (!props.tournament) return !!selectedLogoFile.value;
    const detailsChanged =
        editableTournamentData.name !== (props.tournament.name || '') ||
        editableTournamentData.description !== (props.tournament.description || null) ||
        formatDateTimeForInput(editableTournamentData.reg_date) !== formatDateTimeForInput(props.tournament.reg_date) ||
        formatDateTimeForInput(editableTournamentData.start_date) !== formatDateTimeForInput(props.tournament.start_date) ||
        formatDateTimeForInput(editableTournamentData.end_date) !== formatDateTimeForInput(props.tournament.end_date) ||
        editableTournamentData.location !== (props.tournament.location || null) ||
        (editableTournamentData.max_participants !== '' && Number(editableTournamentData.max_participants) !== (props.tournament.max_participants || 0));
    return detailsChanged || !!selectedLogoFile.value;
});

const handleLogoFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            ElMessage.error("Logo file is too large (max 2MB).");
            event.target.value = null; selectedLogoFile.value = null; logoPreviewUrl.value = ''; return;
        }
        const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            ElMessage.error('Logo must be JPG, PNG, WEBP or SVG format!');
            event.target.value = null; selectedLogoFile.value = null; logoPreviewUrl.value = ''; return;
        }
        selectedLogoFile.value = file;
        logoPreviewUrl.value = URL.createObjectURL(file);
        errorMsg.value = '';
    } else {
        selectedLogoFile.value = null; logoPreviewUrl.value = '';
    }
};

const handleSaveChanges = async () => {
  if (!isFormChanged.value) {
    successMsg.value = 'No changes to save.';
    isLoading.value = false;
    await nextTick();
    console.log('handleSaveChanges: No changes. SuccessMsg:', successMsg.value, 'ErrorMsg:', errorMsg.value);
    setTimeout(() => {
        emit('close');
    }, 2500);
    return;
  }

  isLoading.value = true;
  errorMsg.value = '';
  successMsg.value = '';
  let detailsUpdatedSuccessfully = false;
  let logoUploadedSuccessfully = false;
  let finalTournamentData = { ...props.tournament, ...editableTournamentData };

  const detailsPayload = {};
  if (editableTournamentData.name !== (props.tournament.name || '')) detailsPayload.name = editableTournamentData.name;
  if (editableTournamentData.description !== (props.tournament.description || null)) detailsPayload.description = editableTournamentData.description || null; // Send null if empty, matching prop
  if (editableTournamentData.location !== (props.tournament.location || null)) detailsPayload.location = editableTournamentData.location || null; // Send null if empty
  if (editableTournamentData.max_participants !== '' && Number(editableTournamentData.max_participants) !== (props.tournament.max_participants || 0)) {
    detailsPayload.max_participants = parseInt(editableTournamentData.max_participants);
  }

  const initialRegDateStr = formatDateTimeForInput(props.tournament.reg_date);
  if (editableTournamentData.reg_date !== initialRegDateStr) {
    detailsPayload.reg_date = editableTournamentData.reg_date ? new Date(editableTournamentData.reg_date + 'Z').toISOString() : null;
  }

  const initialStartDateStr = formatDateTimeForInput(props.tournament.start_date);
  if (editableTournamentData.start_date !== initialStartDateStr) {
    detailsPayload.start_date = editableTournamentData.start_date ? new Date(editableTournamentData.start_date + 'Z').toISOString() : null;
  }

  const initialEndDateStr = formatDateTimeForInput(props.tournament.end_date);
  if (editableTournamentData.end_date !== initialEndDateStr) {
    detailsPayload.end_date = editableTournamentData.end_date ? new Date(editableTournamentData.end_date + 'Z').toISOString() : null;
  }

  if (Object.keys(detailsPayload).length > 0) {
      try {
          const response = await apiClient.put(`/tournaments/${editableTournamentData.id}`, detailsPayload);
          finalTournamentData = { ...finalTournamentData, ...(response.data?.tournament || {}) };
          detailsUpdatedSuccessfully = true;
      } catch (err) {
          errorMsg.value = err.response?.data?.message || 'Failed to update tournament details.';
          isLoading.value = false;
          return;
      }
  }

  if (selectedLogoFile.value) {
    const logoFormData = new FormData();
    logoFormData.append('logo', selectedLogoFile.value);
    try {
      const logoResponse = await apiClient.post(
          `/tournaments/${editableTournamentData.id}/logo`,
          logoFormData,
          { headers: { 'Content-Type': undefined } }
      );
      finalTournamentData = { ...finalTournamentData, ...(logoResponse.data?.tournament || {}) };
      logoUploadedSuccessfully = true;
    } catch (err) {
      const logoUploadError = `Logo upload failed: ${err.response?.data?.message || err.message}`;
      errorMsg.value = errorMsg.value ? `${errorMsg.value} ${logoUploadError}` : logoUploadError;
    }
  }

  isLoading.value = false;

  let anUpdateOccurred = detailsUpdatedSuccessfully || logoUploadedSuccessfully;

  if (detailsUpdatedSuccessfully && logoUploadedSuccessfully) {
      successMsg.value = 'Tournament details and logo updated successfully!';
  } else if (detailsUpdatedSuccessfully) {
      successMsg.value = 'Tournament details updated successfully.';
  } else if (logoUploadedSuccessfully) {
      successMsg.value = 'Logo updated successfully!';
  } else if (!errorMsg.value && isFormChanged.value) {
      successMsg.value = 'No effective changes were applied.';
  }

  if (anUpdateOccurred) {
    emit('tournamentUpdated', finalTournamentData);
  }

  if (successMsg.value || errorMsg.value) {
    await nextTick();
    console.log('handleSaveChanges: Final SuccessMsg:', successMsg.value, 'Final ErrorMsg:', errorMsg.value);
    const timeoutDuration = errorMsg.value ? 3500 : 2500;
    setTimeout(() => {
        emit('close');
    }, timeoutDuration);
  } else {
    emit('close');
  }
};

const closeModal = () => {
  selectedLogoFile.value = null;
  logoPreviewUrl.value = '';
  emit('close');
};

</script>


<style scoped>
</style>
