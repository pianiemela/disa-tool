import { shape, string, number, arrayOf } from 'prop-types'

// eslint-disable-next-line import/prefer-default-export
export const responseProp = shape({
  id: number.isRequired,
  updated_at: string.isRequired,
  response: shape({
    verification: shape({
      overallVerification: shape({
        minGrade: string.isRequired,
        maxGrade: string.isRequired
      }).isRequired,
      categoryVerifications: arrayOf(shape({
        wantedGrade: shape({ difference: number.isRequired }).isRequired
      })).isRequired
    }),
    finalGradeResponse: shape({ grade_name: string })
  }).isRequired
})
