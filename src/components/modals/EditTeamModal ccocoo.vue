<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
       <div v-if="isOpen" class="poppins fixed inset-0 bg-secondary/90 z-40 flex items-center justify-center p-4" @click.self="closeModal"> 
         <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
           
           <section v-if="isOpen" class="max-w-xl p-6 mx-auto bg-[var(--color-primary)] rounded-md shadow-xl w-full overflow-hidden">
               <h2 class="text-2xl text-[var(--color-myred)] capitalize font-['Jaro']">
                   Edit Team Details
               </h2>
   
               <form @submit.prevent="handleSaveChanges">
                   <div class="grid grid-cols-1 gap-6 mt-4">
                       <div>
                           <label class="label-style" for="editTeamName">Team Name</label>
                           <input id="editTeamName" type="text" v-model.trim="formData.name" required class="input-style">
                       </div>
   
                       <div>
                           <label class="label-style" for="editTeamSport">Sport</label>
                           <select id="editTeamSport" v-model="formData.sport_id" required class="select-style-modal">
                              <option value="" disabled>Select sport</option>
                              <option v-for="sport in metaStore.sports" :key="sport.id" :value="sport.id">{{ sport.name }}</option>
                           </select>
                           <p v-if="metaStore.sportsLoading" class="text-xs text-[var(--color-text-muted)] mt-1">Loading sports...</p>
                            <p v-if="metaStore.sportsError" class="text-xs text-red-500 mt-1">{{ metaStore.sportsError }}</p>
                       </div>
                    <!-- {/* --- НОВОЕ: Загрузка Логотипа --- */} -->
                    <div>
                        <label class="label-style" for="teamLogoUpload">Team Logo</label>
                        <div class="mt-1 flex items-center space-x-4">
                            <!-- {/* Предпросмотр */} -->
                            <img v-if="imagePreviewUrl" :src="imagePreviewUrl" alt="Logo Preview" class="w-16 h-16 rounded-md object-cover bg-[var(--color-secondary)]">
                            <img v-else-if="props.currentTeam?.logo_url" :src="props.currentTeam.logo_url" alt="Current Logo" class="w-16 h-16 rounded-md object-cover bg-[var(--color-secondary)]">
                            <div v-else class="w-16 h-16 rounded-md bg-[var(--color-secondary)] flex items-center justify-center text-[var(--color-text-muted)] text-sm">No Logo</div>
                            
                            <input 
                                id="teamLogoUpload" 
                                type="file" 
                                @change="handleFileChange" 
                                accept="image/png, image/jpeg, image/webp, image/svg+xml"
                                class="block w-full text-sm text-[var(--color-text-muted)]
                                       file:mr-4 file:py-2 file:px-4
                                       file:rounded-md file:border-0
                                       file:text-sm file:font-semibold
                                       file:bg-[var(--color-myyellow)] file:text-[var(--color-primary)]
                                       hover:file:bg-opacity-80"
                            />
                        </div>
                        <p class="text-xs text-[var(--color-text-muted)] mt-1">Max 2MB. PNG, JPG, WEBP, SVG.</p>
                    </div>
                    <!-- {/* --- КОНЕЦ Загрузки Логотипа --- */} -->
                   </div>
   
                   <div v-if="errorMsg" class="text-red-500 text-sm text-center mt-4"> {{ errorMsg }} </div>
                   <div v-if="successMsg" class="text-green-500 text-sm text-center mt-4"> {{ successMsg }} </div>
   
                   <div class="flex justify-end mt-6 space-x-3">
                        <button 
                           type="button" 
                           @click="closeModal"
                           :disabled="isLoading"
                           class="px-6 py-2 text-sm rounded-md border border-myred text-[var(--color-myred)] hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                         >
                          Cancel
                       </button>
                       <button 
                           type="submit" 
                           :disabled="isLoading || (!isChanged && !selectedFile)" 
                           class="px-6 py-2 text-sm font-medium text-[var(--color-text-light)] transform bg-[var(--color-myred)] rounded-md hover:bg-[var(--color-myreddarker)] focus:outline-none focus:bg-[var(--color-myyellow)] disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                          <span v-if="!isLoading">Save Changes</span>
                          <span v-else>Saving...</span>
                       </button>
                   </div>
               </form>
           </section>
   
         </transition>
       </div>
     </transition>
   </template>
   
   <script setup>
   import { ref, reactive, watch, computed } from 'vue';
   import apiClient from '@/services/apiClient';
   import { useMetaStore } from '@/stores/metaStore';
   
   const props = defineProps({
     isOpen: { type: Boolean, required: true },
     currentTeam: { type: Object, default: () => ({}) } // Принимаем текущие данные команды
   });
   
   const emit = defineEmits(['close', 'teamUpdated']);
   const metaStore = useMetaStore();
   
   const formData = reactive({
     name: '',
     sport_id: '',
   });
   
   const isLoading = ref(false);
   const errorMsg = ref('');
   const successMsg = ref('');
   
   // Вычисляемое свойство для проверки, были ли изменения
   const isChanged = computed(() => {
       if (!props.currentTeam) return false;
       return formData.name !== (props.currentTeam.name || '') || 
              formData.sport_id !== (props.currentTeam.sport_id || '');
   });
   
   // Заполнение формы при открытии/изменении currentTeam
   const populateForm = () => {
       errorMsg.value = ''; 
       successMsg.value = '';
       if (props.currentTeam) {
           formData.name = props.currentTeam.name || '';
           // Устанавливаем sport_id, убедившись, что он число
           formData.sport_id = props.currentTeam.sport_id ? Number(props.currentTeam.sport_id) : ''; 
       }
   };

   const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) { // Макс 2MB
            errorMsg.value = "File is too large (max 2MB).";
            event.target.value = null; // Сбросить выбор файла
            return;
        }
        selectedFile.value = file;
        imagePreviewUrl.value = URL.createObjectURL(file);
        errorMsg.value = ''; // Сбросить предыдущие ошибки
    } else {
        selectedFile.value = null;
        imagePreviewUrl.value = '';
    }
};
   
