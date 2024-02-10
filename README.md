# Impact Reward Frontend

## Общая информация о проекте

Фронтенд сайта управления *импакт-аккаунтом* [системы Impact](https://impact-reward.com/).

### Функционал

* Просмотр общей информации об аккаунте (Профиль, Монетный двор, Касса)
* Работа с бонусами
  * Просмотр информации о группах бонусов
  * Добавление групп бонусов
  * Удаление групп бонусов
  * Добавление бонусов в группу
* Просмотр рейтинга участников сообщества
  * Просмотр рейтинга по монетам и наградам
  * Поиск участников
  * Изменение видимости отдельных колонок
  * Сортировка колонок
  * Рейтинг составляется за 7 дней, 30 дней, текущий месяц и неделю

### Скриншоты системы
***Кликните, чтобы увидеть полноразмерный скриншот***

<div>
 <img src="https://github.com/Neoclassic-alt/impact-reward-frontend/blob/main/screenshots/impact-reward1.png" width="54.5%" />
 <img src="https://github.com/Neoclassic-alt/impact-reward-frontend/blob/main/screenshots/impact-reward2.png" width="44%"/>
 <img src="https://github.com/Neoclassic-alt/impact-reward-frontend/blob/main/screenshots/impact-reward3.png" width="49%"/>
 <img src="https://github.com/Neoclassic-alt/impact-reward-frontend/blob/main/screenshots/impact-reward4.png" width="49%"/>
</div>

### Используемые технологии

`Vue 3` (Composition API), `Vite`, `Vue Router`, `pinia`, `Vitest`, `TypeScript`, `axios`, `TanStack Query`, `eslint`, `prettier`

### Используемые библиотеки

- `vee-validate` (https://vee-validate.logaretm.com/v4)
- `vue-multiselect` (https://vue-multiselect.js.org)
- `vue3-easy-data-table` (https://hc200ok.github.io/vue3-easy-data-table-doc/)

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
