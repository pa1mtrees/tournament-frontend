<template>
  <div ref="wrapperRef" class="relative inline-block">
    <slot />
    <transition name="fade">
      <div
        v-if="visible"
        ref="popRef"
        class="absolute poppins text-sm left-1/2 z-50 mt-2 -translate-x-1/2 bg-primary rounded-xl shadow-xl p-4 min-w-[220px] max-w-xs border border-myred"
        style="top: 110%;"
      >
        <div class="mb-2 text-[var(--color-text-light)] text-sm leading-snug">
          <template v-if="message">
            {{ message }}
          </template>
          <template v-else>
            <span class="text-xs">Are you sure you want to permanently delete the team </span>
            <span class="text-myred font-semibold"> {{ teamName }} </span>?
            <br>
            <span class="text-xs text-gray-300">This action cannot be undone.</span>
          </template>
        </div>
        <div class="flex justify-end gap-2 font-semibold">
          <button @click="onCancel" class="px-3 py-1 rounded border border-myred hover:border-myreddarker hover:bg-myreddarker text-myred hover:text-white">Cancel</button>
          <button @click="onConfirm" class="px-3 py-1 rounded bg-myred hover:bg-myreddarker text-white font-semibold">Confirm</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

const props = defineProps({
  visible: Boolean,
  teamName: String,
  message: String,
});
const emit = defineEmits(['confirm', 'cancel']);
const onConfirm = () => emit('confirm');
const onCancel = () => emit('cancel');

const wrapperRef = ref(null);
const popRef = ref(null);

function handleClickOutside(event) {
  if (
    props.visible &&
    popRef.value &&
    !popRef.value.contains(event.target) &&
    wrapperRef.value &&
    !wrapperRef.value.contains(event.target)
  ) {
    emit('cancel');
  }
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }
);

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>