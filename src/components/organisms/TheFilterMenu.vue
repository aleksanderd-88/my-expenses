<template>
  <AppOverlay :is-visible="useAppMenu().filterMenuIsVisible">
    <div class="filter-menu" :class="modifiedClass" ref="menu">
      <BaseButton
        icon="x"
        transparent
        class="filter-menu__close-btn lv-button--icon-large"
        @click.stop="closeFilterMenu()"
      />
          
      <h1 class="filter-menu__headline">Choose preset</h1>
  
      <ul class="filter-menu__list">
        <li 
          class="filter-menu__item mt-2"
          v-for="item in filteredItems" 
          :key="item.title"
        >
          <h2 class="filter-menu__preset-title">
            {{ item.title }}
          </h2>

          <BaseButton
            v-for="button in item.buttons" :key="button.label"
            :icon="button.icon"
            icon-left
            transparent
            class="filter-menu__filter-btn"
            :class="{ 'filter-menu__filter-btn--active': active(button.mode) }"
            @click.stop="useTableStore().setLayoutMode(button.mode)"
          >
            {{ button.label }}
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

type PresetTitlePropType = {
  title: string
  modes: string[],
  buttons?: ItemPropType[]
}

const menu = ref()

//- Close filter menu everytime mode changes
watch(() => useTableStore().mode, (val) => {
  if ( val )
    useAppMenu().setFilterMenuVisibility(false)
})

const items: ItemPropType[] = reactive([
  { label: 'Expenses', icon: 'list', mode: 'list' },
  { label: 'Categories', icon: 'layout-list', mode: 'category' },
  { label: 'Paid', icon: 'list-check', mode: 'paid' },
  { label: 'Unpaid', icon: 'clipboard-x', mode: 'unpaid' }
])

const presetTitles: PresetTitlePropType[] = reactive([
  { title: 'List', modes: ['list', 'category'] },
  { title: 'Status', modes: ['paid', 'unpaid'] },
])

const filteredItems = computed(() => presetTitles.map((p: PresetTitlePropType) => {
  return {
    ...p,
    buttons: items.filter(i => p.modes.includes(i.mode))
  }
}))
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
      margin-top: 4rem;
    }

    &__item {
      margin-bottom: 1rem;
    }

    &__preset-title {
      font-size: 1.1rem;
      padding-bottom: .5rem;
      border-bottom: 1px solid rgba(#000, .1);
    }

    &__filter-btn {
      margin: .5rem 0;
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