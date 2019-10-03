import React from 'react'
import PropTypes from 'prop-types'
import { Container, Segment } from 'semantic-ui-react'

import Headerlist from './Headerlist'
import InfoBox from '../../../../utils/components/InfoBox'

const EditTypesTab = props => (
  <div className="EditTypesTab">
    <Container>
      <Segment clearing basic>
        <InfoBox translationid="EditTypesPage" buttonProps={{ floated: 'right' }} />
      </Segment>
    </Container>
    <Headerlist courseId={props.courseId} editing />
  </div>
)

EditTypesTab.propTypes = {
  courseId: PropTypes.number.isRequired
}

export default EditTypesTab
