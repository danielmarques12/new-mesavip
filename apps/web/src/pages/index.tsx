import { Address, Reservation, Restaurant, prisma } from '@poneglyph/db'
import type { GetServerSideProps } from 'next'
import { signIn, signOut } from 'next-auth/react'
import Head from 'next/head'
import { trpc } from 'utils/trpc'

export const getServerSideProps: GetServerSideProps = async () => {
  const listCuisines = async () => {
    const cuisines = await prisma.$queryRaw<
      Array<
        Restaurant & {
          total?: string
        }
      >
    >`
      SELECT DISTINCT
      cuisine,
      (
        SELECT COUNT(r2.id)
        FROM Restaurant r2
        WHERE r2.cuisine = r.cuisine
      ) AS total
      FROM Restaurant r
      GROUP BY id
    `

    cuisines.forEach(({ total }) => console.log(total))
  }

  const reservationOrder = {
    customer_id: 'seed-clcilzjjm0000j1ifdq4ne8ys',
    restaurant_id: 'seed-clcilzl7c000aj1if6ohn84wl',
    date: '2023-01-01T23:30:00.372Z',
  }

  const createReservation = async () => {
    const totalTables = await prisma.restaurant.findFirst({
      where: {
        id: reservationOrder.restaurant_id,
      },
      select: {
        total_tables: true,
      },
    })

    const reservations = await prisma.reservation.findMany({
      where: {
        restaurant_id: reservationOrder.restaurant_id,
        date: reservationOrder.date,
        canceled: false,
      },
      select: {
        id: true,
      },
    })

    if (reservations.length === totalTables?.total_tables) {
      return console.log('restaurant is full on this date and time!')
    }

    await prisma.reservation
      .create({
        data: {
          restaurant_id: reservationOrder.restaurant_id,
          date: '2023-01-10T19:30:00.372Z',
          user_id: reservationOrder.customer_id,
        },
      })
      .then(() => console.log('Reservation created successfully!!!'))

    console.log('#######################################')
    console.log('#######################################')
    console.log({ totalTables, reservations })
    console.log('#######################################')
    console.log('#######################################')
  }

  // await createReservation()

  const cancelReservation = async () => {
    await prisma.reservation
      .findFirstOrThrow({
        where: {
          id: 'clc8mzmdc0001iflxmfnwjabe',
        },
      })
      .then(async (reservation) => {
        await prisma.reservation.update({
          where: {
            id: reservation.id,
          },
          data: {
            canceled: true,
          },
        })
      })
      .catch(() => console.log('reservation not found!!!'))
  }

  // await cancelReservation()

  type PastReservation = Reservation & {
    restaurant: Restaurant & { address: Address }
    formated_date: {
      day: string
      month: string
      time: string
    }
  }

  const listPastReservations = async () => {
    const pastReservations = await prisma.$queryRaw<PastReservation[]>`
      SELECT r.id,
      r.canceled,
      r.reviewed,
      JSON_OBJECT(
              'day', DATE_FORMAT(r.date, '%d'),
              'month', DATE_FORMAT(r.date, '%b'),
              'time', TIME_FORMAT(r.date, '%H:%i %p')
          ) as formated_date,
      JSON_OBJECT(
              'id', Restaurant.id,
              'name', Restaurant.name,
              'avg_rating', (
                  SELECT ROUND(avg(Rat.rating), 1)
                  FROM Restaurant Res
                          INNER JOIN Review Rev on Res.id = Rev.restaurant_id
                  WHERE Res.id = Restaurant.id
              ),
              'address', JSON_OBJECT(
                      'address_line', a.address_line,
                      'city', a.city,
                      'state', a.state
                  )
          ) as restaurant
      FROM Reservation r
            INNER JOIN User u on u.id = r.user_id
            INNER JOIN Restaurant on Restaurant.id = r.restaurant_id
            INNER JOIN Address a on Restaurant.id = a.restaurant_id
            INNER JOIN Review on r.id = Review.reservation_id
      WHERE u.id = 'seed-clc0zb1wf00020qifd2j38utw'
      AND r.date < now()
      GROUP BY Restaurant.id, r.id, a.id, r.date
      ORDER BY r.date;
  `

    console.log(pastReservations[2])
  }

  const listUpcomingReservations = async () => {
    const upcomingReservations = await prisma.$queryRaw<PastReservation[]>`
      SELECT r.id,
      r.canceled,
      JSON_OBJECT(
              'day', DATE_FORMAT(r.date, '%d'),
              'month', DATE_FORMAT(r.date, '%b'),
              'time', TIME_FORMAT(r.date, '%H:%i %p')
          ) as formated_date,
      JSON_OBJECT(
              'id', Restaurant.id,
              'name', Restaurant.name,
              'avg_rating', (
                  SELECT ROUND(avg(Rev.rating), 1)
                  FROM Restaurant Res
                          INNER JOIN Review Rev on Res.id = Rev.restaurant_id
                  WHERE Res.id = Restaurant.id
              ),
              'address', JSON_OBJECT(
                      'address_line', a.address_line,
                      'city', a.city,
                      'state', a.state
                  )
          ) as restaurant
      FROM Reservation r
            INNER JOIN User u on u.id = r.user_id
            INNER JOIN Restaurant on Restaurant.id = r.restaurant_id
            INNER JOIN Address a on Restaurant.id = a.restaurant_id
            INNER JOIN Review on r.id = Review.reservation_id
      WHERE u.id = 'seed-clc0zb1wf00020qifd2j38utw'
      AND r.date > now()
      GROUP BY Restaurant.id, r.id, a.id, r.date
      ORDER BY r.date;
  `

    console.log(upcomingReservations[2])
  }

  // await listPastReservations()
  // await listUpcomingReservations()

  type Review = {
    comment: string
    rating: number
    published_date: string
    customer_name?: string
  }

  const listReviews = async () => {
    const reviews = await prisma.$queryRaw<Review[]>`
      SELECT comment,
             rating,
             DATE_FORMAT(Review.created_at, '%b %d, %Y') as published_date,
             User.name                                 as customer_name
      FROM Review
               INNER JOIN User on Review.user_id = User.id
      WHERE Review.restaurant_id = ${reservationOrder.restaurant_id}
      ORDER BY Review.rating DESC
    `

    console.log(reviews)
  }

  const listSingleReview = async () => {
    const reservationId = 'seed-clcbksz0g00004pif61l17uh1'

    const review = await prisma.$queryRaw<Review>`
      SELECT comment,
            rating,
            DATE_FORMAT(created_at, '%b %d, %Y') as published_date
      FROM Review
      WHERE reservation_id = ${reservationId}
    `

    console.log(review)
  }

  // await listReviews()
  // await listSingleReview()

  const createReview = async () => {
    const reservationId = 'seed-clce5qf7x000ut6if2s2hbmg3'

    const isReviewAvailableAlready = await prisma.$queryRaw<
      Array<{ id: string }>
    >`
      SELECT id
      FROM Reservation
      WHERE id = ${reservationId}
        AND canceled = false
        AND DATE_ADD(date, INTERVAL 12 hour) < now()
    `

    if (!isReviewAvailableAlready.length) {
      console.log(
        'Customers can only review reservations after 12 hours have passed',
      )
    }

    const review = {
      user_id: reservationOrder.customer_id,
      restaurant_id: reservationOrder.restaurant_id,
      reservation_id: reservationId,
      comment: 'yeah, very good!!!',
      rating: 5,
    }

    await prisma.review
      .create({
        data: review,
      })
      .then(async () => {
        await prisma.reservation.update({
          where: {
            id: review.reservation_id,
          },
          data: {
            reviewed: true,
          },
        })
      })
  }

  // await createReview()

  const listSingleRestaurant = async () => {
    const restaurantId = 'seed-clce5pwor000akjifaf5z2ikm'

    type Restaurant = {
      id: string
      name: string
      about: string
      phone: string
      website: string
      cuisine: string
      opening_hour: string
      closing_hour: string
      total_reviews: number
      avg_rating: number
      address: {
        address_line: string
        zipcode: string
        city: string
        state: string
      }
    }

    const restaurant = await prisma.$queryRaw<Restaurant[]>`
     SELECT R.id,
            R.name,
            R.about,
            R.phone,
            R.website,
            R.cuisine,
            TIME_FORMAT(R.opening_hour, '%H:%i') as opening_hour,
            TIME_FORMAT(R.closing_hour, '%H:%i') as closing_hour,
            count(Rev.rating)                    as total_reviews,
            JSON_OBJECT(
                    'address_line', A.address_line,
                    'zipcode', A.zipcode,
                    'city', A.city,
                    'state', A.state
                )                                as address,
          (SELECT ROUND(avg(Rev.rating), 1)
           FROM Restaurant Res
                  INNER JOIN Review Rev on Res.id = Rev.restaurant_id
           WHERE Res.id = R.id)                as avg_rating
      FROM Restaurant R
            INNER JOIN Address A on A.restaurant_id = R.id
            INNER JOIN Review Rev on Rev.restaurant_id = R.id
      WHERE R.id = ${restaurantId}
      GROUP BY R.id, A.id
    `

    console.log(restaurant[0])
  }

  // await listSingleRestaurant()

  // It's lacking the filters
  const listRestaurants = async () => {
    type Restaurant = {
      id: string
      name: string
      cuisine: string
      total_reviews: number
      avg_rating: number
    }

    const cuisine = 'Hamburger'
    const restaurantName = 'go'
    const minAvgRating = 3

    const restaurants = await prisma.$queryRaw<Restaurant[]>`
      SELECT r.id,
             r.name,
             r.cuisine,
             'shorturl.at/bnoyO' as image,
             count(Rev.rating)   as total_reviews,
             (
                 SELECT round(avg(Rev.rating), 1)
                 FROM "Restaurant" Res
                          INNER JOIN "Review" Rev on Res.id = Rev.restaurant_id
                 WHERE Res.id = r.id
             )                   as avg_rating
      FROM "Restaurant" r
              INNER JOIN "Review" Rev on Rev.restaurant_id = r.id
      WHERE r.cuisine = coalesce(${cuisine}, r.cuisine)
        AND upper(r.name) LIKE upper('%'||${restaurantName}||'%')
        AND CASE
                WHEN 1 IS NOT NULL
                    THEN (
                            SELECT cast(avg(rev2.rating) as decimal(10, 1)) as avg_rating
                            FROM "Restaurant" r2
                                      LEFT JOIN "Review" rev2 ON rev2.restaurant_id = r2.id
                            WHERE r2.id = r.id
                            GROUP BY r2.id
                        ) >= ${minAvgRating}
                ELSE TRUE
          END
      GROUP BY r.id
      ORDER BY avg_rating desc
    `

    console.log({ restaurants })
  }

  // await listRestaurants()

  const listAvailableHours = async () => {
    const selectedDate = new Date('2023-01-07')

    const availableHours = await prisma.$queryRaw<Array<{ hour: string }>>`
    SELECT to_char(h.hour::time, 'HH24:MI') as hour
    FROM "Hour" h
    LEFT JOIN "Restaurant" res ON res.id = ${reservationOrder.restaurant_id}
    WHERE CASE
              WHEN ${selectedDate} >= now()::date
                  THEN true
              ELSE false
        END
      AND to_char(h.hour::time, 'HH24:MI') NOT IN (
        SELECT to_char(r.date::time, 'HH24:MI') yeah
        FROM "Reservation" r
                 INNER JOIN "Restaurant" r2 on r.restaurant_id = r2.id
        WHERE r2.id = ${reservationOrder.restaurant_id}
          AND r.date::date = ${selectedDate}
        GROUP BY r.date, r2.total_tables
        HAVING count(r.date) = r2.total_tables
    )
      AND h.hour >= res.opening_hour
      AND h.hour <= res.closing_hour
      AND CASE
              WHEN ${selectedDate} = now()::date
                  THEN h.hour::time > now()::time
              ELSE true
        END
    ORDER BY to_char(h.hour::time, 'HH24:MI');
    `

    console.log({ availableHours })
  }

  // await listAvailableHours()

  return {
    props: {},
  }
}

export default function Home() {
  // const postQuery = trpc.post.all.useQuery()

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white'>
        <div className='container flex flex-col items-center justify-center gap-12 px-4 py-8'>
          <h1 className='text-5xl font-extrabold tracking-tight sm:text-[5rem]'>
            Create <span className='text-[hsl(280,100%,70%)]'>T3</span> Turbo
          </h1>
          <AuthShowcase />

          {/* <div className='flex h-[60vh] justify-center px-4 text-2xl'>
            {postQuery.data ? (
              <div className='flex flex-col gap-4'>{postQuery.data}</div>
            ) : (
              <p>yeah</p>
            )}
          </div> */}
        </div>
      </main>
    </>
  )
}

const AuthShowcase: React.FC = () => {
  const { data: session } = trpc.auth.getSession.useQuery()

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: !!session?.user },
  )

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      {session?.user && (
        <p className='text-center text-2xl text-white'>
          {session && <span>Logged in as {session?.user?.name}</span>}
          {secretMessage && <span> - {secretMessage}</span>}
        </p>
      )}
      <button
        className='rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20'
        onClick={session ? () => signOut() : () => signIn()}
      >
        {session ? 'Sign out' : 'Sign in'}
      </button>
    </div>
  )
}
