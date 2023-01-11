import {
  Box,
  Checkbox,
  Divider,
  Flex,
  Grid,
  Input,
  InputGroup,
  InputRightElement,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
} from '@chakra-ui/react'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { trpc } from 'utils/trpc'

import {
  useCuisines,
  useFilters,
  useFiltersActions,
  useSearchInput,
} from './restaurant-filters-store'

export const Filters = () => (
  <Box
    minW={320}
    h={550}
    mt={12}
    bg='white'
    rounded='lg'
    shadow='sm'
    display={{ base: 'none', xl: 'block' }}
  >
    <Stack spacing={8} mt='8' px='6' mx='auto'>
      <SearchBar />
      <Cuisines />
      <Divider />
      <ReviewScore />
    </Stack>
  </Box>
)

export const SearchBar = () => {
  const searchInput = useSearchInput()
  const filters = useFilters()
  const actions = useFiltersActions()

  return (
    <Flex as='form' bg='white' mx='auto' w='100%'>
      <InputGroup size='lg'>
        <Input
          fontSize='md'
          name='search'
          type='text'
          placeholder='Find restaurants or cuisines'
          value={searchInput}
          onChange={(e) => actions.updateRestaurantName(e.target.value)}
        />

        <InputRightElement
          cursor='pointer'
          borderRightRadius='md'
          _hover={{ bg: 'gray.200' }}
          onClick={actions.handleClickSearchInput}
        >
          {!!filters.restaurantName ? (
            <FaTimes aria-label='close-icon' />
          ) : (
            <FaSearch aria-label='search-icon' />
          )}
        </InputRightElement>
      </InputGroup>
    </Flex>
  )
}

const Cuisines = () => {
  const cuisines = useCuisines()
  const actions = useFiltersActions()

  const { data } = trpc.restaurant.getCuisines.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })

  data && actions.setCuisines(data.cuisines)

  return (
    <Stack>
      <Text as='b' mb='2'>
        Cuisine
      </Text>

      <Stack>
        {cuisines?.map((cuisine, index) => (
          <Checkbox
            key={index}
            isChecked={cuisine.isChecked}
            colorScheme='yellow'
            size='lg'
            _hover={{ color: 'yellow.400' }}
            onChange={() => actions.updateCuisine(cuisine.name, index)}
          >
            <Text color='gray.500'>
              {/* &#40; &#41; - left and right parentheses */}
              {cuisine.name} &#40;{cuisine.total}&#41;
            </Text>
          </Checkbox>
        ))}
      </Stack>
    </Stack>
  )
}

function ReviewScore() {
  const filters = useFilters()
  const actions = useFiltersActions()

  function handleIsSelected(i: number) {
    if (filters.avgRating === i) return true
  }

  return (
    <Stack spacing={3}>
      <Text as='b'>Review score ({filters.avgRating} and above)</Text>

      <Box my='auto'>
        <Slider
          defaultValue={2}
          min={1}
          max={4}
          step={1}
          colorScheme='yellow'
          onChangeEnd={(score) => {
            actions.updateAvgRating(score)
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>

          <SliderThumb w='5' h='5' shadow='md' />
        </Slider>

        <Grid templateColumns='repeat(4, 1fr)' gridGap={20}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Box key={i}>
              <Text
                fontWeight='700'
                color={handleIsSelected(i + 1) ? 'yellow.500' : 'gray.400'}
              >
                {i + 1}
              </Text>
            </Box>
          ))}
        </Grid>
      </Box>
    </Stack>
  )
}
