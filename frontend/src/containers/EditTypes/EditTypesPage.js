import React from 'react'
import PropTypes from 'prop-types'

import Typelist from './components/types/Typelist'

const EditTypesPage = props => (
  <div className="EditTypesPage">
    <Typelist courseId={props.courseId} editing />
  </div>
)

EditTypesPage.propTypes = {
  courseId: PropTypes.number.isRequired
}

export default EditTypesPage
