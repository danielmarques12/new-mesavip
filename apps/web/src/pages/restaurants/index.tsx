import { Box, Flex, Skeleton, Stack } from '@chakra-ui/react'
import { prisma } from '@mesavip/db'
import { GetServerSideProps } from 'next'
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
  const idk = () => {
    actions.setCuisines(cuisines)
    console.log('#############')
    console.log('#############')
    console.log('#############')
  }
  idk()

  const filters = useFilters()
  const { data, isLoading, isFetching } = trpc.restaurant.getAll.useQuery({
    cuisine: filters.cuisine,
    restaurantName: filters.restaurantName,
    minAvgRating: filters.avgRating,
  })

  return (
    <Box bg={{ base: 'inherit', md: 'gray.50' }} minHeight='100vh'>
      <Box px={{ base: '6', md: '24' }} pt='8'>
        <Stack spacing={6}>
          <Flex gridGap='12' mx='auto'>
            <Filters />

            <Stack spacing={4}>
              {data?.restaurants.map((restaurant) => (
                <Skeleton
                  key={restaurant.id}
                  isLoaded={!isLoading || !isFetching}
                >
                  <RestaurantCard restaurant={restaurant} />
                </Skeleton>
              ))}
            </Stack>
          </Flex>
        </Stack>
      </Box>
    </Box>
  )
}
