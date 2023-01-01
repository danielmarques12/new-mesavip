import { faker } from '@faker-js/faker'
import cuid from 'cuid'

import { Prisma, prisma } from '.'

const getUsers = async () => {
  const users = await prisma.user.findMany({
    where: {
      id: {
        contains: 'seed',
      },
    },
    select: {
      id: true,
    },
  })

  return { users }
}

const getRestaurants = async () => {
  const restaurants = await prisma.restaurant.findMany({
    where: {
      id: {
        contains: 'seed',
      },
    },
    select: {
      id: true,
    },
  })

  return { restaurants }
}

const getReservations = async () => {
  const reservations = await prisma.reservation.findMany({
    where: {
      id: {
        contains: 'seed',
      },
    },
    select: {
      id: true,
      restaurant_id: true,
      user_id: true,
    },
  })

  return { reservations }
}

const restaurantNames = [
  'Sea You Soon',
  'Lets Ketchup',
  'Basic Kneads Pizza',
  'Backyard Bowls',
  'Mellow Mushroom',
  'Wicked Wok',
  'Pie In the Sky',
  'Chops and Hops',
  'Yummy In The Tummy',
  'Slice of Spice',
  'Late Night Dine Right',
  'Chops & Hops',
  'Blazing Bean Roasters',
  'Killer Pizza from Mars',
  'The French Laundry',
  'Starbelly',
  'Egg Slut',
  'Goosefoot',
  'Garage Kitchen + Bar',
  'Mr. & Mrs. Bun',
  'Six Seven',
  'Gochew Grill',
  'Zero Zero',
  'Girl and the Goat',
  'Odd Duck',
  'Toro Toro',
  'The Purple Pig',
  'Bite Me Sandwiches',
  'The Pink Door',
  'Blue Mermaid',
]

const getRandomCuisine = () => {
  const cuisines = [
    'Mexican',
    'Swedish',
    'Italian',
    'Spanish',
    'American',
    'Scottish',
    'British',
    'Thai',
    'Chinese',
    // 'Russian',
    // 'Brazilian',
    // 'German',
    // 'French',
    // 'Cuban',
    // 'Indian',
    // 'Pizza',
    // 'Hamburger',
  ]

  return cuisines[Math.floor(Math.random() * cuisines.length)]
}

const seedUsers = async () => {
  await prisma.user.createMany({
    data: Array.from({ length: 10 }).map(
      (): Prisma.UserCreateInput => ({
        id: `seed-${cuid()}`,
        name: faker.name.fullName(),
        email: `${cuid()}-${faker.internet.email()}`,
      }),
    ),
  })
}

const seedRestaurants = async () => {
  restaurantNames.forEach(async (restaurantName) => {
    await prisma.restaurant.create({
      data: {
        id: `seed-${cuid()}`,
        name: restaurantName,
        about: faker.lorem.paragraphs(2),
        phone: faker.phone.number('(###)###-####'),
        website: 'www.website.com',
        total_tables: 5,
        opening_hour: '19:30:00',
        closing_hour: '23:45:00',
        cuisine: getRandomCuisine(),
      },
    })
  })
}

const seedReservations = async () => {
  const { restaurants } = await getRestaurants()
  const { users } = await getUsers()

  restaurants.forEach((restaurant) => {
    const reservationDate = new Date()
    reservationDate.setHours(20, 30, 0)

    users.forEach(async (user) => {
      await prisma.reservation.create({
        data: {
          id: `seed-${cuid()}`,
          date: reservationDate,
          canceled: false,
          rated: false,
          restaurant: {
            connect: {
              id: restaurant.id,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      })
    })
  })
}

const seedRatings = async () => {
  const { reservations } = await getReservations()

  reservations.forEach(async (reservation) => {
    await prisma.rate
      .create({
        data: {
          id: `seed-${cuid()}`,
          rating: faker.datatype.number({ min: 1, max: 5 }),
          comment: faker.lorem.paragraphs(1),
          reservation: {
            connect: {
              id: reservation.id,
            },
          },
          restaurant: {
            connect: {
              id: reservation.restaurant_id,
            },
          },
          user: {
            connect: {
              id: reservation.user_id,
            },
          },
        },
      })
      .then(async () => {
        await prisma.reservation.update({
          where: {
            id: reservation.id,
          },
          data: {
            rated: true,
          },
        })
      })
  })
}

const seedAddresses = async () => {
  const { restaurants } = await getRestaurants()

  restaurants.forEach(async (restaurant) => {
    await prisma.address.create({
      data: {
        id: `seed-${cuid()}`,
        address_line: faker.address.streetAddress(true),
        zipcode: faker.address.zipCode(),
        city: faker.address.cityName(),
        state: faker.address.state(),
        country: faker.address.country(),
        restaurant: {
          connect: {
            id: restaurant.id,
          },
        },
      },
    })
  })
}

const seed = async () => {
  // await seedUsers()
  // await seedRestaurants()
  // await seedReservations()
  await seedRatings()
  // await seedAddresses()

  // await prisma.rate.deleteMany()
  // await prisma.reservation.deleteMany()
}

seed().then(async () => {
  await prisma.$disconnect()
})
