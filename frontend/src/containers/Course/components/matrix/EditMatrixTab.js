import React from 'react'
import PropTypes from 'prop-types'

import Matrix from './Matrix'

const EditMatrixTab = props => (
  <div>
    <Matrix courseId={props.courseId} editing />
  </div>
)

EditMatrixTab.propTypes = {
  courseId: PropTypes.number.isRequired
}

export default EditMatrixTab
