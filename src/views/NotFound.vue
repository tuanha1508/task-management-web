<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <h1 class="text-h1 font-weight-bold mb-4">404</h1>
        <h2 class="text-h4 mb-6">Page Not Found</h2>
        <p class="text-body-1 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <v-btn
          color="primary"
          class="mr-4"
          @click="goHome"
        >
          Go to Home
        </v-btn>
        
        <v-btn
          variant="outlined"
          @click="goBack"
        >
          Go Back
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template> 