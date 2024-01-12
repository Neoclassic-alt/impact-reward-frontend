<script setup lang="ts">
import { ref } from 'vue'
import { vOnClickOutside } from '@vueuse/components'
import axios from 'axios'
import { useMutation } from '@tanstack/vue-query'
import AlertBlock from '@/components/AlertBlock.vue'
import { plural } from '@/functions'
import { useUserStore } from '@/stores'

const props = defineProps<{
  closeModal: () => void
  bonusGroupName?: string
  bonusGroupId?: number
}>()

const closeTimer = ref(6)
const { fetchUserAndSave } = useUserStore()

const {
  mutate: deleteBonusGroup,
  isError,
  isIdle,
  isPending,
  isSuccess,
} = useMutation({
  mutationFn: (bonus_group_id: number) =>
    axios.delete('/seller/deactivate_bonus_group', {
      data: { bonus_group_id },
    }),
  onSuccess: () => {
    closeTimer.value = 6
    fetchUserAndSave()

    const timerId = setInterval(() => {
      closeTimer.value -= 1
    }, 1000)

    setTimeout(() => {
      clearInterval(timerId)
      props.closeModal()
    }, 6000)
  },
})
</script>

<template>
  <div class="modal">
    <div v-on-click-outside="closeModal">
      <p class="bonus__title" v-if="!isSuccess">Удалить группу бонусов “{{ bonusGroupName }}”?</p>
      <AlertBlock type="success" style="width: calc(100% - 50px)" v-if="isSuccess"
        >Группа бонусов успешно удалена. Сообщение закроется через {{ closeTimer }}
        {{ plural(closeTimer, 'секунду', 'секунды', 'секунд') }}</AlertBlock
      >
      <AlertBlock type="error" style="width: calc(100% - 50px)" v-if="isError"
        >Ошибка при удалении группы бонусов. Попробуйте удалить заново</AlertBlock
      >
      <p style="margin-bottom: var(--base-margin)" v-if="!isSuccess">Данное действие необратимо.</p>
      <div class="modal-button-group">
        <button
          class="button delete-main-button"
          style="margin-right: 16px"
          @click="deleteBonusGroup(bonusGroupId!)"
          :disabled="isPending"
          v-if="!isSuccess"
        >
          <img
            src="./../../assets/icons/button-loading.svg"
            style="margin-right: 5px"
            v-show="isPending"
          />
          <span>{{ isIdle || isError ? 'Удалить' : '' }}{{ isPending ? 'Удаление…' : '' }}</span>
        </button>
        <a
          href="#"
          class="button"
          style="border-color: var(--brand-main-color)"
          @click.prevent="closeModal()"
          >{{ isIdle ? 'Отмена' : 'Закрыть' }}</a
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.delete-main-button {
  background-color: var(--danger-color);
  color: #ffffff;
  border: none;
  font-weight: 500;
  font-size: 15px;
  display: flex;
  align-items: center;
}
.delete-main-button:disabled {
  background-color: rgb(238, 108, 104);
}
</style>
