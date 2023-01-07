import { publicProcedure, router } from '../trpc'

export const restaurantRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    type Restaurant = {
      id: string
      name: string
      cuisine: string
      image: string
      total_reviews: number
      avg_rating: number
    }

    const cuisine = undefined
    const restaurantName = ''
    const minAvgRating = 3

    const restaurants = await ctx.prisma.$queryRaw<Restaurant[]>`
      SELECT r.id,
             r.name,
             r.cuisine,
             'shorturl.at/bnoyO' as image,
             count(Rev.rating)   as total_reviews,
             (
                 SELECT round(avg(Rev.rating), 1)
                 FROM "Restaurant" Res
                          INNER JOIN "Review" Rev on Res.id = Rev.restaurant_id
                 WHERE Res.id = r.id
             )                   as avg_rating
      FROM "Restaurant" r
              INNER JOIN "Review" Rev on Rev.restaurant_id = r.id
      WHERE r.cuisine = coalesce(${cuisine}, r.cuisine)
        AND upper(r.name) LIKE upper('%'||${restaurantName}||'%')
        AND CASE
                WHEN 1 IS NOT NULL
                    THEN (
                            SELECT cast(avg(rev2.rating) as decimal(10, 1)) as avg_rating
                            FROM "Restaurant" r2
                                      LEFT JOIN "Review" rev2 ON rev2.restaurant_id = r2.id
                            WHERE r2.id = r.id
                            GROUP BY r2.id
                        ) >= ${minAvgRating}
                ELSE TRUE
          END
      GROUP BY r.id
      ORDER BY avg_rating desc
    `

    return { restaurants }
  }),
})
