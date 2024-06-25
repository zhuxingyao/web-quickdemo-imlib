<script setup lang="ts">
import Login from './components/Login.vue'
import Chat from './components/Chat.vue'
import { curUserId } from './assets/context';
</script>

<template>
  <div class="rong-container">
    <Login v-if="!curUserId"></Login>
    <Chat v-else></Chat>
  </div>
</template>

<style scoped>
.rong-container {
  width: 100%;
  height: 100%;
  background: #333;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
