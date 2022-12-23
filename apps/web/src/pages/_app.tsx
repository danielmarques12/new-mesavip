// src/pages/_app.tsx
import { Open_Sans } from '@next/font/google'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { AppType } from 'next/app'
import 'styles/globals.css'
import { trpc } from 'utils/trpc'

const openSans = Open_Sans({
  variable: '--open-sans',
  fallback: ['Helvetica', 'ui-sans-serif'],
})

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <>
    <style jsx global>
      {`
        :root {
          --open-sans: ${openSans.style.fontFamily};
        }
      `}
    </style>

    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  </>
)

export default trpc.withTRPC(MyApp)
