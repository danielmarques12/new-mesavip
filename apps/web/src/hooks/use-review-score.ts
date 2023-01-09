interface ScoreRankData {
  message: string
  color: string
}

export const useReviewScore = (avg_rating: string): ScoreRankData => {
  const score = Math.round(parseInt(avg_rating))

  switch (score) {
    case 5:
      return {
        message: `"Excellent"`,
        color: 'green.500',
      }

    case 4:
      return {
        message: `"Very good"`,
        color: 'green.300',
      }

    case 3:
      return {
        message: `"Good"`,
        color: '#faba33',
      }

    case 2:
      return {
        message: `"Average"`,
        color: 'orange.500',
      }

    case 1:
      return {
        message: `"Not good"`,
        color: 'red.300',
      }

    default:
      return {
        message: '',
        color: '',
      }
  }
}
