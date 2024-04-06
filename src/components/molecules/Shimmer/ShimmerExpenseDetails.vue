<script lang="ts" setup></script>

<template>
  <div class="shimmer-expense-details">
    <section class="shimmer-expense-details__content shimmer-expense-details__content--align-left">
      <LvSkeleton :width="322" :height="24" />
      <LvSkeleton :width="410" :height="18" />
    </section>

    <section class="shimmer-expense-details__content">
      <LvSkeleton :width="316" :height="24" />
      <LvSkeleton :width="437" :height="18" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
  .shimmer-expense-details {
    display: flex;
    width: 100%;
    justify-content: space-between;

    &__content {
      display: flex;
      gap: .5rem;
      justify-content: center;
      flex-direction: column;

      &--align-left {
        text-align: left;
      }
    }
  }
</style>