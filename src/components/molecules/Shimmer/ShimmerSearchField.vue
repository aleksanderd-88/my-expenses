<template>
  <div class="shimmer-search-field">
    <LvSkeleton :width="200" :height="19" />
    <LvSkeleton :width="400" :height="39" />
  </div>
</template>

<style lang="scss" scoped>
  .shimmer-search-field {
    display: flex;
    gap: .5rem;
    flex-direction: column;
  }
</style>