<script setup lang="ts">
import { ref } from 'vue'
import CloseIcon from 'vue-material-design-icons/Close.vue'

const closed = ref(false)

withDefaults(
  defineProps<{
    type?: 'error' | 'warning' | 'success' | 'info'
    closable?: boolean
    onClose?: () => void
  }>(),
  {
    type: 'info',
    closable: false,
  },
)

defineSlots<{
  title: string
  text: any
  default: any
}>()
</script>

<template>
  <div class="alert" :class="`alert-${type}`" v-if="!closed">
    <div class="alert__main">
      <img src="../../assets/icons/alert/error.svg" alt="Error icon" v-if="type == 'error'" />
      <img
        src="../../assets/icons/alert/warning.png"
        alt="Warning icon"
        v-if="type == 'warning'"
        width="32"
      />
      <img src="../../assets/icons/alert/success.svg" alt="Success icon" v-if="type == 'success'" />
      <img src="../../assets/icons/alert/info.svg" alt="Info icon" v-if="type == 'info'" />
      <div>
        <h3 style="margin-bottom: 5px" v-if="$slots.title"><slot name="title"></slot></h3>
        <p>
          <slot name="text"><slot></slot></slot>
        </p>
      </div>
    </div>
    <a href="#" @click="(closed = true), onClose?.()" v-if="closable">
      <CloseIcon />
    </a>
  </div>
</template>

<style scoped>
.alert {
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 1em;
  justify-content: space-between;
}

.alert__main {
  display: flex;
  align-items: center;
  gap: 15px;
}
.alert-error {
  border: 1px var(--danger-color) solid;
  background-color: rgb(241, 34, 27, 0.2);
}

.alert-warning {
  border: 1px rgba(241, 209, 28) solid;
  background-color: rgba(241, 209, 28, 0.2);
}

.alert-success {
  border: 1px rgb(58, 214, 64) solid;
  background-color: rgba(58, 214, 64, 0.2);
}

.alert-info {
  border: 1px rgb(40, 148, 221) solid;
  background-color: rgba(40, 148, 221, 0.2);
}
</style>