const handleSaveChanges = async () => {
    errorMsg.value = '';
    successMsg.value = '';
    isLoading.value = true;
    let teamDataUpdated = false;

    // 1. Обновляем детали команды, если они изменились
    const detailsPayload = {};
    if (formData.name !== (props.currentTeam?.name || '')) payload.name = formData.name;
    if (formData.sport_id !== (props.currentTeam?.sport_id || '')) payload.sport_id = parseInt(formData.sport_id);

    if (Object.keys(detailsPayload).length > 0) {
        try {
            await apiClient.put(`/teams/${props.currentTeam.id}`, detailsPayload);
            teamDataUpdated = true;
        } catch (err) {
            console.error("Error updating team details:", err);
            errorMsg.value = err.response?.data?.message || 'Failed to update team details.';
            isLoading.value = false;
            return;
        }
    }

    // 2. Загружаем логотип, если выбран новый файл
    if (selectedFile.value) {
        const logoFormData = new FormData();
        logoFormData.append('logo', selectedFile.value);
        try {
            // Для FormData Axios сам выставит Content-Type: multipart/form-data
            const logoResponse = await apiClient.post(`/teams/${props.currentTeam.id}/logo`, logoFormData);
            // Бэкенд должен вернуть обновленный объект команды с новым logo_url
            // Мы используем этот ответ для события teamUpdated
            emit('teamUpdated', logoResponse.data.team); 
            teamDataUpdated = true; // Считаем, что данные обновились
        } catch (err) {
            console.error("Error uploading team logo:", err);
            errorMsg.value = err.response?.data?.message || 'Failed to upload team logo.';
            // Если детали обновились, но лого нет - все равно может быть "частичный успех"
            // Решите, как обрабатывать: если ошибка лого, откатывать ли детали? Проще не откатывать.
            isLoading.value = false;
            // Если другие данные не менялись, а только лого, и оно не загрузилось, то closeModal не вызовется ниже
             if(!teamDataUpdated) return; // Если только лого не удалось, а детали не менялись
        }
    }
    
    isLoading.value = false;
    if (!errorMsg.value) { // Если не было ошибок ни при обновлении деталей, ни при загрузке лого
        if (teamDataUpdated || selectedFile.value) { // Если были изменения или загружен файл (даже если детали не менялись)
             successMsg.value = 'Team updated successfully!';
             // Если лого не загружалось, но детали обновились, а событие teamUpdated еще не вызвано
             if (teamDataUpdated && !selectedFile.value) {
                emit('teamUpdated'); // Уведомляем об обновлении, чтобы ProfileView перезапросил данные
             }
        } else {
            successMsg.value = 'No changes were made.';
        }
        setTimeout(closeModal, 1500);
    } else if (teamDataUpdated && errorMsg.value) {
        // Если детали обновились, но лого нет - все равно был частичный успех
        successMsg.value = 'Team details updated, but logo upload failed.';
        emit('teamUpdated'); // Все равно уведомляем, т.к. детали обновились
        setTimeout(closeModal, 2500);
    }
};

const closeModal = () => {
  selectedFile.value = null; // Сбрасываем файл при закрытии
  imagePreviewUrl.value = '';
  // resetForm(); // populateForm вызовется при следующем открытии
  emit('close');
};
   
   watch(() => props.isOpen, (newVal) => {
     if (newVal) {
       populateForm();
       // Загружаем спорты, если их нет
       if (metaStore.sports.length === 0 && !metaStore.sportsLoading) {
           metaStore.fetchSports();
       }
     }
   }, { immediate: true }); 
   
   </script>
   
   <style scoped>
   
   </style>