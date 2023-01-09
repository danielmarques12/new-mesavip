import create from 'zustand'

type FiltersKeys = 'name' | 'cuisine' | 'avg_rating'

type RestaurantFilters = {
  name?: string
  cuisine?: string
  avg_rating?: number
}

type IRestaurantStore = {
  filters: RestaurantFilters
  updateRestaurant: (value: string) => void
  updateCuisine: (value: string) => void
  updateAvgRating: (value: string) => void
}

const updateFilters = (
  filters: RestaurantFilters,
  key: FiltersKeys,
  value: string,
): RestaurantFilters => ({
  ...filters,
  [key]: value,
})

export const useRestaurantFiltersStore = create<IRestaurantStore>((set) => ({
  filters: {},

  updateRestaurant: (value: string) => {
    set((state) => ({
      ...state,
      filters: updateFilters(state.filters, 'name', value),
    }))
  },

  updateCuisine: (value: string) => {
    set((state) => ({
      ...state,
      filters: updateFilters(state.filters, 'cuisine', value),
    }))
  },

  updateAvgRating: (value: string) => {
    set((state) => ({
      ...state,
      filters: updateFilters(state.filters, 'avg_rating', value),
    }))
  },
}))
