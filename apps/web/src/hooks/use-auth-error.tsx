import { useRouter } from 'next/router'
import { z } from 'zod'

const signInErrorTypes = [
  'Signin',
  'OAuthSignin',
  'OAuthCallback',
  'OAuthCreateAccount',
  'EmailCreateAccount',
  'Callback',
  'OAuthAccountNotLinked',
  'EmailSignin',
  'CredentialsSignin',
  'SessionRequired',
  'default',
] as const

type SignInErrorTypes = typeof signInErrorTypes[number]

const errors: Record<SignInErrorTypes, string> = {
  Signin: 'Try signing in with a different account.',
  OAuthSignin: 'Try signing in with a different account.',
  OAuthCallback: 'Try signing in with a different account.',
  OAuthCreateAccount: 'Try signing in with a different account.',
  EmailCreateAccount: 'Try signing in with a different account.',
  Callback: 'Try signing in with a different account.',
  OAuthAccountNotLinked:
    'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'Check your email inbox.',
  CredentialsSignin:
    'Sign in failed. Check if the details you provided are correct.',
  SessionRequired: '',
  default: 'Unable to sign in.',
}

const querySchema = z.object({
  error: z.enum(signInErrorTypes).optional(),
})

export const useAuthError = () => {
  const router = useRouter()
  const { error: errorType } = querySchema.parse(router.query)

  const error = errorType && errors[errorType]

  return { error }
}
