<script setup lang="ts">
const emit = defineEmits(['switchToSignIn'])

// Use the auth composable which encapsulates reactive state and auth logic
const { state, loading, schema, signUp } = useSignUp()

// Handle form submission
async function onSubmit(event: any) {
  await signUp(event)
}
</script>

<template>
  <div class="mx-auto w-full mt-10 max-w-md p-6">
    <h1 class="mb-6 text-center text-3xl font-bold">Create Account</h1>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
       <UFormField label="Name" name="name">
        <UInput v-model="state.name" class="w-full" />
      </UFormField>

      <UFormField label="Email" name="email">
        <UInput v-model="state.email" type="email" class="w-full" />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput v-model="state.password" type="password" class="w-full" />
      </UFormField>

      <UButton type="submit" block :loading="loading">
        Sign Up
      </UButton>
    </UForm>

    <div class="mt-4 text-center">
      <UButton
        variant="link"
        @click="$emit('switchToSignIn')"
        class="text-primary hover:text-primary-dark"
      >
        Already have an account? Sign In
      </UButton>
    </div>
  </div>
</template>
