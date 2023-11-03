<template>
  <div class="app-menu" :class="modifiedClass" v-if="isLoggedIn()">
    <BaseButton
      icon="info-circle"
      class="app-menu__info-btn"
      transparent
      @click.stop="displayAppInformation()"
    />

    <BaseButton
      icon="x"
      transparent
      class="app-menu__close-btn lv-button--icon-large"
      @click="useAppMenu().setMenuVisibility(false)"
    />

    <main class="app-menu__content">
      <header>
        <h1 class="app-menu__headline">Menu</h1>
      </header>

      <BaseButton 
        class="app-menu__logout-btn lv-button--center-content"
        icon="logout"
        primary
        @click="logout()"
      >
        Log out
      </BaseButton>
    </main>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue';
import { useAppMenu } from '@/stores/menu';
import { useUserStore } from '@/stores/user'
import { computed } from 'vue';
import { isLoggedIn } from '@/utils/isLoggedIn';
import { useAppStore } from '@/stores/app'

const modifiedClass = computed(() => useAppMenu().isVisible && 'app-menu--visible')
const logout = () => useUserStore().clearUser()

const displayAppInformation = () => {
  useAppStore().displayAppInformation()
}

</script>

<style lang="scss" scoped>
  .app-menu {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    background-color: #fff;
    opacity: 0;
    visibility: hidden;
    transform: scale(0);
    transform-origin: center;
    transition: opacity .25s, visibility .25s, transform .25s ease;

    &__info-btn {
      position: absolute;
      left: 1rem;
      top: 1rem;
      padding: 0 !important;
    }

    &__close-btn {
      position: absolute;
      right: 1rem;
      top: 1rem;
      padding: 0 !important;
    }

    &__headline {
      position: absolute;
      top: 2rem;
      left: 50%;
      font-size: 3rem;
      transform: translateX(-50%);
    }

    &__content {
      margin: auto;
      width: 100%;
      padding: 0 1rem;
      max-width: 300px;
      text-align: center;
    }

    &__logout-btn {
      width: 100% !important;
    }

    &--visible {
      opacity: 1;
      visibility: visible;
      transform: scale(1);
    }
  }
</style>