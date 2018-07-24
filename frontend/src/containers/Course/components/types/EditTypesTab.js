import React from 'react'
import PropTypes from 'prop-types'

import Typelist from './Typelist'

const EditTypesTab = props => (
  <div className="EditTypesTab">
    <Typelist courseId={props.courseId} editing />
  </div>
)

EditTypesTab.propTypes = {
  courseId: PropTypes.number.isRequired
}

export default EditTypesTab
