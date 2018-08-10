import React from 'react'
import { number, shape, string } from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Segment, Header } from 'semantic-ui-react'
import './header.css'

export const CourseHeader = props => (
  <div className="CourseHeader">
    <Segment>
      <Header as="h1" textAlign="center">
        <Button
          as={Link}
          to={`/user/course/${props.course.id}`}
          basic
          color="blue"
          floated="left"
          icon="backward"
          content="Takaisin kurssisivulle"
        />
        {props.course.name}
      </Header>
    </Segment>
  </div>
)

CourseHeader.propTypes = {
  course: shape({
    id: number.isRequired,
    name: string.isRequired
  }).isRequired
}

const mapStateToProps = state => ({
  course: state.course.course
})

export default connect(mapStateToProps, null)(CourseHeader)
