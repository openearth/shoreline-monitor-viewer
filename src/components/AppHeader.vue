<template>
  <v-app-bar
    :color="color"
  >
    <v-toolbar-title>
      {{ title }}
    </v-toolbar-title>

  </v-app-bar>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'primary',
    }
  },
}
</script>

<style>
</style>