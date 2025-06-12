<template>
 <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="isOpen" class="poppins fixed inset-0 bg-secondary/90 z-40 flex items-center justify-center p-4" @click.self="closeModal">
      <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">

        <section v-if="isOpen" class="max-w-2xl mt-10 p-6 mx-auto bg-[var(--color-primary)] rounded-[1vw] shadow-xl w-full overflow-hidden">
            <h2 class="text-2xl text-[var(--color-myred)] capitalize font-['Jaro']">
                Account Settings
            </h2>

            <form @submit.prevent="handleUpdateProfile">
                <div class="mt-6 flex flex-col items-center">
                    <label class="label-style mb-2">Profile Avatar</label>

                    <div class="relative w-28 h-28 rounded-[10%] group">
                        <img
                            v-if="currentAvatarForForm && !avatarPreviewUrl"
                            :src="currentAvatarForForm"
                            alt="Current Avatar"
                            class="w-full h-full rounded-[10%] object-cover absolute inset-0 z-0"
                        >
                        <div
                            v-if="!currentAvatarForForm && !avatarPreviewUrl"
                            class="w-full h-full rounded-[10% bg-[var(--color-secondary)] border-2 border-[var(--color-myred)] flex items-center justify-center text-4xl text-[var(--color-text-light)] font-bold absolute inset-0 z-0"
                        >
                            {{ (props.currentUser.nickname || props.currentUser.first_name || '?').charAt(0).toUpperCase() }}
                        </div>

                        <el-upload
                          ref="uploadRef"
                          class="avatar-uploader-custom"
                          action="#"
                          :show-file-list="false"
                          :auto-upload="false"
                          :on-change="handleElFileChange"
                          :before-upload="beforeAvatarUpload"
                        >
                          <img v-if="avatarPreviewUrl" :src="avatarPreviewUrl" class="avatar-preview" />
                          <el-icon v-else class="avatar-uploader-icon-custom">
                            <Plus v-if="currentAvatarForForm" />
                          </el-icon>
                        </el-upload>
                    </div>
                    <p class="text-xs text-[var(--color-text-muted)] mt-2">Max 2MB. JPG, PNG, WEBP.</p>
                </div>

                <div class="grid gap-6 mt-4 grid-cols-2">
                    <div>
                        <label class="label-style" for="profileFirstName">First Name</label>
                        <input id="profileFirstName" type="text" v-model.trim="formData.firstName" required class="input-style">
                    </div>
                    <div>
                        <label class="label-style" for="profileLastName">Last Name</label>
                        <input id="profileLastName" type="text" v-model.trim="formData.lastName" required class="input-style">
                    </div>
                    <div>
                        <label class="label-style" for="profileNickname">Nickname</label>
                        <input id="profileNickname" type="text" v-model.trim="formData.nickname" placeholder="Leave blank if none" class="input-style">
                    </div>
                    <div>
                        <label class="label-style" for="profileEmailAddress">Email Address</label>
                        <input id="profileEmailAddress" type="email" v-model.trim="formData.email" required placeholder="your.email@example.com" class="input-style">
                    </div>
                    <div>
                        <label class="label-style" for="profilePassword">New Password</label>
                        <input id="profilePassword" type="password" v-model="formData.password" placeholder="Leave blank to keep current" class="input-style">
                    </div>
                    <div>
                        <label class="label-style" for="profilePasswordConfirmation">Confirm Password</label>
                        <input id="profilePasswordConfirmation" type="password" v-model="formData.passwordConfirmation" placeholder="Confirm new password" class="input-style" :disabled="!formData.password">
                    </div>
                </div>

                <div v-if="errorMsg" class="text-red-500 text-sm text-center mt-4"> {{ errorMsg }} </div>
                <div v-if="successMsg" class="text-green-500 text-sm text-center mt-4"> {{ successMsg }} </div>

                <div class="flex justify-end mt-6 space-x-3">
                     <button type="button" @click="closeModal" :disabled="isLoading" class="px-6 py-2 text-sm font-medium rounded-md border border-myred text-[var(--color-myred)] hover:bg-secondary focus:outline-none disabled:opacity-50"> Cancel </button>
                     <button type="submit" :disabled="isLoading || !isAnythingChanged" class="px-6 py-2 text-sm font-medium rounded-md shadow-sm text-[var(--color-text-light)] bg-[var(--color-myred)] hover:bg-myreddarker focus:outline-none disabled:opacity-50">
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
import { useAuthStore } from '@/stores/authStore';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  currentUser: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['close', 'profileUpdated']);
const authStore = useAuthStore();

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

const selectedAvatarFile = ref(null);
const avatarPreviewUrl = ref('');
const currentAvatarForForm = computed(() => {
    if (props.currentUser?.logo_url) {
        return props.currentUser.logo_url;
    }
    if (props.currentUser?.email || props.currentUser?.id) {
        const seed = props.currentUser.nickname || props.currentUser.first_name || props.currentUser.email || props.currentUser.id;
        return `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(seed)}`;
    }
    return null;
});

