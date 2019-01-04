import React from 'react'
import PropTypes from 'prop-types'

import Grade from './Grade'
import CreateGradeForm from './CreateGradeForm'

const Gradelist = (props) => {
  const levels = props.levels.sort((a, b) => a.order - b.order)
  const grades = props.grades.sort((a, b) => a.order - b.order)
  let newOrder = 1
  const gradesNode = grades.map((grade, index, gradesArray) => {
    const slots = {
      previous: index > 0 ? (grade.order + gradesArray[index - 1].order) / 2 : grade.order - 1,
      next: index < gradesArray.length - 1 ? (
        (grade.order + gradesArray[index + 1].order) / 2
      ) : grade.order + 1
    }
    if (index === gradesArray.length - 1) { newOrder = slots.next }
    return (
      <Grade
        key={grade.id}
        grade={grade}
        levels={levels}
        grades={grades}
        slots={slots}
      />
    )
  })
  return (
    <div className="Gradelist">
      {gradesNode}
      <CreateGradeForm
        levels={levels}
        grades={grades}
        newOrder={newOrder}
      />
    </div>
  )
}

Gradelist.propTypes = {
  grades: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired
  })).isRequired,
  levels: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default Gradelist
