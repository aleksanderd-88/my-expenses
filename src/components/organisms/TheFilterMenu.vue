<template>
  <div class="filter-menu" :class="modifiedClass" ref="menu">
    <BaseButton
      icon="x"
      transparent
      class="filter-menu__close-btn lv-button--icon-large"
      @click.stop="closeFilterMenu()"
    />
        
    <h1 class="filter-menu__headline">Filter views</h1>

    <ul class="filter-menu__list">
      <li class="filter-menu__item" v-for="item in items" :key="item.label">
        <BaseButton
          :icon="item.icon"
          icon-left
          transparent
          class="filter-menu__filter-btn"
        >
          {{ item.label }}
        </BaseButton>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue';
import { computed, reactive, ref } from 'vue'
import { useAppMenu } from '@/stores/menu'
import { onClickOutside } from '@vueuse/core'

const menu = ref()

const items = reactive([
  { label: 'Category view', icon: 'layout-list', mode: 'category' },
  { label: 'List view', icon: 'list', mode: 'list' },
  { label: 'Paid expenses view', icon: 'list-check', mode: 'paid' },
])

const modifiedClass = computed(() => useAppMenu().filterMenuIsVisible && 'filter-menu--visible')

onClickOutside(menu, () => useAppMenu().setFilterMenuVisibility(false))
const closeFilterMenu = () => useAppMenu().setFilterMenuVisibility(false)

</script>

<style lang="scss" scoped>
  .filter-menu {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    max-width: 300px;
    z-index: 2;
    padding: 2rem 1rem;
    visibility: hidden;
    transform: translateX(-100%);
    background-color: $white;
    box-shadow: 3px 0px 15px -2px rgba(0,0,0,0.1);
    transition: transform .25s, visibility .25s ease;

    &__close-btn {
      position: absolute;
      top: 0;
      right: 0;
    }

    &__headline {
      font-size: 1.25rem;
    }

    &__list {
      margin-top: 2rem;
    }

    &__item {
      margin-bottom: 1rem;
    }

    &__filter-btn {
      width: 100% !important;
    }

    &--visible {
      visibility: visible;
      transform: translateX(0);
    }
  }
</style>