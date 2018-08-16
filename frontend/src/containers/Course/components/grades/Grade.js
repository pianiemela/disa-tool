import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Header, Grid } from 'semantic-ui-react'

const parseName = object => (object ? object.name : null)

const Grade = props => (
  <div className="Grade">
    <Segment>
      <Header>{props.grade.name}</Header>
      <Grid columns={3}>
        <Grid.Row>
          <Grid.Column>
            <p>
              <span>Oppimistaso</span>
              <span>: </span>
              <strong>
                {parseName(props.levels.find(level => level.id === props.grade.skill_level_id))}
              </strong>
            </p>
          </Grid.Column>
          <Grid.Column>
            <p>
              <span>Vaadittu suoritus</span>
              <span>: </span>
              <strong>{props.grade.needed_for_grade * 100}%</strong>
            </p>
          </Grid.Column>
          <Grid.Column>
            <p>
              <span>Esivaatimus</span>
              <span>: </span>
              <strong>
                {parseName(props.grades.find(grade => grade.id === props.grade.prerequisite))}
              </strong>
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  </div>
)

Grade.propTypes = {
  grade: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    skill_level_id: PropTypes.number.isRequired,
    needed_for_grade: PropTypes.number.isRequired,
    prerequisite: PropTypes.number
  }).isRequired,
  levels: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  grades: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired
}

export default Grade
