import React from 'react'
import PropTypes from 'prop-types'

import Grade from './Grade'

const Gradelist = props => (
  <div className="Gradelist">
    {props.grades.map(grade => (
      <Grade
        key={grade.id}
        grade={grade}
        levels={props.levels}
      />
    ))}
  </div>
)

Gradelist.propTypes = {
  grades: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired
  })).isRequired,
  levels: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default Gradelist
