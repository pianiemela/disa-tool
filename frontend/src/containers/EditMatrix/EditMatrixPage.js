import React from 'react'
import PropTypes from 'prop-types'

import Matrix from './components/matrix/Matrix'

const EditMatrixPage = props => (
  <div>
    <Matrix courseId={props.courseId} editing />
  </div>
)

EditMatrixPage.propTypes = {
  courseId: PropTypes.number.isRequired
}

export default EditMatrixPage
