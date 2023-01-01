import { Address, Reservation, Restaurant, prisma } from '@mesavip/db'
import type { GetServerSideProps } from 'next'
import { signIn, signOut } from 'next-auth/react'
import Head from 'next/head'
import { trpc } from 'utils/trpc'

export const getServerSideProps: GetServerSideProps = async () => {
  const getCuisines = async () => {
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
    client_id: 'seed-clc0zb91k000o8dif1f8xdnfw',
    restaurant_id: 'seed-clc0z728x000020ifgs21holp',
    date: '2022-12-23T20:48:12.722Z',
  }

  const createReservation = async () => {
    const totalTables = await prisma.restaurant.findFirst({
      where: {
        id: 'seed-clc0z7293000e20if30e4a7rv',
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
          date: reservationOrder.date,
          user_id: reservationOrder.client_id,
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
      r.rated,
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
                          INNER JOIN Rate Rat on Res.id = Rat.restaurant_id
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
            INNER JOIN Rate on r.id = Rate.reservation_id
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
                  SELECT ROUND(avg(Rat.rating), 1)
                  FROM Restaurant Res
                          INNER JOIN Rate Rat on Res.id = Rat.restaurant_id
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
            INNER JOIN Rate on r.id = Rate.reservation_id
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
             DATE_FORMAT(Rate.created_at, '%b %d, %Y') as published_date,
             User.name                                 as customer_name
      FROM Rate
               INNER JOIN User on Rate.user_id = User.id
      WHERE Rate.restaurant_id = ${reservationOrder.restaurant_id}
      ORDER BY Rate.rating DESC
    `

    console.log(reviews)
  }

  const listSingleReview = async () => {
    const reservationId = 'seed-clcbksz0g00004pif61l17uh1'

    const review = await prisma.$queryRaw<Review>`
      SELECT comment,
            rating,
            DATE_FORMAT(created_at, '%b %d, %Y') as published_date
      FROM Rate
      WHERE reservation_id = ${reservationId}
    `

    console.log(review)
  }

  // await listReviews()
  // await listSingleReview()

  return {
    props: {},
  }
}

export default function Home() {
  const postQuery = trpc.post.all.useQuery()

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

          <div className='flex h-[60vh] justify-center px-4 text-2xl'>
            {postQuery.data ? (
              <div className='flex flex-col gap-4'>{postQuery.data}</div>
            ) : (
              <p>yeah</p>
            )}
          </div>
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
