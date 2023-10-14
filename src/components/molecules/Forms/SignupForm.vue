<template>
  <form class="form" @submit.prevent="handleSubmit()">
    <h1 class="form__title" v-if="title">{{ title }}</h1>

    <div class="form__row">
      <LvInput
        type="text"
        v-model="input.name"
        label="Your full name"
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
        label="Please confirm password"
        placeholder="Verify password"
        bottom-bar
        clearable 
      />
    </div>
  </form>
</template>

<script setup lang="ts">
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