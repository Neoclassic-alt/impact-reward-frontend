<script setup lang="ts">
import { ref } from 'vue'

const communityLink = ref('nobordersplz')
const ticker = ref('STAR')
</script>

<template>
  <main class="main">
    <h2 class="page-header">Сообщество “{{ 'Маркетинг без границ' }}”</h2>
    <section class="block-info">
      <p class="block-info__title_1">Профиль</p>
      <p class="block-info__item">
        <span class="block-info__prop" style="margin-right: 39px">Импакт-аккаунт</span>
        <span>{{ 'nobordersplz' }}</span>
      </p>
      <p class="block-info__item">
        <span class="block-info__prop" style="margin-right: 109px">Адрес</span>
        <a :href="'http://t.me/' + communityLink" class="link">{{ communityLink }}</a>
      </p>
      <div class="block-info__item" style="display: flex">
        <span class="block-info__prop" style="margin-right: 82px">Описание</span>
        <span
          >Консультации и полезные материалы от гуру международного маркетинга Татьяны
          Петровой</span
        >
      </div>
    </section>
    <div class="blocks-group">
      <section class="block-info">
        <p class="block-info__title_1">Монетный двор</p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Монетные прессы</span>
          <span>{{ 20 }}</span>
        </p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Монета</span>
          <span>{{ 'Звезда маркетинга' }}</span>
        </p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Тикер</span>
          <span>{{ ticker }}</span>
        </p>
      </section>
      <section class="block-info">
        <p class="block-info__title_1">Касса</p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Осталось наград</span>
          <span>{{ 25 }}</span>
        </p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Размер награды</span>
          <span>{{ 15 }} {{ ticker }}</span>
        </p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Темп пополнения</span>
          <span>{{ 2.4 }} награды в час</span>
        </p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.blocks-group {
  display: flex;
  gap: 30px;
}
.block-info {
  flex: 1;
}
.block-info__prop {
  display: inline-block;
}
.block-info__item_justify {
  display: flex;
  justify-content: space-between;
}

/*@media screen and (max-width: 1024px) {
  .blocks-group {
    display: block;
  }
}*/
</style>
