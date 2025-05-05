<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
       <div v-if="isOpen" class="poppins fixed inset-0 bg-secondary/90 z-40 flex items-center justify-center p-4" @click.self="closeModal"> 
         <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
           
           <section v-if="isOpen" class="max-w-2xl p-6 mx-auto bg-[var(--color-primary)] rounded-[1vw] shadow-xl w-full overflow-hidden">
               <h2 class="text-2xl text-[var(--color-myred)] capitalize font-['Jaro']">
                   Account Settings
               </h2>
   
               <form @submit.prevent="handleUpdateProfile">
                   <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                       <div>
                           <label class="label-style" for="firstName">First Name</label>
                           <input id="firstName" type="text" v-model.trim="formData.firstName" required class="input-style">
                       </div>
   
                       <div>
                           <label class="label-style" for="lastName">Last Name</label>
                           <input id="lastName" type="text" v-model.trim="formData.lastName" required class="input-style">
                       </div>
                       
                       <div>
                           <label class="label-style" for="nickname">Nickname (Optional)</label>
                           <input id="nickname" type="text" v-model.trim="formData.nickname" placeholder="Leave blank if none" class="input-style">
                       </div>
   
                       <div>
                           <label class="label-style" for="emailAddress">Email Address</label>
                           <input id="emailAddress" type="email" v-model.trim="formData.email" required placeholder="your.email@example.com" class="input-style">
                       </div>
   
                       <div>
                           <label class="label-style" for="password">New Password</label>
                           <input id="password" type="password" v-model="formData.password" placeholder="Leave blank to keep current" class="input-style">
                       </div>
   
                       <div>
                           <label class="label-style" for="passwordConfirmation">Confirm New Password</label>
                           <input id="passwordConfirmation" type="password" v-model="formData.passwordConfirmation" placeholder="Confirm new password" class="input-style" :disabled="!formData.password">
                       </div>
                   </div>
   
                   <div v-if="errorMsg" class="text-red-500 text-sm text-center mt-4">
                       {{ errorMsg }}
                   </div>
                    <div v-if="successMsg" class="text-green-500 text-sm text-center mt-4">
                       {{ successMsg }}
                    </div>
   
                   <div class="flex justify-end mt-6 space-x-3">
                        <button 
                           type="button" 
                           @click="closeModal"
                           :disabled="isLoading"
                           class="px-6 py-2 text-sm font-medium rounded-md border border-myred text-[var(--color-myred)] hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                         >
                          Cancel
                       </button>
                       <button 
                           type="submit" 
                           :disabled="isLoading"
                           class="px-6 py-2 text-sm font-medium rounded-md shadow-sm text-[var(--color-text-light)] bg-[var(--color-myred)] hover:bg-[var(--color-myreddarker)] focus:outline-none focus:bg-[var(--color-myyellow)] disabled:opacity-50"
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
   import { ref, reactive, watch } from 'vue';
   import apiClient from '@/services/apiClient';
   import { useAuthStore } from '@/stores/authStore';
   
   const props = defineProps({
     isOpen: { type: Boolean, required: true },
     currentUser: { type: Object, default: () => ({}) } 
   });
   
   const emit = defineEmits(['close', 'profileUpdated']);
   const authStore = useAuthStore();
   
   // Используем reactive для удобства работы с формой
   const formData = reactive({
     firstName: '',
     lastName: '',
     nickname: '',
     email: '',
     password: '',
     passwordConfirmation: '',
   });
   
   const isLoading = ref(false);
   const errorMsg = ref('');
   const successMsg = ref('');
   
   // Заполняем форму при открытии/изменении currentUser
   const populateForm = () => {
       errorMsg.value = ''; 
       successMsg.value = '';
       if (props.currentUser) {
           formData.firstName = props.currentUser.first_name || '';
           formData.lastName = props.currentUser.last_name || '';
           // Обрабатываем nickname, который может быть null в currentUser
           formData.nickname = props.currentUser.nickname || ''; 
           formData.email = props.currentUser.email || '';
           formData.password = ''; // Пароль всегда сбрасываем
           formData.passwordConfirmation = '';
       }
   };
   
   watch(() => props.isOpen, (newVal) => {
     if (newVal) {
       populateForm();
     }
   }, { immediate: true }); // immediate: true может быть полезен, если пропс currentUser доступен сразу
   
   // Обработчик сохранения
   const handleUpdateProfile = async () => {
       errorMsg.value = '';
       successMsg.value = '';
   
       // 1. Проверка подтверждения пароля, если он введен
       if (formData.password && formData.password !== formData.passwordConfirmation) {
           errorMsg.value = 'New passwords do not match.';
           return;
       }
       isLoading.value = true;

    // --- ИЗМЕНЕНИЕ ЗДЕСЬ: Собираем payload со ВСЕМИ полями (кроме пароля, если не менялся) ---
    const payload = {
        first_name: formData.firstName, // Всегда отправляем
        last_name: formData.lastName,   // Всегда отправляем
        nickname: formData.nickname,    // Всегда отправляем (бэк обработает пустую строку или null)
        // email: formData.email          // Всегда отправляем
    };

    // Добавляем пароль, только если он был введен
    if (formData.password) { 
        payload.password = formData.password;
        // Уточните у бэкендера, нужно ли отправлять password_confirmation!
        // Если да: payload.password_confirmation = formData.passwordConfirmation;
    }
    // ------------------------------------------------------------------------------------


    // Проверка, изменилось ли что-то *вообще* (опционально, но полезно)
    let hasChanges = false;
    if (formData.firstName !== (props.currentUser?.first_name || '')) hasChanges = true;
    if (formData.lastName !== (props.currentUser?.last_name || '')) hasChanges = true;
    if (formData.nickname !== (props.currentUser?.nickname || '')) hasChanges = true;
    // if (formData.email !== (props.currentUser?.email || '')) hasChanges = true;
    if (formData.password) hasChanges = true; // Если пароль введен, точно есть изменения

    if (!hasChanges) {
        successMsg.value = 'No changes detected.';
        isLoading.value = false;
        setTimeout(closeModal, 1500);
        return;
    }
    
    // Отправляем запрос
    try {
        console.log('Sending payload to PUT /users/{id}:', payload); // Лог для отладки
        await apiClient.put(`/users/${authStore.userId}`, payload);
        successMsg.value = 'Profile updated successfully!';
        emit('profileUpdated'); 
        setTimeout(closeModal, 1500); 

    } catch (err) {
        console.error("Error updating profile:", err);
        // Попытка извлечь сообщение об ошибке валидации от бэка, если оно есть
        let backendErrorMessage = err.response?.data?.message || err.response?.data?.error;
        // Если бэк возвращает ошибки валидации по полям, можно их обработать
        // if (typeof err.response?.data?.errors === 'object') { ... }
        errorMsg.value = backendErrorMessage || 'Failed to update profile.';
    } finally {
        isLoading.value = false;
    }
};

const closeModal = () => {
  emit('close');
};
   
   </script>
   
   <style scoped>
   </style>