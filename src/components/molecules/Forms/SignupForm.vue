<template>
  <form class="form" @submit.prevent="handleSubmit()">
    <h1 class="form__title" v-if="title">{{ title }}</h1>

    <div class="form__row">
      <LvInput
        type="text"
        v-model="input.name"
        label="Enter your full name"
        placeholder="E.g. John Doe"
        bottom-bar
        clearable 
      />
    </div>

    <div class="form__row">
      <LvInput
        type="text"
        v-model="input.email"
        label="Enter your email"
        placeholder="E.g. john.doe@example.com"
        bottom-bar
        clearable 
      />
    </div>

    <div class="form__row">
      <LvInput
        type="text"
        v-model="input.password"
        label="Enter a password"
        placeholder="Choose a strong password"
        bottom-bar
        clearable 
      />
    </div>

    <div class="form__row">
      <LvInput
        type="text"
        v-model="input.verifiedPassword"
        label="Confirm password"
        placeholder="Verify password"
        bottom-bar
        clearable 
      />
    </div>

    <div class="form__row form__row--flex">
      <BaseButton 
        class="lv-button--ml-10 lv-button--center-content"
        :style="{ 
          marginLeft: 'unset !important', 
          width: '100%'
        }"
        primary
        @click.stop
      >
        Sign up
      </BaseButton>
    </div>

    <div class="form__row">
      <p class="form__navigation-link">
        Already have an account? 
        <router-link :to="{ name: 'login' }">Log in here!</router-link>
      </p>
    </div>
  </form>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue';
import { reactive } from 'vue';

  defineProps({
    title: {
      type: String,
      default: null
    }
  })

  const initialValue = {
    name: null,
    email: null,
    password: null,
    verifiedPassword: null
  }

  const input = reactive({ ...initialValue })

  const handleSubmit = () => {
    const notValid = Object.values(input).some(i => !i)
    if ( notValid )
      return

    console.log(input);
  }
</script>

<style scoped>

</style>