import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Grid } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addTask } from '../../services/tasks'

import ModalForm from '../../../../utils/components/ModalForm'
import MultilingualField from '../../../../utils/components/MultilingualField'

export class AddTaskForm extends Component {
  addTaskSubmit = (e) => {
    this.props.addTask({
      eng_name: e.target.eng_name.value,
      fin_name: e.target.fin_name.value,
      swe_name: e.target.swe_name.value,
      courseId: this.props.courseId
    })
  }

  render() {
    const contentPrompt = 'Lisää uusi tehtävä kurssille'
    const label = 'tehtävä'
    return (
      <Grid.Row>
        <Grid.Column>
          <div className="AddTaskForm">
            <ModalForm
              header="Lisää uusi tehtävä"
              trigger={<Button className="addTaskButton" icon={{ name: 'add' }} />}
              content={
                <div>
                  <p>
                    {contentPrompt}.
                  </p>
                  <MultilingualField field="name" fieldDisplay={label} />
                  <Button type="submit" color="green">Tallenna</Button>
                </div>
              }
              onSubmit={this.addTaskSubmit}
            />
          </div>
        </Grid.Column>
      </Grid.Row>
    )
  }
}

AddTaskForm.propTypes = {
  courseId: PropTypes.number.isRequired,
  addTask: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  addTask: asyncAction(addTask, dispatch)
})

export default connect(null, mapDispatchToProps)(AddTaskForm)
