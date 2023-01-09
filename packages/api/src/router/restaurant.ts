import { z } from 'zod'

import { publicProcedure, router } from '../trpc'

export type Restaurant = {
  id: string
  name: string
  cuisine: string
  image: string
  total_reviews: string
  avg_rating: string
}

export const restaurantRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        cuisine: z.string().nullable(),
        restaurantName: z.string().nullable(),
        minAvgRating: z.number().default(3),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cuisine = input.cuisine || null

      const restaurants = await ctx.prisma.$queryRaw<Restaurant[]>`
      SELECT r.id,
             r.name,
             r.cuisine,
             'Brooklyn' as county,
             'https://shorturl.at/bnoyO' as image,
             count(Rev.rating)::varchar   as total_reviews,
             (
                 SELECT round(avg(Rev.rating), 1)
                 FROM "Restaurant" Res
                          INNER JOIN "Review" Rev on Res.id = Rev.restaurant_id
                 WHERE Res.id = r.id
             )                   as avg_rating
      FROM "Restaurant" r
              INNER JOIN "Review" Rev on Rev.restaurant_id = r.id
      WHERE r.cuisine = coalesce(${cuisine}, r.cuisine)
        AND upper(r.name) LIKE upper('%'||${input.restaurantName}||'%')
        AND CASE
                WHEN 1 IS NOT NULL
                    THEN (
                            SELECT cast(avg(rev2.rating) as decimal(10, 1)) as avg_rating
                            FROM "Restaurant" r2
                                      LEFT JOIN "Review" rev2 ON rev2.restaurant_id = r2.id
                            WHERE r2.id = r.id
                            GROUP BY r2.id
                        ) >= ${input.minAvgRating}
                ELSE TRUE
          END
      GROUP BY r.id
      ORDER BY avg_rating desc
    `

      return { restaurants }
    }),

  getCuisines: publicProcedure.query(async ({ ctx }) => {
    const cuisines = ctx.prisma.$queryRaw<
      Array<{
        cuisine: string
        total: string
      }>
    >`
      SELECT DISTINCT cuisine,
                      (
                          SELECT COUNT(r2.id)
                          FROM "Restaurant" r2
                          WHERE r2.cuisine = r.cuisine
                      ) AS total
      FROM "Restaurant" r
      GROUP BY r.id
    `

    return { cuisines }
  }),
})
