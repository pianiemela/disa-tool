import React from 'react'
import PropTypes from 'prop-types'

import Matrix from './Matrix'

const EditMatrixTab = props => (
  <div className="EditMatrixTab">
    <Matrix courseId={props.courseId} editing />
  </div>
)

EditMatrixTab.propTypes = {
  courseId: PropTypes.number.isRequired
}

export default EditMatrixTab
