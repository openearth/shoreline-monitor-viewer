<template>
  <div class="basemap-control">
    <button
      class="basemap-toggle-btn mapboxgl-ctrl"
      type="button"
      @click="toggleDropdown"
    >
      <svg
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"
        />
      </svg>
    </button>

    <div
      v-if="showDropdown"
      class="basemap-dropdown mapboxgl-style-list"
    >
      <button
        v-for="style in styles"
        :key="style.title"
        :class="{ active: activeStyle === style.title }"
        type="button"
        @click="selectStyle(style)"
      >
        {{ style.title }}
      </button>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, onUnmounted, ref } from 'vue'

  const props = defineProps({
    styles: {
      type: Array,
      required: true,
    },
  })

  const activeStyle = defineModel('activeStyle', {
    type: String,
    required: true,
  })

  const showDropdown = ref(false)

  function toggleDropdown () {
    showDropdown.value = !showDropdown.value
  }

  function selectStyle (style) {
    if (activeStyle.value === style.title) {
      showDropdown.value = false
      return
    }
    // Switch to new basemap style
    activeStyle.value = style.title
    showDropdown.value = false

    // Note: LocationsLayer component automatically re-adds its layers
    // when it detects the new style has loaded via its reactive watch
  }

  function handleClickOutside (event) {
    const controlElement = document.querySelector('.basemap-control')
    if (controlElement && !controlElement.contains(event.target)) {
      showDropdown.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
</script>

<style scoped>
.basemap-control {
  position: relative;
}
.basemap-toggle-btn {
  width: 30px;
  height: 30px;
  padding: 3px;
  background-color: white;
  outline: 0;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.basemap-toggle-btn:hover {
  background-color: #f2f2f2;
}
.basemap-dropdown {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 8px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 120px;
}
.basemap-dropdown button {
  background: none;
  border: none;
  cursor: pointer;
  display: block;
  font-size: 14px;
  padding: 8px 8px 6px;
  text-align: right;
  width: 100%;
  height: auto;
}
.basemap-dropdown button.active {
  font-weight: bold;
}
.basemap-dropdown button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
.basemap-dropdown button + button {
  border-top: 1px solid #ddd;
}
</style>
