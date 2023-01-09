export const hours = () => {
  const hours = [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
  ]

  const timeSlices = ['00:00', '15:00', '30:00', '45:00']

  const formattedHours: Array<{ hour: string }> = []

  hours.forEach((hour) => {
    timeSlices.forEach((slice) => {
      formattedHours.push({ hour: `${hour}:${slice}` })
    })
  })

  return formattedHours
}

export const restaurantNames = [
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
  'Bill Grill',
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

export const getRandomCuisine = () => {
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
    'Russian',
    'Brazilian',
    'German',
    'French',
    'Cuban',
    'Indian',
    'Pizza',
    'Hamburger',
  ]

  return cuisines[Math.floor(Math.random() * cuisines.length)]
}
