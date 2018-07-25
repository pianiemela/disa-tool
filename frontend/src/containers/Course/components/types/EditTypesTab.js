import React from 'react'
import PropTypes from 'prop-types'

import Headerlist from './Headerlist'

const EditTypesTab = props => (
  <div className="EditTypesTab">
    <Headerlist courseId={props.courseId} editing />
  </div>
)

EditTypesTab.propTypes = {
  courseId: PropTypes.number.isRequired
}

export default EditTypesTab
