import { Box, Divider, Flex, Skeleton, Stack, VStack } from '@chakra-ui/react'
import { trpc } from 'utils/trpc'

import { RestaurantCard } from './restaurant-card'

export default function Home() {
  const { data, isLoading, isFetching } = trpc.restaurant.getAll.useQuery({
    cuisine: '',
    restaurantName: '',
    minAvgRating: 3,
  })

  return (
    <Box bg={{ base: 'inherit', md: 'gray.50' }} minHeight='100vh'>
      <Box px={{ base: '6', md: '24' }} pt='8'>
        <Stack spacing={6}>
          <Flex gridGap='12' mx='auto'>
            <Box>Filters</Box>

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
