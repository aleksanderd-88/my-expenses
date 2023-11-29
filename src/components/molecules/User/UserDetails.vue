<template>
  <div class="user-details">
    <h1 class="user-details__initials d-flex justify-center align-center">
      {{ initials }}
    </h1>
    <p class="user-details__fullname">
      Logged in as
      <span>{{ userFullName }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { computed } from 'vue'

const initials = computed(() => {
  const splittedName = useUserStore().currentUser?.name?.split(' ') || ''
  return `${ splittedName[0].charAt(0) + splittedName[1].charAt(0) }`
})

const userFullName = computed(() => useUserStore().currentUser?.name)
</script>

<style lang="scss" scoped>
  .user-details {
    gap: .5rem;
    display: flex;
    align-items: center;

    &__initials {
      font-size: 1.25rem;
      border-radius: 50%;
      width: 45px;
      height: 45px;
      border: 1px solid $dark;
    }

    &__fullname {
      font-size: .9rem;
      display: flex;
      font-size: .8rem;
      flex-direction: column;
      gap: .25rem;

      span {
        font-size: .7rem;
        font-weight: 700;
      }
    }
  }
</style>