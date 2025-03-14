<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <v-footer app color="primary" class="text-center">
    <v-row no-gutters justify="center">
      <v-col cols="12" class="text-center text-white py-2">
        Task Management System &copy; {{ currentYear }}
      </v-col>
    </v-row>
  </v-footer>
</template> 