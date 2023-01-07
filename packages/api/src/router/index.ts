import { router } from '../trpc'
import { authRouter } from './auth'
import { restaurantRouter } from './restaurant'

export const appRouter = router({
  auth: authRouter,
  restaurant: restaurantRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
