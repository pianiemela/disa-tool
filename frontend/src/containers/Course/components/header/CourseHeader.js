import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header } from 'semantic-ui-react'
import './header.css'

export const CourseHeader = props => (
  <div className="CourseHeader">
    <Segment className="headerContainer">
      <Header>
        {props.courseName}
      </Header>
    </Segment>
  </div>
)

CourseHeader.propTypes = {
  courseName: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  courseName: state.course.course.name
})

export default connect(mapStateToProps, null)(CourseHeader)
