<script setup lang="ts">
import { ref } from 'vue'

const communityLink = ref("abcsjffe")
</script>

<template>
  <main class="main">
    <h2 class="page-header">Сообщество “{{ 'Lorem ipsum' }}”</h2>
    
    <section class="block-info">
      <p class="block-info__title_1">Telegram-канал</p>
      <p class="block-info__item">
        <span class="block-info__prop" style="margin-right: 62px;">Адрес</span>
        <a :href="'http://t.me/' + communityLink" class="link">@{{communityLink}}</a>
      </p>
      <p class="block-info__item">
        <span class="block-info__prop" style="margin-right: 39px;">Владелец</span>
        <span>{{'Ivan Ivanov'}}</span>
      </p>
      <div class="block-info__item">
        <span class="block-info__prop">Описание</span>
        <p>Lorem ipsum dolor sit amet consectetur. In massa eget facilisi amet vitae duis ornare ac. Non turpis pellentesque molestie bibendum in viverra mi mauris. Semper massa hac pellentesque elementum</p>
      </div>
    </section>
    <div class="blocks-group">
      <section class="block-info" style="margin-right: 30px">
        <p class="block-info__title_1">Монетный двор</p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Монетные прессы</span>
          <span>{{101}}</span>
        </p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Монета</span>
          <span>{{'abcsjffe'}}</span>
        </p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Тикер</span>
          <span>{{"TEST"}}</span>
        </p>
      </section>
      <section class="block-info">
        <p class="block-info__title_1">Касса</p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Осталось монет</span>
          <span>{{ 300 }}</span>
        </p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Размер награды</span>
          <span>{{ 15 }}</span>
        </p>
        <p class="block-info__item block-info__item_justify">
          <span class="block-info__prop">Темп пополнения</span>
          <span>{{ "2,3 мон в час" }}</span>
        </p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.blocks-group {
  display: flex;
}

.block-info {
  flex: 1;
}

.block-info__item_justify {
  display: flex;
  justify-content: space-between;
}

</style>