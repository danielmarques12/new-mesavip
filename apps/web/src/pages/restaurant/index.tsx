import { ReactNode } from 'react'
import { trpc } from 'utils/trpc'

import { RestaurantCard } from './restaurant-card'

export default function Home() {
  const { data, isLoading } = trpc.restaurant.getAll.useQuery()

  data && console.log({ data })

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='px-24 pt-8'>
        <div className='mx-auto flex gap-12'>
          {Array.from({ length: 1 }).map(() => (
            <RestaurantCard />
          ))}
        </div>
      </div>
    </div>
  )
}

const Wrapper = ({ children }: { children: ReactNode }) => (
  <div className='min-h-screen bg-gray-50'>
    <div className='px-24 pt-8'>
      <div className='mx-auto flex gap-12'>{children}</div>
    </div>
  </div>
)
