import { Box, Flex, Skeleton, Stack } from '@chakra-ui/react'
import { prisma } from '@mesavip/db'
import { GetServerSideProps } from 'next'
import { useMemo } from 'react'
import { trpc } from 'utils/trpc'

import { Filters } from './filters'
import { RestaurantCard } from './restaurant-card'
import {
  Cuisine,
  useFilters,
  useFiltersActions,
} from './restaurant-filters-store'

export const getServerSideProps: GetServerSideProps = async () => {
  const cuisines = await prisma.$queryRaw<Cuisine[]>`
      SELECT DISTINCT cuisine as name,
                      (
                          SELECT COUNT(r2.id)::varchar
                          FROM "Restaurant" r2
                          WHERE r2.cuisine = r.cuisine
                      ) AS total
      FROM "Restaurant" r
      GROUP BY r.id
    `.then((res) =>
    res.map((cuisine) => ({
      ...cuisine,
      isChecked: false,
    })),
  )

  return {
    props: {
      cuisines,
    },
  }
}

export default function Restaurants({ cuisines }: { cuisines: Cuisine[] }) {
  const actions = useFiltersActions()
  useMemo(() => actions.setCuisines(cuisines), [actions, cuisines])

  const filters = useFilters()
  const { data } = trpc.restaurant.getAll.useQuery(
    {
      cuisine: filters.cuisine,
      restaurantName: filters.restaurantName,
      minAvgRating: filters.avgRating,
    },
    { refetchOnWindowFocus: false },
  )

  return (
    <Box bg={{ base: 'inherit', md: 'gray.50' }} minHeight='100vh'>
      <Box px={{ base: '6', md: '24' }} pt='8'>
        <Stack spacing={6}>
          <Flex gridGap='12' mx='auto'>
            <Filters />

            <Stack spacing={4}>
              {data ? (
                data?.restaurants.map((restaurant, index) => (
                  <RestaurantCard key={index} restaurant={restaurant} />
                ))
              ) : (
                <RestaurantCardsSkeleton />
              )}
            </Stack>
          </Flex>
        </Stack>
      </Box>
    </Box>
  )
}

const RestaurantCardsSkeleton = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton
          key={i}
          // w={{ base: 300, md: 700 }}
          // h={{ base: 125, md: 140 }}
          height='162px'
          w='900px'
        />
      ))}
    </>
  )
}
