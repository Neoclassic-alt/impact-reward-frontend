# Impact Reward Frontend

## Общая информация о проекте

Фронтенд сайта управления *импакт-аккаунтом* [системы Impact](https://impact-reward.com/). Магазин бонусов расположен по адресу https://market.impact-reard.com

### Функционал

* Просмотр общей информации об аккаунте (Профиль, Монетный двор, Касса)
* Работа с бонусами
  * Просмотр информации о группах бонусов
  * Добавление групп бонусов
  * Удаление групп бонусов
  * Добавление бонусов в группу
  * *Золотые бонусы (планируется)*
* Рейтинг участников сообщества
  * Просмотр рейтинга по монетам, наградам и бонусам
  * Поиск участников
  * Изменение видимости отдельных колонок
  * Сортировка данных по колонкам
  * Рейтинг составляется за 7 дней, 30 дней, текущий месяц и неделю
  * *Скачивание таблицы в формате csv (планируется)*
* Статистика сообщества
  * Статистика составляется по монетам, наградам и участникам
  * Выбор вида: таблица, диаграмма, диаграмма + таблица (по умолчанию последнее)
  * Выбор отображаемых диаграмм по нажатию на легенду
  * Просмотр статистики по дням, неделям и месяцам
  * Выбор статистики за последние: 7 дней, 30 дней, 3 месяца, 12 месяцев. Также можно выбрать собственный интервал.
    * Пока что только для статистики по дням
  * Сортировка данных в таблице
  * Скачивание диаграммы в формате png
  * *Скачивание таблицы в формате csv (планируется)*
 
Все страницы адаптированы под мобильные устройства.

### Скриншоты системы
***Кликните, чтобы увидеть полноразмерный скриншот***

<div>
 <img src="https://github.com/Neoclassic-alt/impact-reward-frontend/blob/main/screenshots/impact-reward1.png" width="54.5%" />
 <img src="https://github.com/Neoclassic-alt/impact-reward-frontend/blob/main/screenshots/impact-reward2.png" width="44%"/>
 <img src="https://github.com/Neoclassic-alt/impact-reward-frontend/blob/main/screenshots/impact-reward3.png" width="49%"/>
 <img src="https://github.com/Neoclassic-alt/impact-reward-frontend/blob/main/screenshots/impact-reward4.png" width="49%"/>
</div>

Больше скриншотов: https://drive.google.com/drive/folders/1QhxL6V2BPtsOjRS-DaSaneO0uEBavvct

### Используемые технологии

`Vue 3` (Composition API), `Vite`, `Vue Router`, `pinia`, `Vitest`, `TypeScript`, `eslint`, `prettier`

### Используемые библиотеки

`axios`, [`VueUse`](https://vueuse.org), [`TanStack Query`](https://tanstack.com/query/latest/docs/framework/vue/overview), [`vee-validate`](https://vee-validate.logaretm.com/v4), [`vue-multiselect`](https://vue-multiselect.js.org), [`vue3-easy-data-table`](https://hc200ok.github.io/vue3-easy-data-table-doc/), [`chart.js`](https://www.chartjs.org), [`VCalendar`](https://vcalendar.io)

## Дефолтная информация для запуска проекта

This template should help get you started developing with Vue 3 in Vite.

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

### Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

### Project Setup

```sh
npm install
```

#### Compile and Hot-Reload for Development

```sh
npm run dev
```

#### Type-Check, Compile and Minify for Production

```sh
npm run build
```

#### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

#### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
