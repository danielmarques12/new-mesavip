import { Box, Flex, Skeleton, Stack } from '@chakra-ui/react'
import { trpc } from 'utils/trpc'

import { Filters } from './filters'
import { RestaurantCard } from './restaurant-card'
import { useFilters } from './restaurant-filters-store'

export default function Home() {
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
