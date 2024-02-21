<template>
  <div class="loading-screen">
    <img src="../../assets/icons/loading.svg" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.loading-screen {
  position: fixed;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 9999;
}
</style>
