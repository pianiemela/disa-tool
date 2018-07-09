import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header, Button, Icon } from 'semantic-ui-react'
import './header.css'

import { setEditing } from '../../services/course'

const CourseHeader = props => (
  <div className="CourseHeader">
    <Segment className="headerContainer">
      <div className="headerBlock">
        <Header>
          {props.courseName}
        </Header>
      </div>
      <div className="editBlock">
        <Button>
          <Icon name="cog" />
          <span>Edit</span>
        </Button>
      </div>
    </Segment>
  </div>
)

CourseHeader.propTypes = {
  courseName: PropTypes.string.isRequired,
  editing: PropTypes.bool
}

CourseHeader.defaultProps = {
  editing: false
}

const mapDispatchToProps = dispatch => ({
  setEditing: setEditing(dispatch)
})

export default connect(null, mapDispatchToProps)(CourseHeader)
