<template>
  <router-link :to="to" ref="buttonRef" class="animated-pixel-button">
    <div class="pixel-grid-container" ref="pixelContainerRef">
      <!-- Pixels will be generated here by JavaScript -->
    </div>
    <span class="button-text-overlay">
      <slot></slot> <!-- For button text -->
    </span>
  </router-link>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps, nextTick } from 'vue';
import { RouterLink } from 'vue-router';
import * as animeNs from 'animejs';

console.log('Inspecting animeNs Module:', animeNs); // Keep this log for inspection

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
  colors: {
    type: Array,
    default: () => ['#bc4747', '#de2424', '#962b2b'],
  },
  rows: {
    type: Number,
    default: 5,
  },
  cols: {
    type: Number,
    default: 10,
  },
});

const buttonRef = ref(null);
const pixelContainerRef = ref(null);
const pixelElements = [];

// Attempt to find the anime function within the namespace
let animeFunction = null;
let animeUtilities = null; // To hold the object that has .random and .remove

if (typeof animeNs.default === 'function') {
  animeFunction = animeNs.default;
  animeUtilities = animeNs.default;
} else if (typeof animeNs.anime === 'function') { // Common named export
  animeFunction = animeNs.anime;
  animeUtilities = animeNs.anime;
} else if (typeof animeNs.Anime === 'function') { // Another common named export
  animeFunction = animeNs.Anime;
  animeUtilities = animeNs.Anime;
} else if (typeof animeNs === 'function') { // If the namespace itself is the function
  animeFunction = animeNs;
  animeUtilities = animeNs;
} else {
  // Fallback: Iterate over keys if common names fail (more desperate)
  for (const key in animeNs) {
    if (typeof animeNs[key] === 'function' && key.toLowerCase() === 'anime') {
      animeFunction = animeNs[key];
      animeUtilities = animeNs[key]; // Assume utilities are on the same object
      break;
    }
  }
}


if (!animeFunction) {
  console.error('Failed to resolve anime function. animeNs:', animeNs);
}


const animatePixel = (element) => {
  if (!element) return;
  if (typeof animeFunction !== 'function') {
    console.error('animatePixel: animeFunction is not a function. Resolved animeFunction:', animeFunction);
    return;
  }

  const randomFn = animeUtilities && typeof animeUtilities.random === 'function' ? animeUtilities.random : Math.random;
  
  animeFunction({
    targets: element,
    backgroundColor: () => props.colors[randomFn(0, props.colors.length - 1)],
    duration: () => randomFn(300, 1200),
    easing: 'linear',
    complete: () => {
      if (pixelContainerRef.value && pixelContainerRef.value.contains(element)) {
        animatePixel(element);
      }
    },
  });
};

onMounted(async () => {
  await nextTick();
  if (!animeFunction) {
    console.warn('onMounted: animeFunction is not resolved. Animation will not start.');
    return;
  }

  if (pixelContainerRef.value && buttonRef.value && buttonRef.value.$el) {
    const container = pixelContainerRef.value;
    const totalPixels = props.rows * props.cols;

    for (let i = 0; i < totalPixels; i++) {
      const pixelEl = document.createElement('div');
      pixelEl.style.width = `${100 / props.cols}%`;
      pixelEl.style.height = `${100 / props.rows}%`;
      pixelEl.classList.add('animated-pixel');
      container.appendChild(pixelEl);
      pixelElements.push(pixelEl);
      animatePixel(pixelEl);
    }
  }
});

onUnmounted(() => {
  if (pixelElements.length > 0 && animeUtilities && typeof animeUtilities.remove === 'function') {
    animeUtilities.remove(pixelElements);
  } else if (pixelElements.length > 0) {
     console.warn('onUnmounted: anime.remove is not available or animeFunction not resolved.');
  }
    
  pixelElements.forEach(pixel => {
    if (pixel.parentNode) {
      pixel.parentNode.removeChild(pixel);
    }
  });
  pixelElements.length = 0;
  
  if (pixelContainerRef.value) {
    pixelContainerRef.value.innerHTML = '';
  }
});
</script>

<style scoped>
.animated-pixel-button {
  position: relative;
  display: inline-block;
  overflow: hidden;
  color: white;
  text-decoration: none;
  vertical-align: middle;
}

.pixel-grid-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  pointer-events: none;
}

.button-text-overlay {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: inherit;
  pointer-events: none;
}
</style>