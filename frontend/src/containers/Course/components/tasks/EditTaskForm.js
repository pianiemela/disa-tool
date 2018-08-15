import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Grid, Form, Input, Label } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { editTask } from '../../actions/tasks'
import { details } from '../../../../api/tasks'

import ModalForm from '../../../../utils/components/ModalForm'
import MultilingualField from '../../../../utils/components/MultilingualField'

export class EditTaskForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {
        name: {
          eng: '',
          fin: '',
          swe: ''
        },
        description: {
          eng: '',
          fin: '',
          swe: ''
        },
        info: ''
      },
      loading: true
    }
  }

  editTaskSubmit = (e) => {
    this.props.editTask({
      id: this.props.taskId,
      eng_name: e.target.eng_name.value,
      fin_name: e.target.fin_name.value,
      swe_name: e.target.swe_name.value,
      eng_description: e.target.eng_description.value,
      fin_description: e.target.fin_description.value,
      swe_description: e.target.swe_description.value,
      info: e.target.info.value
    })
  }

  loadDetails = async () => {
    const taskDetails = (await this.props.details({
      id: this.props.taskId
    })).data.data
    this.setState({
      values: {
        name: {
          eng: taskDetails.eng_name,
          fin: taskDetails.fin_name,
          swe: taskDetails.swe_name
        },
        description: {
          eng: taskDetails.eng_description,
          fin: taskDetails.fin_description,
          swe: taskDetails.swe_description
        },
        info: taskDetails.info
      },
      loading: false
    })
  }

  render() {
    const contentPrompt = 'Muokkaa tehtävää'
    const label = {
      name: 'nimi',
      description: 'kuvaus',
      info: 'info'
    }
    return (
      <Grid.Row>
        <Grid.Column>
          <div className="EditTaskForm">
            <ModalForm
              header="Muokkaa tehtävää"
              trigger={<Button
                className="editTaskButton"
                content="Muokkaa tehtävää"
                onClick={this.loadDetails}
              />}
              content={
                <div>
                  <p>
                    {contentPrompt}.
                  </p>
                  <MultilingualField field="name" fieldDisplay={label.name} values={this.state.values.name} />
                  <MultilingualField field="description" fieldDisplay={label.description} values={this.state.values.description} />
                  <Form.Field>
                    <Label>{label.info}</Label>
                    <Input
                      name="info"
                      type="text"
                      value={this.state.values.info}
                      onChange={e => this.setState({
                        values: { ...this.state.values, info: e.target.value }
                      })}
                    />
                  </Form.Field>
                  <Button type="submit" color="green">Tallenna</Button>
                </div>
              }
              onSubmit={this.editTaskSubmit}
              loading={this.state.loading}
            />
          </div>
        </Grid.Column>
      </Grid.Row>
    )
  }
}

EditTaskForm.propTypes = {
  taskId: PropTypes.number.isRequired,
  editTask: PropTypes.func.isRequired,
  details: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  editTask: asyncAction(editTask, dispatch),
  details
})

export default connect(null, mapDispatchToProps)(EditTaskForm)
