import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Segment, Header, Grid } from 'semantic-ui-react'

import asyncAction from '../../../../utils/asyncAction'
import { removeGrade, editGrade } from '../../actions/grades'
import DeleteForm from '../../../../utils/components/DeleteForm'
import EditGradeForm from './EditGradeForm'
import dndItem from '../../../../utils/components/DnDItem'

const DnDItem = dndItem('grade')

const parseName = object => (object ? object.name : null)

const Grade = (props) => {
  const translate = id => props.translate(`Course.grades.Grade.${id}`)
  return (
    <DnDItem
      element={props.grade}
      mover={props.moveGrade}
      slots={props.slots}
    >
      <div className="Grade">
        <Segment>
          <Header>{props.grade.name}</Header>
          <Grid columns={4}>
            <Grid.Row>
              <Grid.Column width={5}>
                <p>
                  <span>{translate('skill_level')}</span>
                  <span>: </span>
                  <strong>
                    {parseName(props.levels.find(level => level.id === props.grade.skill_level_id))}
                  </strong>
                </p>
              </Grid.Column>
              <Grid.Column width={4}>
                <p>
                  <span>{translate('needed_for_grade')}</span>
                  <span>: </span>
                  <strong>{props.grade.needed_for_grade * 100}%</strong>
                </p>
              </Grid.Column>
              <Grid.Column width={5}>
                <p>
                  <span>{translate('prerequisite')}</span>
                  <span>: </span>
                  <strong>
                    {parseName(props.grades.find(grade => grade.id === props.grade.prerequisite))}
                  </strong>
                </p>
              </Grid.Column>
              <Grid.Column width={2}>
                <div className="flexContainer">
                  <div className="flexBlock">
                    <DeleteForm
                      onExecute={() => props.removeGrade({ id: props.grade.id })}
                      header={translate('delete_header')}
                      prompt={[
                        translate('delete_prompt_1'),
                        props.grade.name
                      ]}
                    />
                  </div>
                  <div className="flexBlock">
                    <EditGradeForm
                      gradeId={props.grade.id}
                      grades={props.grades.filter(grade => grade.id !== props.grade.id)}
                      levels={props.levels}
                    />
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    </DnDItem>
  )
}

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
  removeGrade: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  moveGrade: PropTypes.func.isRequired,
  slots: PropTypes.shape({
    previous: PropTypes.number.isRequired,
    next: PropTypes.number.isRequired
  }).isRequired
}

const mapDispatchToProps = dispatch => ({
  removeGrade: asyncAction(removeGrade, dispatch),
  moveGrade: asyncAction(editGrade, dispatch)
})

export default withLocalize(connect(null, mapDispatchToProps)(Grade))
