<template>
  <div class="py-12 mx-36 md:py-16 poppins text-[var(--color-text-light)]">
    <section class="relative py-6 bg-[var(--color-secondary)] overflow-hidden">
      <div class="relative container mx-auto px-4 grid md:grid-cols-3 gap-8 md:gap-12 items-center">
          <div class="order-1 md:order-2 flex justify-start md:col-span-1">
          <img 
            src="/src/assets/heart.gif" 
            alt="Tournex Mission Illustration" 
            class="rounded-xl w-1/2 max-w-[250px] md:max-w-xs object-contain"
          />
        </div>
        <div class="order-1 md:order-1 md:col-span-2 bg-black/40 backdrop-blur-sm p-6 rounded-lg">
          <h2 class="text-3xl md:text-4xl font-['Jaro'] text-[var(--color-text-light)] mb-4">
            Who We Are?
          </h2>
          <div>
            <p class="text-[var(--color-text-light)] leading-relaxed mb-4"> 
              <span class="jersey-small text-xl md:text-2xl text-myred tracking-wide align-middle">heartbit</span>
              was created in 2025 by three enthusiasts who were looking for the convenient platform for organazing tournaments.
              We didn't like spending our time regularly searching for universal tournament-creator platform.
              Therefore, we decided to combine various sports to create a unique environment.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="relative py-6 bg-[var(--color-secondary)] overflow-hidden">
      <div class="relative container mx-auto px-4 grid md:grid-cols-3 gap-4 md:gap-8 items-center">
          <div class="order-1 md:order-1 flex justify-end md:col-span-1">
          <img 
            src="/src/assets/rocket.gif" 
            alt="Tournex Mission Illustration" 
            class="w-full max-w-[250px] md:max-w-xs object-contain animate-float"
          />
        </div>
        <div class="order-1 md:order-2 md:col-span-2 bg-black/40 backdrop-blur-sm p-6 rounded-lg">
          <h2 class="text-3xl md:text-4xl font-['Jaro'] text-[var(--color-text-light)] mb-4">
            Our Mission
          </h2>
          <div>
            <p class="text-[var(--color-text-light)] leading-relaxed mb-4"> 
              We believe in the power of competition to bring people together, foster skill development, 
              and create unforgettable moments. Our mission is to provide a seamless, fair, and engaging 
              platform for everyone – from casual players to professional organizers.
            </p>
            <p class="text-[var(--color-text-light)] leading-relaxed">
              <span class="jersey-small text-xl md:text-2xl text-myred tracking-wide align-middle">heartbit</span>
              aims to break down barriers, making tournament participation and organization 
              accessible, intuitive, and exciting for all. We are dedicated to building a vibrant
              community where passion for gaming and sports thrives.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="relative py-6 bg-[var(--color-secondary)] overflow-hidden">
      <div class="relative container mx-auto px-4 grid md:grid-cols-1 gap-8 md:gap-12 items-center">
        <div class=" bg-black/40 backdrop-blur-sm p-6 rounded-lg">
          <h2 class="text-3xl md:text-4xl font-['Jaro'] text-[var(--color-text-light)] mb-4">
            Product
          </h2>
          <div>
            <p class="text-[var(--color-text-light)] leading-relaxed mb-4">
              <span class="jersey-small text-xl md:text-2xl text-myred tracking-wide align-middle">heartbit</span>
              offers a comprehensive suite of tools for tournament organizers, including
              flexible bracket generation, participant management, and result tracking. For players,
              we provide an easy way to discover tournaments, join teams, and follow their progress.
            </p>
            <p class="text-[var(--color-text-light)] leading-relaxed">
              With a focus on user experience and robust technology, we are constantly evolving
              to meet the needs of the competitive gaming and sports scenes.
            </p>
          </div>
        </div>
      </div>
    </section>

        <!-- Как это работает -->
    <section class="py-6 bg-[var(--color-secondary)]">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl md:text-5xl font-['Jaro'] text-[var(--color-text-light)] mb-4 text-center">How It Works?</h1>
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
          
          <div class="relative aspect-square rounded-4xl shadow-md overflow-hidden group">
            <ShaderBackground :is-active="true" :cols="8" :rows="6" :speed-multiplier="0.4" />
            <div class="absolute inset-0 p-6 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex flex-col items-center justify-center text-center z-10">
            <img src="/src/assets/users.svg" alt="Join Icon" class="responsive-card 2xl:mb-4 opacity-75" />            
            <h3 class="text-3xl md:text-4xl lg:text-5xl md:mb-2 text-white font-['Jaro']">SIGN UP</h3>
              <p class="text-xs md:text-base text-gray-300">
                Create your account
              </p>
            </div>
          </div>

          <div class="relative aspect-square rounded-4xl shadow-md overflow-hidden group">
            <ShaderBackground :is-active="true" :cols="8" :rows="6" :speed-multiplier="0.45" />
            <div class="absolute inset-0 p-6 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex flex-col items-center justify-center text-center z-10">
              <img src="/src/assets/plus.svg" alt="Join Icon" class="responsive-card 2xl:mb-4 opacity-75" />
              <h3 class="text-3xl md:text-4xl lg:text-5xl md:mb-2 text-white font-['Jaro']">JOIN</h3>
              <p class="text-xs md:text-base text-gray-300">
                Find and join tournament
              </p>
            </div>
          </div>

          <div class="relative aspect-square rounded-4xl shadow-md overflow-hidden group">
            <ShaderBackground :is-active="true" :cols="8" :rows="6" :speed-multiplier="0.5" />
            <div class="absolute inset-0 p-6 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex flex-col items-center justify-center text-center z-10">
              <img src="/src/assets/cards.svg" alt="Play Icon" class="responsive-card 2xl:mb-4 opacity-75" />
              <h3 class="text-3xl md:text-4xl lg:text-5xl md:mb-2 text-white font-['Jaro']">PLAY</h3>
              <p class="text-xs md:text-base text-gray-300">
                Compete with others
              </p>
            </div>
          </div>

          <div class="relative aspect-square rounded-4xl shadow-md overflow-hidden group">
            <ShaderBackground :is-active="true" :cols="8" :rows="6" :speed-multiplier="0.55" />
            <div class="absolute inset-0 p-6 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex flex-col items-center justify-center text-center z-10">
              <img src="/src/assets/bullseye.svg" alt="Win Icon" class="responsive-card 2xl:mb-4 opacity-75" />
              <h3 class="text-3xl md:text-4xl lg:text-5xl md:mb-2 text-white font-['Jaro']">WIN!</h3>
              <p class="text-xs md:text-base text-gray-300">Get your prize</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Преимущества -->
    <section class="container mx-auto px-4 py-6">
      <h2 class="text-3xl md:text-5xl font-['Jaro'] text-[var(--color-text-light)] mb-4 text-center">Advantages</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-primary p-4 rounded-lg shadow-md text-center">
          <h3 class="text-white text-2xl mb-2">AUTOMATION</h3>
          <p class="text-gray-300">Automated tournament management</p>
        </div>
        <div class="bg-primary p-4 rounded-lg shadow-md text-center">
          <h3 class="text-white text-2xl mb-2">SUPPORT</h3>
          <p class="text-gray-300">24/7 technical support</p>
        </div>
        <div class="bg-primary p-4 rounded-lg shadow-md text-center">
          <h3 class="text-white text-2xl mb-2">STATISTICS</h3>
          <p class="text-gray-300">Detailed player statistics</p>
        </div>
        <div class="bg-primary p-4 rounded-lg shadow-md text-center">
          <h3 class="text-white text-2xl mb-2">STREAMING</h3>
          <p class="text-gray-300">Built-in streaming tools</p>
        </div>
      </div>
    </section>
    
    <section class="container mx-auto px-4 py-4 md:py-6 text-center">
      <h2 class="text-3xl md:text-4xl font-['Jaro'] text-[var(--color-text-light)] mb-4">
        Ask Us Anything!
      </h2>
      <p class="text-lg text-[var(--color-text-muted)] mb-2">
        Have questions or suggestions? We'd love to hear from you.
      </p>
      <a 
        href="mailto:support@heartbit.com" 
        class="text-xl text-[var(--color-myreddarker)] hover:underline font-semibold"
      >
        support@heartbit.com 
      </a>
      <div class="flex justify-center space-x-4 mt-8">
        <a href="#">
        <svg height="48" width="48" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <g fill="none">
                <rect height="256" width="256" fill="#171e28" rx="60"/>
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
                <rect height="256" width="256" fill="#171e28" rx="60"/>
                <rect height="256" width="256" fill="#171e28" rx="60"/>
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
              fill="#171e28"/>
              <path fill="#c8daea" d="M199 404c-11 0-10-4-13-14l-32-105 245-144"/>
              <path fill="#a9c9dd" d="M199 404c7 0 11-4 16-8l45-43-56-34"/>
              <path fill="#f6fbfe" d="M204 319l135 99c14 9 26 4 30-14l55-258c5-22-9-32-24-25L79 245c-21 8-21 21-4 26l83 26 190-121c9-5 17-3 11 4"/>
            </g>
          </svg>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import ShaderBackground from '@/components/ui/ShaderBackground.vue'; // Импортируем наш компонент

// Если будете использовать реальные SVG компоненты для иконок, импортируйте их
// import DiscordIcon from '@/assets/icons/discord.svg?component';
// import TwitterIcon from '@/assets/icons/twitter.svg?component';
// import InstagramIcon from '@/assets/icons/instagram.svg?component';
</script>

<style scoped>
/* Стили для карточек "What Makes Tournex Special?" */

/* Анимация полета для ракеты */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px) rotate(-6deg);
  }
  25% {
    transform: translateY(-10px) translateX(-6px) rotate(0deg);
  }
  50% {
    transform: translateY(0px) translateX(6px) rotate(6deg);
  }
  75% {
    transform: translateY(-6px) translateX(0px) rotate(0deg);
  }
}

.animate-float {
  animation: float 6s infinite ease-in-out;
}
</style>
