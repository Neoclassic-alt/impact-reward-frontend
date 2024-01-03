<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'error' | 'warning' | 'success'
  }>(),
  {
    type: 'error',
  },
)

defineSlots<{
  title: string
  text: any
  default: any
}>()
</script>

<template>
  <div class="alert" :class="`alert-${type}`">
    <img src="../assets/icons/alert/error.svg" alt="error icon" v-if="type == 'error'" />
    <img src="../assets/icons/alert/warning.png" alt="warning icon" v-if="type == 'warning'" />
    <img src="../assets/icons/alert/success.svg" alt="success icon" v-if="type == 'success'" />
    <div>
      <h3 style="margin-bottom: 5px" v-if="$slots.title"><slot name="title"></slot></h3>
      <p>
        <slot name="text"><slot></slot></slot>
      </p>
    </div>
  </div>
</template>

<style scoped>
.alert {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  margin-bottom: 1em;
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
</style>
