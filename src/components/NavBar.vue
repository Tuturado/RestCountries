<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps(['toHome']);

</script>

<template>
  <v-toolbar class="nav-bar">
    <router-link :to="{ name: 'home' }">
      <img src="../assets/LogoMova.png" width="200" style="padding: 30%;">
    </router-link>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn @click="toHome">Voltar</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<style scoped>
.nav-bar {
  background-color: white;
  border-bottom: 2px solid black;
}

#botao-voltar {
  padding: 50;
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: end;
}
</style>
