<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const drawer = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const menuItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
  { title: 'All Tasks', icon: 'mdi-format-list-checks', to: '/tasks' },
  { title: 'My Tasks', icon: 'mdi-account-check', to: '/tasks?filter=my' },
  { title: 'Teams', icon: 'mdi-account-group', to: '/teams' },
];

const userMenuItems = [
  { title: 'Profile', icon: 'mdi-account', to: '/profile' },
  { title: 'Settings', icon: 'mdi-cog', to: '/settings' },
];
</script>

<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-list-item>
      <v-list-item-title class="text-h6">
        Task Management
      </v-list-item-title>
      <v-list-item-subtitle>
        Manage your tasks efficiently
      </v-list-item-subtitle>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        v-for="(item, i) in menuItems"
        :key="i"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        rounded="lg"
      ></v-list-item>
    </v-list>

    <template v-slot:append>
      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item
          v-for="(item, i) in userMenuItems"
          :key="i"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          rounded="lg"
        ></v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template> 