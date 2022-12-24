import { z } from 'zod'

import { publicProcedure, router } from '../trpc'

export const postRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return 'Prisma test --- It is working!!!'
  }),
})
