<template>
  <div class="border-b border-[var(--color-secondary)]">
    <nav class="-mb-px flex space-x-1 pl-2 sm:space-x-4 overflow-x-auto whitespace-nowrap" aria-label="Tabs">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        @click="selectTab(tab.name)"
        :class="[
          activeTab === tab.name
            ? 'border-[var(--color-myred)] text-[var(--color-myred)] font-semibold'
            : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-light)] hover:border-gray-500',
          'inline-flex items-center py-3 px-2 sm:px-4 border-b-2 text-sm focus:outline-none transition-colors duration-150 ease-in-out group'
        ]"
        :aria-current="activeTab === tab.name ? 'page' : undefined"
      >
        <component
            v-if="tab.icon"
            :is="tab.icon"
            :class="[activeTab === tab.name ? 'text-[var(--color-myred)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-light)]', '-ml-0.5 mr-2 h-5 w-5']"
            aria-hidden="true"
        />
        <span class="text-sm sm:text-base">{{ tab.label }}</span>
        <span
            v-if="tab.badgeContent !== undefined && tab.badgeContent !== null"
            :class="[
                activeTab === tab.name ? 'bg-[var(--color-myred)] text-white' : 'bg-gray-600 text-gray-200',
                'ml-2 inline-block py-0.5 px-2 text-xs font-medium rounded-full'
            ]"
        >
            {{ tab.badgeContent }}
        </span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    default: () => []
  },
  activeTab: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:activeTab']);

const selectTab = (tabName) => {
  emit('update:activeTab', tabName);
};
</script>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
.overflow-x-auto {
  -ms-overflow-style: none; 
  scrollbar-width: none;
}
</style>
