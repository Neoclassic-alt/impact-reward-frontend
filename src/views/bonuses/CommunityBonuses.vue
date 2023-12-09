<script setup lang="ts">
import { useBonusAvailableStore } from '@/stores/bonuses'
import { storeToRefs } from 'pinia'
import { onMounted, reactive } from 'vue'
import type { bonus } from '@/types/bonuses'

const bonusAvailableStore = useBonusAvailableStore()
const { bonusAvaliableCosts } = storeToRefs(bonusAvailableStore)
const { setAvaliableCosts } = bonusAvailableStore

/* затем, разумеется, будет заменено данными с API */
onMounted(() => {
  setAvaliableCosts([20, 50, 100, 200, 500])
})

const bonuses = reactive<bonus[]>([
  {
    id: '1111',
    cost: 20,
    title: 'Хорошее название бонуса',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam, est.',
    instruction: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam, est.',
    type: 'promocode',
  },
  {
    id: '1122',
    cost: 50,
    title: 'Название бонуса 2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam, est.',
    instruction: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam, est.',
    type: 'link',
  },
  {
    id: '1133',
    cost: 100,
    title: 'Название бонуса 2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam, est.',
    instruction: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam, est.',
    type: 'link',
  },
])

const bonusesFullShown: Set<string | number> = reactive(new Set())
</script>

<template>
  <div class="bonus__add" v-if="bonusAvaliableCosts.size">
    <p>Добавить группу бонусов:</p>
    <menu class="bonus-add__button-group list-to-menu">
      <li class="bonus-add__button" v-for="cost in bonusAvaliableCosts" :key="cost">{{ cost }}</li>
    </menu>
  </div>
  <div class="bonus-group">
    <div class="bonus" v-for="bonus in bonuses" :key="bonus.id">
      <p class="bonus__title">{{ bonus.title }}</p>
      <p class="bonus__description">{{ bonus.description }}</p>
      <a
        href="#"
        class="link"
        @click.prevent="bonusesFullShown.add(bonus.id)"
        v-if="!bonusesFullShown.has(bonus.id)"
        >Полное описание</a
      >
      <template v-if="bonusesFullShown.has(bonus.id)">
        <div class="block-info__item">
          <span class="block-info__prop" style="margin-right: 25px">Инструкция</span>
          <span>{{ bonus.instruction }}</span>
        </div>
        <div class="block-info__item">
          <span class="block-info__prop">Осталось бонусов&nbsp;</span>
          <span>{{ 22 }}</span>
        </div>
      </template>
      <div class="bonus__actions-buttons">
        <!-- TODO -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.bonus__add {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}
.bonus-add__button-group {
  display: flex;
  margin-block-start: 0;
  margin-block-end: 0;
}

.bonus-add__button {
  border: 1px var(--brand-main-color) solid;
  border-radius: 10px;
  padding: 12px 20px;
  margin-left: 20px;
  cursor: pointer;
}
.bonus__title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 25px;
}

.bonus__description {
  margin-bottom: 1em;
}

.bonus-group {
  display: flex;
  flex-wrap: wrap;
}
.bonus {
  border: 1px var(--brand-main-color) solid;
  padding: 25px;
  display: flex;
  flex-direction: column;
  width: calc(50% - 13px);
  box-sizing: border-box;
  margin-bottom: 25px;
}

.bonus:nth-child(2n + 1) {
  margin-right: 26px;
}
</style>
