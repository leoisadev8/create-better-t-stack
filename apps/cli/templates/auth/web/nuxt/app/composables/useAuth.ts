import type { FormSubmitEvent } from '#ui/types'
import z from 'zod'

const signInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type SignInSchema = z.output<typeof signInSchema>
type SignUpSchema = z.output<typeof signUpSchema>

// Common error handling logic
const handleAuthError = (error: any, toast: any, defaultMessage: string) => {
  let errorMessage = defaultMessage
  
  if (error.error?.message) {
    errorMessage = error.error.message
  } else if (error.error?.code === 'INVALID_CREDENTIALS') {
    errorMessage = 'Invalid email or password'
  } else if (error.error?.code === 'USER_NOT_FOUND') {
    errorMessage = 'No account found with this email'
  } else if (error.error?.code === 'USER_EXISTS') {
    errorMessage = 'An account with this email already exists'
  } else if (error.error?.code === 'TOO_MANY_REQUESTS') {
    errorMessage = 'Too many attempts. Please try again later'
  }
  
  toast.add({ 
    title: 'Authentication Error', 
    description: errorMessage,
    color: 'red'
  })
}

const handleUnexpectedError = (error: any, toast: any) => {
  let errorMessage = 'An unexpected error occurred'
  
  if (error.name === 'ValidationError') {
    errorMessage = 'Please check your input and try again'
  } else if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
    errorMessage = 'Network error. Please check your connection'
  } else if (error.message) {
    errorMessage = error.message
  }
  
  toast.add({ 
    title: 'Error', 
    description: errorMessage,
    color: 'red'
  })
  
  console.error('Auth error:', error)
}

export const useSignIn = () => {
  const { $authClient } = useNuxtApp()
  const toast = useToast()
  
  // Reactive state scoped to this composable instance
  const state = reactive({
    email: '',
    password: '',
  })
  
  const loading = ref(false)
  
  const signIn = async (event: FormSubmitEvent<SignInSchema>) => {
    loading.value = true
    
    try {
      const result = await $authClient.signIn.email(
        {
          email: event.data.email,
          password: event.data.password,
        },
        {
          onSuccess: () => {
            toast.add({ title: 'Sign in successful' })
            navigateTo('/dashboard', { replace: true })
          },
          onError: (error) => handleAuthError(error, toast, 'Sign in failed'),
        },
      )
      
      return result
    } catch (error: any) {
      handleUnexpectedError(error, toast)
      throw error // Re-throw for component-level handling if needed
    } finally {
      loading.value = false
    }
  }
  
  const resetForm = () => {
    state.email = ''
    state.password = ''
  }
  
  return {
    state,
    loading: readonly(loading),
    schema: signInSchema,
    signIn,
    resetForm,
  }
}

export const useSignUp = () => {
  const { $authClient } = useNuxtApp()
  const toast = useToast()
  
  // Reactive state scoped to this composable instance
  const state = reactive({
    name: '',
    email: '',
    password: '',
  })
  
  const loading = ref(false)
  
  const signUp = async (event: FormSubmitEvent<SignUpSchema>) => {
    loading.value = true
    
    try {
      const result = await $authClient.signUp.email(
        {
          name: event.data.name,
          email: event.data.email,
          password: event.data.password,
        },
        {
          onSuccess: () => {
            toast.add({ title: 'Sign up successful' })
            navigateTo('/dashboard', { replace: true })
          },
          onError: (error) => handleAuthError(error, toast, 'Sign up failed'),
        },
      )
      
      return result
    } catch (error: any) {
      handleUnexpectedError(error, toast)
      throw error // Re-throw for component-level handling if needed
    } finally {
      loading.value = false
    }
  }
  
  const resetForm = () => {
    state.name = ''
    state.email = ''
    state.password = ''
  }
  
  return {
    state,
    loading: readonly(loading),
    schema: signUpSchema,
    signUp,
    resetForm,
  }
}

// For backward compatibility, export a general auth composable
export const useAuth = useSignIn
