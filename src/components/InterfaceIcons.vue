<script setup lang="ts">
// Navigation Menu
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline.vue'
import StoreIcon from 'vue-material-design-icons/Store.vue'
import ChartBarIcon from 'vue-material-design-icons/ChartBar.vue'
import TrophyAwardIcon from 'vue-material-design-icons/TrophyAward.vue'
import LogoutIcon from 'vue-material-design-icons/Logout.vue'

// Rating
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue'
import EyeOffIcon from 'vue-material-design-icons/EyeOff.vue'

defineProps<{
  name: string
}>()
</script>

<template>
  <component :is="name" />
</template>