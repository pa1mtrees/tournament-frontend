<template>
  <div class="admin-dashboard">
    <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>
    <div v-if="loading" class="text-center py-8">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center py-8">{{ error }}</div>
    <div v-else>
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const stats = ref({});
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('authToken');
    const res = await fetch('http://localhost:8080/admin/users/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to load dashboard stats');
    stats.value = await res.json();
  } catch (e) {
    error.value = e.message || 'Error loading dashboard';
  } finally {
    loading.value = false;
  }
});

const chartData = computed(() => ({
  labels: [
    'Total Users',
    'Total Tournaments',
    'Active Tournaments',
    'Solo Tournaments',
    'Team Tournaments',
    'Banned Users'
  ],
  datasets: [
    {
      label: 'Count',
      backgroundColor: [
        '#3b82f6', '#f59e42', '#10b981', '#6366f1', '#f43f5e', '#a3a3a3'
      ],
      data: [
        stats.value.users_total,
        stats.value.tournaments_total,
        stats.value.active_tournaments,
        stats.value.solo_total,
        stats.value.team_total,
        stats.value.banned_users
      ]
    }
  ]
}));

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: { beginAtZero: true }
  }
};
</script>

<style scoped>
.admin-dashboard {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
}
</style>
