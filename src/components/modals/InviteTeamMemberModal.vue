<template>
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
       <div v-if="isOpen" class="fixed inset-0 bg-secondary/90 z-40 flex items-center justify-center p-4" @click.self="closeModal">
         <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">

           <div v-if="isOpen" class="poppins bg-[var(--color-primary)] rounded-[1vw] shadow-xl w-full max-w-lg overflow-hidden p-6 space-y-4">
               <h3 class="text-2xl text-center text-[var(--color-myred)] font-['Jaro']">
                   Invite Team Member
               </h3>

               <div v-if="isLoading" class="text-center p-4 text-[var(--color-text-muted)]">
                   Generating invite link...
               </div>
               <div v-else-if="errorMsg" class="text-red-500 text-sm text-center p-4">
                   Error: {{ errorMsg }}
               </div>
               <div v-else-if="generatedLink" class="space-y-3">
                   <p class="text-sm text-[var(--color-text-muted)]">Share this link with the person you want to invite:</p>
                   <input
                       type="text"
                       :value="generatedLink"
                       readonly
                       class="input-style w-full text-sm select-all"
                   />
                   <button
                       @click="copyLink"
                       class="w-full px-4 py-2 text-sm font-medium rounded-md border border-transparent shadow-sm text-[var(--color-text-light)] bg-[var(--color-myred)] hover:bg-[var(--color-myreddarker)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-myyellow)]"
                   >
                      {{ copyButtonText }}
                   </button>
               </div>

               <div class="flex justify-end mt-4">
                    <button
                       type="button"
                       @click="closeModal"
                       class="px-4 py-2 text-sm font-medium rounded-md border border-myred text-[var(--color-myred)] hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                     >
                      Close
                   </button>
               </div>

           </div>
         </transition>
       </div>
     </transition>
   </template>

   <script setup>
   import { ref, watch } from 'vue';
   import apiClient from '@/services/apiClient';

   const props = defineProps({
     isOpen: { type: Boolean, required: true },
     teamId: { type: [Number, String], required: true }
   });

   const emit = defineEmits(['close']);

   const isLoading = ref(false);
   const errorMsg = ref('');
   const generatedLink = ref('');
   const copyButtonText = ref('Copy Link');

   const generateInviteLink = async () => {
    if (!props.teamId) return;

    isLoading.value = true;
    errorMsg.value = '';
    generatedLink.value = '';
    copyButtonText.value = 'Copy Link';

    try {
        const response = await apiClient.post(`/teams/${props.teamId}/invites`, {});
        console.log("Invite API Response:", response.data);

        if (response.data && response.data.invite_token) {
            const inviteToken = response.data.invite_token;

            generatedLink.value = `${window.location.origin}/invites/${inviteToken}`;

        } else {
            console.error("Field 'invite_token' not found in response data:", response.data);
            throw new Error("Invite token not found in response.");
        }

    } catch (err) {
        console.error("Error generating invite link:", err);
        errorMsg.value = err.response?.data?.message || 'Failed to generate invite link.';
    } finally {
        isLoading.value = false;
    }
};

   const copyLink = async () => {
       if (!generatedLink.value) return;
       try {
           await navigator.clipboard.writeText(generatedLink.value);
           copyButtonText.value = 'Copied!';
           setTimeout(() => {
                copyButtonText.value = 'Copy Link';
           }, 2000);
       } catch (err) {
           console.error('Failed to copy link: ', err);
            copyButtonText.value = 'Failed to copy';
            setTimeout(() => { copyButtonText.value = 'Copy Link'; }, 2000);
       }
   };

   const closeModal = () => {
     isLoading.value = false;
     errorMsg.value = '';
     generatedLink.value = '';
     copyButtonText.value = 'Copy Link';
     emit('close');
   };

   watch(() => props.isOpen, (newVal) => {
     if (newVal) {
       generateInviteLink();
     }
   });

   </script>

   <style scoped>

   </style>
