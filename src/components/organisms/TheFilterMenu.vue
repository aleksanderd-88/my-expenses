<template>
  <AppOverlay :is-visible="useAppMenu().filterMenuIsVisible">
    <div class="filter-menu" :class="modifiedClass" ref="menu">
      <BaseButton
        icon="x"
        transparent
        class="filter-menu__close-btn lv-button--icon-large"
        @click.stop="closeFilterMenu()"
      />
          
      <h1 class="filter-menu__headline">Filter expenses</h1>
  
      <ul class="filter-menu__list">
        <li class="filter-menu__item" v-for="item in items" :key="item.label">
          <BaseButton
            :icon="item.icon"
            icon-left
            transparent
            class="filter-menu__filter-btn"
            :class="{ 'filter-menu__filter-btn--active': active(item.mode) }"
            @click.stop="useTableStore().setLayoutMode(item.mode)"
          >
            {{ item.label }}
          </BaseButton>
        </li>
      </ul>
    </div>
  </AppOverlay>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue';
import { computed, reactive, ref, watch } from 'vue'
import { useAppMenu } from '@/stores/menu'
import { onClickOutside } from '@vueuse/core'
import AppOverlay from './AppOverlay.vue';
import { useTableStore, type ModeTypes } from '@/stores/table'

type ItemPropType = {
  label: string
  icon: string
  mode: ModeTypes
}

const menu = ref()

//- Close filter menu everytime mode changes
watch(() => useTableStore().mode, (val) => {
  if ( val )
    useAppMenu().setFilterMenuVisibility(false)
})

const items: ItemPropType[] = reactive([
  { label: 'All expenses', icon: 'list', mode: 'list' },
  { label: 'Category view', icon: 'layout-list', mode: 'category' },
  { label: 'Paid expenses', icon: 'list-check', mode: 'paid' },
  { label: 'Unpaid expenses', icon: 'clipboard-x', mode: 'unpaid' }
])

const modifiedClass = computed(() => useAppMenu().filterMenuIsVisible && 'filter-menu--visible')
const active = (mode: string) => useTableStore().mode === mode

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
    z-index: 3;
    padding: 2rem 1rem;
    visibility: hidden;
    transform: translateX(-100%);
    background-color: $white;
    box-shadow: 3px 0px 15px -2px rgba(0,0,0,0.1);
    transition: visibility .25s, transform .25s ease;

    &__close-btn {
      position: absolute;
      top: 0;
      right: 0;
    }

    &__headline {
      font-size: 1.25rem;
      font-weight: 500;
    }

    &__list {
      margin-top: 2rem;
    }

    &__item {
      margin-bottom: 1rem;
    }

    &__filter-btn {
      width: 100% !important;

      &--active {
        background-color: #eee !important;
        font-weight: 500 !important;
      }
    }

    &--visible {
      visibility: visible;
      transform: translateX(0);
    }
  }
</style>