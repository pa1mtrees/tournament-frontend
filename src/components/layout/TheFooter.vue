<template>
    <footer class="bg-[var(--color-primary)] text-[var(--color-text-light)] py-8 px-4 md:rounded-t-[2vw]">
      <div class="container mx-auto">
        <div class="flex flex-wrap justify-between gap-8">
  
          <div class="flex flex-col space-y-2">
            <h4 class="text-xl mb-2">Navigation</h4>
            <router-link to="/tournaments" class="footer-text">Tournaments</router-link>
            <router-link to="/about" class="footer-text">About Us</router-link>
            <router-link to="/contacts" class="footer-text">Contacts</router-link>
          </div>
  
          <div class="flex flex-col space-y-2 items-end md:items-start">
             <h4 class=" text-xl mb-2">Actions</h4>
            <router-link to="#" class="footer-text">Participate</router-link>
            <router-link to="/tournaments/create" class="footer-text">Create Tournament</router-link>
                  <div class="flex justify-center space-x-4 mt-8">
        <a href="#">
        <svg height="48" width="48" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <g fill="none">
                <rect height="256" width="256" fill="#0f131a" rx="60"/>
                <g clipPath="url(#skillIconsDiscord0)">
                    <path d="M197.308 64.797a164.918 164.918 0 0 0-40.709-12.627a.618.618 0 0 0-.654.31c-1.758 3.126-3.706 7.206-5.069 10.412c-15.373-2.302-30.666-2.302-45.723 0c-1.364-3.278-3.382-7.286-5.148-10.412a.643.643 0 0 0-.655-.31a164.472 164.472 0 0 0-40.709 12.627a.583.583 0 0 0-.268.23c-25.928 38.736-33.03 76.52-29.546 113.836a.685.685 0 0 0 .26.468c17.106 12.563 33.677 20.19 49.94 25.245a.648.648 0 0 0 .702-.23c3.847-5.254 7.276-10.793 10.217-16.618a.633.633 0 0 0-.347-.881c-5.44-2.064-10.619-4.579-15.601-7.436a.642.642 0 0 1-.063-1.064a86.364 86.364 0 0 0 3.098-2.428a.618.618 0 0 1 .646-.088c32.732 14.944 68.167 14.944 100.512 0a.617.617 0 0 1 .655.08a79.613 79.613 0 0 0 3.106 2.436a.642.642 0 0 1-.055 1.064a102.622 102.622 0 0 1-15.609 7.428a.638.638 0 0 0-.339.889a133.075 133.075 0 0 0 10.208 16.61a.636.636 0 0 0 .702.238c16.342-5.055 32.913-12.682 50.02-25.245a.646.646 0 0 0 .26-.46c4.17-43.141-6.985-80.616-29.571-113.836a.506.506 0 0 0-.26-.238ZM94.834 156.142c-9.855 0-17.975-9.047-17.975-20.158s7.963-20.158 17.975-20.158c10.09 0 18.131 9.127 17.973 20.158c0 11.111-7.962 20.158-17.974 20.158Zm66.456 0c-9.855 0-17.974-9.047-17.974-20.158s7.962-20.158 17.974-20.158c10.09 0 18.131 9.127 17.974 20.158c0 11.111-7.884 20.158-17.974 20.158Z" fill="#fff"/>
                </g>
                <defs>
                    <clipPath id="skillIconsDiscord0">
                        <path d="M28 51h200v154.93H28z" fill="#fff"/>
                    </clipPath>
                </defs>
            </g>
        </svg>
        </a>
        <a href="#">
        <svg height="48" width="48" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <g fill="none">
                <rect height="256" width="256" fill="#0f131a" rx="60"/>
                <rect height="256" width="256" fill="#0f131a" rx="60"/>
                <path d="M199.572 91.411c.11 1.587.11 3.174.11 4.776c0 48.797-37.148 105.075-105.075 105.075v-.03A104.54 104.54 0 0 1 38 184.677c2.918.351 5.85.526 8.79.533a74.154 74.154 0 0 0 45.864-15.839a36.976 36.976 0 0 1-34.5-25.645a36.811 36.811 0 0 0 16.672-.636c-17.228-3.481-29.623-18.618-29.623-36.198v-.468a36.705 36.705 0 0 0 16.76 4.622c-16.226-10.845-21.228-32.432-11.43-49.31a104.814 104.814 0 0 0 76.111 38.582a36.95 36.95 0 0 1 10.683-35.283c14.874-13.982 38.267-13.265 52.249 1.601a74.105 74.105 0 0 0 23.451-8.965a37.061 37.061 0 0 1-16.234 20.424A73.446 73.446 0 0 0 218 72.282a75.023 75.023 0 0 1-18.428 19.13Z" fill="#fff"/>
            </g>
        </svg>
        </a>
        <a href="#">
          <svg height="48" width="48" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <g fill="none">
              <rect
              width="512" height="512"
              rx="25%"
              fill="#0f131a"/>
              <path fill="#c8daea" d="M199 404c-11 0-10-4-13-14l-32-105 245-144"/>
              <path fill="#a9c9dd" d="M199 404c7 0 11-4 16-8l45-43-56-34"/>
              <path fill="#f6fbfe" d="M204 319l135 99c14 9 26 4 30-14l55-258c5-22-9-32-24-25L79 245c-21 8-21 21-4 26l83 26 190-121c9-5 17-3 11 4"/>
            </g>
          </svg>
        </a>
      </div>
          </div>
  
          <div class="flex flex-col space-y-2">
            <h4 class="text-xl mb-2">Info & Support</h4>
            <router-link to="#" class="footer-text">FAQ</router-link> 
            <router-link to="#" class="footer-text">Support</router-link> 
            <router-link to="#" class="footer-text">Privacy Policy</router-link> 
            <router-link to="#" class="footer-text">Terms of Service</router-link> 
          </div>
  
          <div class="items-end md:items-start flex flex-col space-y-2 self-start">
            <img src="/src/assets/heart.gif" alt="Logo" class="w-30 hidden md:flex" />
            <span class="jersey text-5xl tracking-wide text-[var(--color-myred)]">heartbit</span> 
            <p class="text-xs text-[var(--color-text-muted)]">&copy; {{ currentYear }} heartbit. All rights reserved.</p>
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