<template>
  <form class="form" @submit.prevent="handleSubmit()">
    <h1 class="form__title" v-if="title">{{ title }}</h1>
  
    <div class="form__row">
      <LvInput
        type="email"
        v-model="input.email"
        label="Enter your email"
        placeholder="E.g. john.doe@example.com"
        bottom-bar
        clearable 
      />
    </div>

    <div class="form__row">
      <LvInput
        type="password"
        v-model="input.password"
        label="Enter a password"
        placeholder="Enter your password"
        bottom-bar
        clearable 
      />
    </div>

    <div class="form__row form__row--flex">
      <BaseButton
        type="submit"
        class="lv-button--ml-10 lv-button--center-content"
        :style="{ 
          marginLeft: 'unset !important', 
          width: '100%'
        }"
        primary
        @click.stop
      >
        Log in
      </BaseButton>
    </div>

    <div class="form__row">
      <p class="form__navigation-link">
        Don't have an account? 
        <router-link :to="{ name: 'signup' }">Sign up here!</router-link>
      </p>
    </div>
  </form>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue'
import { reactive } from 'vue';
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router';

  defineProps({
    title: {
      type: String,
      default: null
    }
  })

  const initialValue = {
    email: null,
    password: null
  }

  const router = useRouter()

  const input = reactive({ ...initialValue })

  const handleSubmit = () => {
    const notValid = Object.values(input).some(i => !i)
    if ( notValid )
      return

    return useUserStore()
    .authUser(input)
    .then(() => router.replace({ name: 'expenses' }))
  }
</script>

<style scoped>

</style>