<script setup lang="ts">
const emit = defineEmits(['switchToSignUp'])

// Use the auth composable which encapsulates reactive state and auth logic
const { state, loading, schema, signIn } = useAuth()

// Handle form submission
async function onSubmit(event: any) {
  await signIn(event)
}
</script>

<template>
  <div class="mx-auto w-full mt-10 max-w-md p-6">
    <h1 class="mb-6 text-center text-3xl font-bold">Welcome Back</h1>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Email" name="email">
        <UInput v-model="state.email" type="email" class="w-full" />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput v-model="state.password" type="password" class="w-full" />
      </UFormField>

      <UButton type="submit" block :loading="loading">
        Sign In
      </UButton>
    </UForm>

    <div class="mt-4 text-center">
      <UButton
        variant="link"
        @click="$emit('switchToSignUp')"
        class="text-primary hover:text-primary-dark"
      >
        Need an account? Sign Up
      </UButton>
    </div>
  </div>
</template>
