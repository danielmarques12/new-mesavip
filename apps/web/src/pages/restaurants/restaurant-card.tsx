import { Box, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react'
import type { Restaurant } from '@poneglyph/api/src/router/restaurant'
import { useReviewScore } from 'hooks/use-review-score'
import NextImage from 'next/image'
import Link from 'next/link'
import { createContext, useContext } from 'react'

const RestaurantCardContext = createContext({} as Restaurant)
const useRestaurantCardCtx = () => useContext(RestaurantCardContext)

export const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
  return (
    <RestaurantCardContext.Provider value={restaurant}>
      <Link href={`/restaurant/${restaurant.id}`} passHref>
        <Flex
          bg='white'
          borderRadius='lg'
          shadow={{ base: 'none', md: 'base' }}
          _hover={{ shadow: { base: 'none', md: 'md' } }}
          role={restaurant.name}
          height='162px'
          w='900px'
        >
          <Thumbnail />

          <Flex
            flexDirection={{ base: 'column', md: 'row' }}
            justify='space-between'
            w='full'
            py='4'
            pl='4'
          >
            <Content />
            <ReviewInfo />
          </Flex>
        </Flex>
      </Link>
    </RestaurantCardContext.Provider>
  )
}

const Thumbnail = () => {
  const restaurant = useRestaurantCardCtx()

  return (
    <Box borderLeftRadius='lg' borderRightRadius={{ base: 'lg', md: 'none' }}>
      <Image
        src={restaurant.image}
        alt={`${restaurant.name} thumbnail`}
        borderLeftRadius='lg'
        borderRightRadius={{ base: 'lg', md: 'none' }}
        maxW={{ base: 130, md: 240 }}
        h='full'
      />
    </Box>
  )
}

const Content = () => {
  const restaurant = useRestaurantCardCtx()

  return (
    <Stack spacing={{ base: '1', md: '3' }}>
      <Heading as='h3' fontSize={{ base: 'sm', md: 'lg' }}>
        {restaurant.name}
      </Heading>

      <Text fontSize={{ base: 'xs', md: 'sm' }}>Brooklyn</Text>
      <Text fontSize={{ base: 'xs', md: 'sm' }}>
        {restaurant.cuisine} • $$$
      </Text>
    </Stack>
  )
}

const ReviewInfo = () => {
  const restaurant = useRestaurantCardCtx()

  return (
    <Flex
      align='center'
      w={{ base: '', md: 140 }}
      h={{ base: '', md: 130 }}
      borderLeftStyle='solid'
      borderLeftWidth={{ base: '', md: 'thin' }}
      borderLeftColor={{ base: '', md: 'gray.100' }}
    >
      <Flex
        direction={{ base: 'row', md: 'column' }}
        align='center'
        flexGrow='1'
        gridGap='1'
      >
        <Score />

        <Text fontSize='sm' color='gray.400'>
          {restaurant.total_reviews} reviews
        </Text>
      </Flex>
    </Flex>
  )
}

const Score = () => {
  const restaurant = useRestaurantCardCtx()
  const score = useReviewScore(restaurant.avg_rating)

  return (
    <Flex
      align='center'
      justifyContent='center'
      w={{ base: 12, xl: 16 }}
      h={{ base: 6, xl: 8 }}
      bg={score.color}
      color='white'
      borderRadius='2xl'
    >
      <Text fontSize={{ base: 'md', xl: 'lg' }} fontWeight='700'>
        {restaurant.avg_rating}
      </Text>

      <Text fontSize={{ base: 'xs', xl: 'sm' }} fontWeight='500'>
        /5
      </Text>
    </Flex>
  )
}
