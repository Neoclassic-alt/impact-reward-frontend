<script setup lang="ts">
import { computed } from 'vue'
import { vOnClickOutside } from '@vueuse/components'
import { separators } from '@/constants/data-tables'
import VueMultiselect from 'vue-multiselect'

type typeOfTable = { tab: string; label: string }

defineProps<{
  closeModal: () => void
  onClick: () => void
  types: ReadonlyArray<typeOfTable>
}>()

const model = defineModel<{
  types: {
    [key: string]: boolean
  }
  separator: { symbol: string; label: string }
}>({ required: true })

const disable = computed(() => !Object.values(model.value.types).some((el: Boolean) => el))
</script>

<template>
  <div class="modal">
    <div v-on-click-outside="closeModal">
      <h2 class="bonus__title">Скачать в формате <em>csv</em></h2>
      <form style="width: 100%">
        <ul class="list-to-menu">
          <li v-for="ratingType in types" :key="ratingType.tab">
            <input
              type="checkbox"
              :id="`checkbox-${ratingType.tab}`"
              v-model="model.types[ratingType.tab]"
              class="custom-checkbox"
            />
            <label :for="`checkbox-${ratingType.tab}`">{{ ratingType.label }}</label>
          </li>
          <li style="margin-top: 0.5em" v-show="disable">
            <slot>
              <em
                >Вы должны выбрать хотя бы один<br />
                тип рейтинга</em
              >
            </slot>
          </li>
        </ul>
        <p style="margin-block-end: 0.5em">Разделитель</p>
        <VueMultiselect
          v-model="model.separator"
          :options="separators"
          selectLabel=""
          deselectLabel=""
          selectedLabel=""
          :searchable="false"
          label="label"
          track-by="symbol"
          placeholder="Разделитель"
          :allow-empty="false"
          class="multiselect-width"
          style="margin-bottom: 20px"
        />
        <div class="modal-button-group">
          <button
            class="button main-button"
            style="border-color: transparent; margin-right: 16px"
            :disabled="disable"
            @click.prevent="
              () => {
                onClick()
                closeModal()
              }
            "
          >
            <span>Скачать</span>
          </button>
          <a
            href="#"
            class="button"
            style="border-color: var(--brand-main-color)"
            @click.prevent="closeModal"
            >Отмена</a
          >
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.bonus__title {
  margin-bottom: 0;
}
</style>
