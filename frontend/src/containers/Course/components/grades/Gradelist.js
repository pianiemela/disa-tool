import React from 'react'
import PropTypes from 'prop-types'

import Grade from './Grade'
import CreateGradeForm from './CreateGradeForm'

const Gradelist = (props) => {
  const levels = props.levels.sort((a, b) => a.order - b.order)
  const grades = props.grades.sort((a, b) => a.order - b.order)
  let newOrder = 1
  if (grades.length > 0) {
    newOrder = grades[grades.length - 1].order + 1
  }
  return (
    <div className="Gradelist">
      {grades.map(grade => (
        <Grade
          key={grade.id}
          grade={grade}
          levels={levels}
          grades={grades}
        />
      ))}
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
