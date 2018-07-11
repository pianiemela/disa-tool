import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header, Button, Icon } from 'semantic-ui-react'
import './header.css'

import { setEditing } from '../../services/course'

export class CourseHeader extends Component {
  setEditing = value => () => {
    this.props.setEditing({
      value
    })
  }

  render() {
    return (
      <div className="CourseHeader">
        <Segment className="headerContainer">
          <div className="headerBlock">
            <Header>
              {this.props.courseName}
            </Header>
          </div>
          <div className="editBlock">
            <Button onClick={this.setEditing(!this.props.editing)}>
              <Icon name="cog" />
              <span>{this.props.editing ? 'Lopeta muokkaaminen' : 'Muokkaa'}</span>
            </Button>
          </div>
        </Segment>
      </div>
    )
  }
}

CourseHeader.propTypes = {
  courseName: PropTypes.string.isRequired,
  editing: PropTypes.bool.isRequired,
  setEditing: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  setEditing: setEditing(dispatch)
})

export default connect(null, mapDispatchToProps)(CourseHeader)
