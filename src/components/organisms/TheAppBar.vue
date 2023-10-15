<template>
  <header>
    <nav class="app-bar">
      <main class="app-bar__content">
        <div class="app-bar__actions">
          <BaseButton
            icon="menu"
            transparent
          >
          </BaseButton>
        </div>
      </main>
    </nav>
  </header>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router';

const router = useRouter()

const logout = () => {
  useUserStore().clearUser()
  router.replace({ name: 'login' })
}
</script>

<style lang="scss" scoped>
  .app-bar {
    box-shadow: 0px 7px 12px -5px rgba($dark, .1);

    &__content {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 1rem;
      max-width: 1600px;
      margin: auto;
    }

    &__actions {
      margin-left: auto;
    }
  }
</style>