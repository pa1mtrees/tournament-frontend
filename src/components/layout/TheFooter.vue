<template>
    <footer class="bg-[var(--color-primary)] text-[var(--color-text-light)] py-8 px-4 md:rounded-t-[2vw]">
      <div class="container mx-auto">
        <div class="flex flex-wrap justify-between gap-8">
  
          <div class="flex flex-col space-y-2">
            <h4 class="font-semibold text-xl mb-2">Navigation</h4>
            <router-link to="/tournaments" class="footer-text">Tournaments</router-link>
            <router-link to="/about" class="footer-text">About Us</router-link>
            <router-link to="/contacts" class="footer-text">Contacts</router-link>
          </div>
  
          <div class="flex flex-col space-y-2 items-end md:items-start">
             <h4 class="font-semibold text-xl mb-2">Actions</h4>
            <router-link to="#" class="footer-text">Participate</router-link>
            <router-link to="/tournaments/create" class="footer-text">Create Tournament</router-link>
          </div>
  
          <div class="flex flex-col space-y-2">
            <h4 class="font-semibold text-xl mb-2">Info & Support</h4>
            <router-link to="#" class="footer-text">FAQ</router-link> 
            <router-link to="#" class="footer-text">Support</router-link> 
            <router-link to="#" class="footer-text">Privacy Policy</router-link> 
            <router-link to="#" class="footer-text">Terms of Service</router-link> 
          </div>
  
          <div class="items-end md:items-start flex flex-col space-y-2 self-start">
            <img src="/src/assets/Logo.svg" alt="Logo" class="w-[min(5vw, 50px)] hidden md:flex" />
            <span class="mobile-jaro text-2xl font-bold text-[var(--color-myyellow)]">Tournex</span> 
            <p class="text-xs text-[var(--color-text-muted)]">&copy; {{ currentYear }} Tournex. All rights reserved.</p>
          </div>
  
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router';
  
  // Получаем текущий год для копирайта
  const currentYear = new Date().getFullYear();
  </script>
  
  <style scoped>
  /* Дополнительные стили для футера при необходимости */
  </style>