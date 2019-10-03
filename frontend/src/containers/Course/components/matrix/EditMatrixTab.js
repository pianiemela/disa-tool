import React from 'react'
import PropTypes from 'prop-types'
import { Container, Segment } from 'semantic-ui-react'

import Matrix from './Matrix'
import InfoBox from '../../../../utils/components/InfoBox'

const EditMatrixTab = props => (
  <div className="EditMatrixTab">
    <Container>
      <Segment clearing basic>
        <InfoBox translationid="EditMatrixPage" buttonProps={{ floated: 'right' }} />
      </Segment>
    </Container>
    <Matrix courseId={props.courseId} editing />
  </div>
)

EditMatrixTab.propTypes = {
  courseId: PropTypes.number.isRequired
}

export default EditMatrixTab
