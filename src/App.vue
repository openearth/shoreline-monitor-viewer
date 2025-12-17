<template>
  <v-app>
    <LegalDialog />

    <v-app-bar app color="primary">
      <v-toolbar-title>Shoreline Monitor Application</v-toolbar-title>
      <v-spacer />
      <v-btn
        href="https://shorelinemonitor.earth/"
        prepend-icon="mdi-open-in-new"
        target="_blank"
        variant="text"
      >
        Shoreline Monitor Website
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
<script setup>
  //
</script>
