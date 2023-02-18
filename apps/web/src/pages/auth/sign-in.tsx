import { useAuthError } from 'hooks/use-auth-error'
import { GetServerSideProps } from 'next'
import {
  ClientSafeProvider,
  getProviders,
  getSession,
  signIn,
} from 'next-auth/react'
import Image from 'next/image'
import {
  FaDiscord as DiscordIcon,
  FaGithub as GithubIcon,
  FaGoogle as GoogleIcon,
  FaTwitter as TwitterIcon,
} from 'react-icons/fa'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (session) {
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    }
  }

  const resProviders = await getProviders()

  const providers = Object.values(resProviders || {}).map(
    (provider) => provider,
  )

  return {
    props: {
      providers,
    },
  }
}

export default function SignInPage({
  providers,
}: {
  providers: ClientSafeProvider[]
}) {
  const { error } = useAuthError()

  return (
    <div className='min-h-screen'>
      <div className='flex min-h-screen flex-col items-center justify-center space-y-8 py-12 sm:px-6 lg:space-y-12 lg:px-8'>
        <Image src='/logo.svg' alt='Mesavip logo' width={100} height={49} />

        <div
          aria-label='Sign in form'
          className='w-full space-y-4 sm:mx-auto sm:max-w-lg'
        >
          <div className='flex flex-col justify-between gap-7 border-y border-slate-700 bg-slate-800 py-8 px-4 text-slate-200 shadow sm:rounded-lg sm:border-x sm:px-10'>
            <span className='mx-auto text-gray-300'>Sign in with</span>

            {error ? <AuthError error={error} /> : null}

            {providers ? <ProvidersList providers={providers} /> : null}

            <SigninTermsAndPolicy />
          </div>
        </div>
      </div>
    </div>
  )
}

const AuthError = ({ error }: { error: string }) => (
  <div className='mx-auto rounded-lg border border-slate-700 p-4 text-center text-red-400'>
    {error}
  </div>
)

const ProvidersList = ({ providers }: { providers: ClientSafeProvider[] }) => (
  <div className='grid grid-cols-2 gap-3'>
    {providers.map((provider) => (
      <SignInButton key={provider.id} provider={provider} />
    ))}
  </div>
)

const providersIcons: Record<string, JSX.Element> = {
  Discord: <DiscordIcon />,
  GitHub: <GithubIcon />,
  Google: <GoogleIcon />,
  Twitter: <TwitterIcon />,
}

const SignInButton = ({ provider }: { provider: ClientSafeProvider }) => (
  <div
    className='flex cursor-pointer items-center gap-2 rounded-md border border-solid border-slate-700 py-3 px-14 text-center text-lg font-semibold hover:bg-slate-700'
    onClick={() =>
      signIn(provider.id, {
        callbackUrl: '/',
      })
    }
  >
    {providersIcons[provider.name]}
    <span>{provider.name}</span>
  </div>
)

const SigninTermsAndPolicy = () => (
  <span className='mx-auto w-72 text-center text-sm text-gray-400'>
    By signing in, you agree to our{' '}
    <span className='cursor-pointer text-pink-400'>Terms of service</span> and{' '}
    <span className='cursor-pointer text-pink-400'>Privacy Policy</span>
  </span>
)
