import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header, Grid } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeGrade } from '../../actions/grades'

import DeleteForm from '../../../../utils/components/DeleteForm'
import EditGradeForm from './EditGradeForm'

const parseName = object => (object ? object.name : null)

const Grade = props => (
  <div className="Grade">
    <Segment>
      <Header>{props.grade.name}</Header>
      <Grid columns={4}>
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
          <Grid.Column>
            <DeleteForm
              onExecute={() => props.removeGrade({ id: props.grade.id })}
              header="Poista arvosteluperuste"
              prompt={[
                'Poistetaanko arvosteluperuste',
                props.grade.name
              ]}
            />
            <EditGradeForm
              gradeId={props.grade.id}
              grades={props.grades.filter(grade => grade.id !== props.grade.id)}
              levels={props.levels}
            />
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
  })).isRequired,
  removeGrade: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  removeGrade: asyncAction(removeGrade, dispatch)
})

export default connect(null, mapDispatchToProps)(Grade)
