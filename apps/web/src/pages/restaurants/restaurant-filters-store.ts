import create from 'zustand'

type FiltersKeys = 'restaurantName' | 'cuisine' | 'avgRating'

type RestaurantFilters = {
  avgRating?: number
  cuisine?: string
  restaurantName?: string
}

export type Cuisine = {
  name: string
  total: string
  isChecked: boolean
}

type RestaurantStore = {
  cuisines: Cuisine[]
  filters: RestaurantFilters
  actions: {
    updateRestaurantName: (value: string) => void
    updateCuisine: (value: string | undefined, index: number) => void
    updateAvgRating: (value: number) => void
    setCuisines: (cuisines: Cuisine[]) => void
    handleClickSearchIcon: () => void
  }
}

const updateFilters = (
  filters: RestaurantFilters,
  key: FiltersKeys,
  value: string | number | undefined,
): RestaurantFilters => ({
  ...filters,
  [key]: value,
})

const setCuisines = (cuisines: Cuisine[]): Cuisine[] =>
  cuisines.map((cuisine) => ({
    ...cuisine,
    isChecked: false,
  }))

const handleChangeCuisine = (index: number, cuisines: Cuisine[]): Cuisine[] => {
  const newCuisines = cuisines.map((cuisine, i) => ({
    ...cuisine,
    isChecked: i === index ? !cuisine.isChecked : false,
  }))

  return newCuisines
}

const useRestaurantFiltersStore = create<RestaurantStore>((set) => ({
  cuisines: [],
  filters: {
    avgRating: 3,
    cuisine: undefined,
    restaurantName: '',
  },

  actions: {
    handleClickSearchIcon: () => {
      set((state) => ({
        ...state,
        filters: updateFilters(
          state.filters,
          'restaurantName',
          !!state.filters.restaurantName ? '' : state.filters.restaurantName,
        ),
      }))
    },

    updateRestaurantName: (value) => {
      set((state) => ({
        ...state,
        filters: updateFilters(state.filters, 'restaurantName', value),
      }))
    },

    updateAvgRating: (value) => {
      set((state) => ({
        ...state,
        filters: updateFilters(state.filters, 'avgRating', value),
      }))
    },

    updateCuisine: (value, index) => {
      console.log({ value, index })
      set((state) => ({
        ...state,
        filters: updateFilters(state.filters, 'cuisine', value),
        cuisines: handleChangeCuisine(index, state.cuisines),
      }))
    },

    setCuisines: (cuisines) => {
      set((state) => ({
        ...state,
        cuisines: setCuisines(cuisines),
      }))
    },
  },
}))

export const useFilters = () =>
  useRestaurantFiltersStore((state) => state.filters)

export const useCuisines = () =>
  useRestaurantFiltersStore((state) => state.cuisines)

export const useFiltersActions = () =>
  useRestaurantFiltersStore((state) => state.actions)