const isAnythingChanged = computed(() => {
    if (!props.currentUser) return !!selectedAvatarFile.value;
    const detailsChanged = formData.firstName !== (props.currentUser.first_name || '') ||
                           formData.lastName !== (props.currentUser.last_name || '') ||
                           formData.nickname !== (props.currentUser.nickname || '') ||
                           formData.email !== (props.currentUser.email || '') ||
                           formData.password !== '';
    return detailsChanged || !!selectedAvatarFile.value;
});

const populateForm = () => {
    errorMsg.value = '';
    successMsg.value = '';
    selectedAvatarFile.value = null;
    avatarPreviewUrl.value = '';

    if (props.currentUser) {
        formData.firstName = props.currentUser.first_name || '';
        formData.lastName = props.currentUser.last_name || '';
        formData.nickname = props.currentUser.nickname || '';
        formData.email = props.currentUser.email || '';
        formData.password = '';
        formData.passwordConfirmation = '';
    }
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    populateForm();
  }
}, { immediate: true });

// Валидация для el-upload
const beforeAvatarUpload = (rawFile) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(rawFile.type)) {
    ElMessage.error('Avatar picture must be JPG, PNG or WEBP format!');
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!');
    return false;
  }
  return true;
};

const handleElFileChange = (uploadFile) => {
  if (uploadFile.raw && beforeAvatarUpload(uploadFile.raw)) {
    selectedAvatarFile.value = uploadFile.raw;
    avatarPreviewUrl.value = URL.createObjectURL(uploadFile.raw);
    errorMsg.value = '';
  } else {
    if (!uploadFile.raw && selectedAvatarFile.value) {
        selectedAvatarFile.value = null;
        avatarPreviewUrl.value = '';
    }
  }
};
const handleUpdateProfile = async () => {
    if (!isAnythingChanged.value) {
        successMsg.value = 'No changes to save.';
        setTimeout(closeModal, 1500);
        return;
    }
    errorMsg.value = ''; successMsg.value = ''; isLoading.value = true;
    let profileDetailsSuccessfullyUpdated = false;

    const detailsPayload = {};
    if (formData.firstName !== (props.currentUser?.first_name || '')) detailsPayload.first_name = formData.firstName;
    if (formData.lastName !== (props.currentUser?.last_name || '')) detailsPayload.last_name = formData.lastName;
    if (formData.nickname !== (props.currentUser?.nickname || '')) detailsPayload.nickname = formData.nickname;
    if (formData.email !== (props.currentUser?.email || '')) detailsPayload.email = formData.email;

    if (formData.password) {
        if (formData.password !== formData.passwordConfirmation) {
            errorMsg.value = 'New passwords do not match.';
            isLoading.value = false;
            return;
        }
        detailsPayload.password = formData.password;
    }

    if (Object.keys(detailsPayload).length > 0) {
        try {
            await apiClient.put(`/users/${authStore.userId}`, detailsPayload);
            profileDetailsSuccessfullyUpdated = true;
            successMsg.value = 'Profile details updated. ';
        } catch (err) {
            console.error("Error updating profile details:", err);
            errorMsg.value = err.response?.data?.message || 'Failed to update profile details.';
            isLoading.value = false;
            return;
        }
    }

    if (selectedAvatarFile.value) {
        const avatarFormData = new FormData();
        avatarFormData.append('avatar', selectedAvatarFile.value);
        try {
            await apiClient.post(`/users/${authStore.userId}/avatar`, avatarFormData, {
                headers: { 'Content-Type': undefined }
            });
            successMsg.value += 'Avatar uploaded successfully!';
            profileDetailsSuccessfullyUpdated = true;
        } catch (err) {
            console.error("Error uploading avatar:", err);
            if (profileDetailsSuccessfullyUpdated) {
                errorMsg.value = `Details updated, but avatar upload failed: ${err.response?.data?.message || err.message}`;
            } else {
                errorMsg.value = `Failed to upload avatar: ${err.response?.data?.message || err.message}`;
            }
        }
    }

    isLoading.value = false;
    if (!errorMsg.value || profileDetailsSuccessfullyUpdated) {
        if (!successMsg.value && !errorMsg.value) {
             successMsg.value = 'No changes were made.';
        }
        emit('profileUpdated');
        setTimeout(closeModal, errorMsg.value ? 3500 : 1500);
    }
};

const closeModal = () => {
  selectedAvatarFile.value = null;
  avatarPreviewUrl.value = '';
  emit('close');
};
</script>

<style scoped>
.avatar-uploader-custom {
  width: 7rem;
  height: 7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 10%;
}

:deep(.avatar-uploader-custom .el-upload) {
  width: 100%;
  height: 100%;
  border-radius: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  border: 2px dashed var(--color-text-muted);
  transition: border-color 0.3s, background-color 0.3s;
}

:deep(.avatar-uploader-custom .el-upload:hover) {
  border-color: var(--color-myreddarker);
  background-color: rgba(0, 0, 0, 0.5);
    color: var(--color-myreddarker);

}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10%;
  display: block;
}

.avatar-uploader-icon-custom {
    --color: inherit;
    align-items: center;
    display: inline-flex;
    height: 2em;
    justify-content: center;
    line-height: 2em;
    position: relative;
    width: 2em;
    fill: currentColor;
    color: var(--color);
    font-size: inherit;
}
</style>
