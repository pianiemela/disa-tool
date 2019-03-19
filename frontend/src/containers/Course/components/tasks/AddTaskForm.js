import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button, Grid, Form, Input, Label } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addTask } from '../../actions/tasks'

import ModalForm, { saveActions } from '../../../../utils/components/ModalForm'
import MultilingualField from '../../../../utils/components/MultilingualField'
import { getCourseInstanceDataAction } from '../../../../actions/actions'

export class AddTaskForm extends Component {
  addTaskSubmit = (e) => {
    this.props.addTask({
      eng_name: e.target.eng_name.value,
      fin_name: e.target.fin_name.value,
      swe_name: e.target.swe_name.value,
      eng_description: e.target.eng_description.value,
      fin_description: e.target.fin_description.value,
      swe_description: e.target.swe_description.value,
      info: e.target.info.value,
      max_points: e.target.points.value,
      course_instance_id: this.props.courseId,
      order: this.props.newOrder
    }).then(() => this.props.updateCourseInfo(this.props.courseId))
  }

  translate = id => this.props.translate(`Course.tasks.AddTaskForm.${id}`)

  render() {
    const contentPrompt = this.translate('prompt_1')
    const label = {
      name: this.translate('name'),
      description: this.translate('description'),
      info: 'info',
      maxPoints: 'max points'
    }
    return (
      <Grid.Row>
        <Grid.Column>
          <div className="AddTaskForm">
            <ModalForm
              header={this.translate('header')}
              trigger={<Button basic className="addTaskButton" icon={{ name: 'add' }} />}
              actions={saveActions(this.translate)}
              onSubmit={this.addTaskSubmit}
            >
              <p>{contentPrompt}.</p>
              <MultilingualField required field="name" fieldDisplay={label.name} />
              <MultilingualField field="description" fieldDisplay={label.description} />
              <Form.Field>
                <Label>{label.info}</Label>
                <Input name="info" type="text" />
              </Form.Field>
              <Form.Field>
                <Label>{label.maxPoints}</Label>
                <Form.Input required name="points" type="number" />
              </Form.Field>
            </ModalForm>
          </div>
        </Grid.Column>
      </Grid.Row>
    )
  }
}

AddTaskForm.propTypes = {
  courseId: PropTypes.number.isRequired,
  addTask: PropTypes.func.isRequired,
  updateCourseInfo: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  newOrder: PropTypes.number.isRequired
}

const mapDispatchToProps = dispatch => ({
  addTask: asyncAction(addTask, dispatch),
  updateCourseInfo: courseId => dispatch(getCourseInstanceDataAction(courseId))
})

export default withLocalize(connect(null, mapDispatchToProps)(AddTaskForm))
