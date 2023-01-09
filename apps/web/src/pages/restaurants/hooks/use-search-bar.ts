import { useState } from 'react'

import { useRestaurantFiltersStore } from './restaurant-filters-store'

export const useSearchBar = () => {
  const { filters, updateRestaurant } = useRestaurantFiltersStore()
  const [search, searchSet] = useState('')

  const handleClick = () => {
    if (filters.name) {
      clearSearch()
    } else {
      updateRestaurant(search)
    }
  }

  const clearSearch = () => {
    searchSet('')
    updateRestaurant('')
  }

  return { search, searchSet, searchRestaurant: filters.name, handleClick }
}
