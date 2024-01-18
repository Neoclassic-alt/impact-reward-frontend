<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import AddBonusModal from '@/components/bonus/AddBonusModal.vue'
import DeleteBonusGroupModal from '@/components/bonus/DeleteBonusGroupModal.vue'
import AlertBlock from '@/components/AlertBlock.vue'
import { getRussianBonusType } from '@/constants/bonuses'

const { getBonusGroups: bonuses, bonusAvaliableCosts } = storeToRefs(useUserStore())

type modalInfo = {
  state: null | 'add' | 'delete'
  id: null | number
}

const bonusesFullShown: Set<number> = reactive(new Set())
const modal = ref<modalInfo>({ state: null, id: null })

function openModal(state: NonNullable<modalInfo['state']>, id: modalInfo['id']) {
  modal.value = { state, id }
}

function closeModal() {
  modal.value = { state: null, id: null }
}

const currentBonus = computed(() =>
  modal.value.id ? bonuses.value?.find((item) => item.id === modal.value.id) : null,
)
</script>

<template>
  <div class="bonus__add" v-if="bonusAvaliableCosts.length">
    <p style="margin-bottom: 10px">Добавить группу бонусов:</p>
    <menu class="bonus-add__button-group list-to-menu">
      <li
        class="bonus-add__button button"
        v-for="bonus in bonusAvaliableCosts"
        :key="bonus.group_name"
        @click="
          $router.push({
            name: 'AddBonusGroup',
            params: {
              group_name: bonus.group_name,
            },
          })
        "
      >
        {{ bonus.price }}
      </li>
    </menu>
  </div>
  <AlertBlock v-else type="warning">
    <template #title>Вы больше не можете создавать группы бонусов</template>
    <template #text
      >Все возможные группы бонусов заняты. После удаления группы бонусов вы можете создать новую с
      той же стоимостью.</template
    >
  </AlertBlock>
  <AlertBlock type="info" v-if="!bonuses?.length">
    Группы бонусов отсутствуют. Вы можете создать их с помощью кнопок выше.
  </AlertBlock>
  <AlertBlock
    type="success"
    style="margin-top: -12px"
    v-if="$route.query.message == 'bonus-group-added'"
    closable
    @close="() => $router.push({ query: {} })"
    >Группа бонусов успешно создана</AlertBlock
  >
  <div class="bonus-group">
    <div class="bonus" v-for="bonus in bonuses" :key="bonus.id">
      <p class="bonus__title">{{ bonus.name }}</p>
      <p class="bonus__description">
        {{ bonus.caption }}
        <a
          href="#"
          class="link"
          @click.prevent="bonusesFullShown.add(bonus.id)"
          v-if="!bonusesFullShown.has(bonus.id)"
          >Полное описание</a
        >
      </p>
      <template v-if="bonusesFullShown.has(bonus.id)">
        <div class="block-info__item">
          <span class="block-info__prop">Тип:&nbsp;</span>
          <span> {{ getRussianBonusType(bonus.name_variable_content) }}</span>
        </div>
        <div class="block-info__item">
          <span class="block-info__prop">Инструкция:&nbsp;</span>
          <span>{{ bonus.permanent_content }}</span>
        </div>
        <div class="block-info__item">
          <span class="block-info__prop">Осталось бонусов:&nbsp;</span>
          <span>{{ bonus.available_bonuses }}</span>
        </div>
        <a
          href="#"
          class="link"
          @click.prevent="bonusesFullShown.delete(bonus.id)"
          v-if="bonusesFullShown.has(bonus.id)"
          style="margin-bottom: 0.8em"
          >Свернуть</a
        >
      </template>
      <span class="bonus-cost">
        <span>{{ bonus.price }}&nbsp;</span>
      </span>
      <div>
        <a
          href="#"
          class="button action-button add-button"
          style="border-color: var(--success-color); margin-right: 16px"
          @click.prevent="openModal('add', bonus.id)"
          >Добавить</a
        >
        <a
          href="#"
          class="button action-button delete-button"
          style="border-color: var(--danger-color)"
          @click.prevent="openModal('delete', bonus.id)"
          >Удалить</a
        >
      </div>
    </div>
  </div>
  <teleport to="body">
    <add-bonus-modal
      v-if="modal.state == 'add'"
      :bonus-group-name="currentBonus?.name"
      :name-variable-content="currentBonus?.name_variable_content"
      :close-modal="closeModal"
      :bonus-group-id="currentBonus?.id"
    />
    <delete-bonus-group-modal
      v-if="modal.state == 'delete'"
      :close-modal="closeModal"
      :bonus-group-name="currentBonus?.name"
      :bonus-group-id="currentBonus?.id"
    />
  </teleport>
</template>

<style>
.bonus__add {
  display: flex;
  align-items: center;
  margin-bottom: var(--base-margin);
}
.bonus-add__button-group {
  display: flex;
  margin-block-start: 0;
  margin-block-end: 0;
  gap: 20px;
  margin-left: 20px;
}

.bonus-add__button {
  border: 1px var(--brand-main-color) solid;
  cursor: pointer;
}
.bonus__title {
  font-size: 1.25em;
  font-weight: 500;
  margin-bottom: var(--base-margin);
}
.bonus__title {
  font-size: 1.25em;
  font-weight: 500;
  margin-bottom: var(--base-margin);
}

.bonus__description {
  margin-bottom: 1em;
}

.bonus-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--base-margin);
  margin-bottom: var(--base-margin);
}

.bonus {
  border: 1px var(--brand-main-color) solid;
  padding: var(--base-margin);
  display: flex;
  flex-direction: column;
  width: calc(50% - 13px);
  box-sizing: border-box;
}

.action-button {
  font-size: 0.9em;
  padding: 10px 16px;
  color: #000000;
}

.delete-button:hover {
  background-color: rgb(242, 78, 30, 0.15);
  transition: background-color 0.1s linear;
}

.add-button:hover {
  background-color: rgb(58, 214, 64, 0.15);
  transition: background-color 0.1s linear;
}

.bonus-add__button:hover {
  background-color: rgb(103, 210, 233, 0.15);
  transition: background-color 0.1s linear;
}

.bonus__add_mobile {
  display: none;
}

.bonus__add_mobile-button {
  padding: 12px 20px;
  border: 1px var(--brand-main-color) solid;
  border-radius: 10px;
  margin-bottom: calc(var(--base-margin) / 2);
  width: fit-content;
}

@media screen and (max-width: 768px) {
  
  .bonus-group {
    flex-direction: column;
  }
  .bonus {
    width: auto;
  }
}

@media screen and (max-width: 576px) {
  .bonus__add {
    flex-direction: column;
    align-items: flex-start;
  }
  .bonus-add__button-group {
    margin-left: 0;
    gap: 15px;
  }
  .bonus-add__button.button {
    padding: 10px 16px;
    font-size: 0.9em;
  }
}

@media screen and (max-width: 450px) {
  .bonus-shop__tabs {
    width: 100vw;
    margin-left: -25px;
    font-size: 0.93em;
  }
}
</style>
