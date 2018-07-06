import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Input, Label, Grid } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addTask } from '../../services/tasks'

import ModalForm from '../../../../utils/components/ModalForm'

class AddTaskForm extends Component {
  addTaskSubmit = (e) => {
    this.props.addTask({
      name: e.target.name.value
    })
  }

  render() {
    return (
      <Grid.Row>
        <Grid.Column>
          <div className="AddTaskForm">
            <ModalForm
              header="placeholder content"
              trigger={<Button className="addTaskButton" icon={{ name: 'add' }} />}
              content={
                <div>
                  <Form.Field>
                    <Label>task</Label>
                    <Input type="text" name="name" fluid />
                  </Form.Field>
                  <Button type="submit">Tallenna</Button>
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

const mapDispatchToProps = dispatch => ({
  addTask: asyncAction(addTask, dispatch)
})

export default connect(null, mapDispatchToProps)(AddTaskForm)
