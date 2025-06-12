// src/stores/metaStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/services/apiClient';

export const useMetaStore = defineStore('meta', () => {
    // --- Sports ---
    const sports = ref([]);
    const sportsLoading = ref(false);
    const sportsError = ref('');

    const sportsMap = computed(() => {
        return sports.value.reduce((map, sport) => {
            map[sport.id] = sport.name;
            return map;
        }, {});
    });

    async function fetchSports() {
        if (sports.value.length > 0) return; // Загружаем только один раз
        
        sportsLoading.value = true;
        sportsError.value = '';
        try {
            const response = await apiClient.get('/sports');
            sports.value = response.data?.sports || []; 
            console.log('Sports loaded in store:', sports.value);
        } catch (err) {
            console.error("Error fetching sports in store:", err);
            sportsError.value = 'Failed to load sports.';
        } finally {
            sportsLoading.value = false;
        }
    }

    const formats = ref([]);
    const formatsLoading = ref(false);
    const formatsError = ref('');

    // Computed Map для форматов (ID -> Name)
    const formatsMap = computed(() => { 
        return formats.value.reduce((map, format) => {
            map[format.id] = format.name;
            return map;
        }, {});
    }); 

    async function fetchFormats() {
        if (formats.value.length > 0 && !formatsError.value) return; // Грузим один раз

        formatsLoading.value = true;
        formatsError.value = '';
        try {
            // Запрос к GET /formats
            const response = await apiClient.get('/formats'); 
            // Ожидаем массив [ { id: ..., name: ... }, ... ]
            // Correctly access the nested 'formats' array
            formats.value = response.data?.formats || []; 
            console.log('Formats loaded in store:', formats.value);
        } catch (err) {
            console.error("Error fetching formats in store:", err);
            formatsError.value = 'Failed to load formats.';
            formats.value = []; // Очищаем при ошибке
        } finally {
            formatsLoading.value = false;
        }
    }

    return {
        sports, sportsLoading, sportsError, sportsMap, fetchSports,
        formats, formatsLoading, formatsError, formatsMap, fetchFormats // Экспортируем новое
    }
});