<template>
  <div class="single-page-layout">
    <main class="single-page-layout__content">
      <div class="single-page-layout__text-content">
        <img src="/app_icon_128x128px.png" alt="Application icon" />
        <h1 class="single-page-layout__title">MyExpenses</h1>
      </div>
      
      <SignupForm title="Sign up to continue" />
    </main>
  </div>
</template>

<script setup lang="ts">
import SignupForm from '@/components/molecules/Forms/SignupForm.vue'
</script>

<style scoped>

</style>