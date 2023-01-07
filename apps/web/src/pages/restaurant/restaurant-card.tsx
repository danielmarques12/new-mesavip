import Image from 'next/image'
import Link from 'next/link'

import restaurantThumb from '../../../public/restaurant.jpeg'

export const RestaurantCard = () => (
  <Link href='' passHref className='hover:outline-none'>
    <div className='flex rounded-lg bg-white shadow hover:shadow-md'>
      {/* rounded-tr-lg on mobile */}
      <div className='my-auto rounded-tl-lg'>
        <Image
          className='rounded-tl-lg'
          src={restaurantThumb}
          width={240}
          height={240}
          alt='restaurant thumbnail'
        />
      </div>

      <div className='mt-4 ml-4 grid grid-cols-3 gap-3'>
        <div className='flex flex-col gap-3'>
          <div className='text-lg'>Tucos Restaurant</div>
        </div>

        <p className='text-sm'>Vila Matilde</p>
        <p className='text-sm'>Brasileira • $$$</p>
      </div>

      <div className='flex h-32 w-36 text-center'>
        <div className='flex grow flex-col gap-3 text-center'>
          <div className='h-8 w-16 justify-center rounded-2xl bg-green-500 text-center text-white'>
            <span className='text-lg font-bold'>4.3</span>
            <span className='text-sm font-medium'>/5</span>
          </div>

          <span className='text-sm text-gray-400'>450 reviews</span>
        </div>
      </div>
    </div>
  </Link>
)
