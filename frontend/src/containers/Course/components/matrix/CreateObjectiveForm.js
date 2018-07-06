import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Button, Input, Label } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addObjective } from '../../services/objectives'

import ModalForm from '../../../../utils/components/ModalForm'

class AddObjectiveForm extends Component {
    addObjectiveSubmit = (e) => {
      this.props.addObjective({
        name: e.target.name.value
      })
    }

    render() {
      return (
        <div className="addObjectiveForm">
          <ModalForm
            header="placeholder text"
            trigger={<Button onClick={this.expand} className="addObjectiveButton" icon={{ name: 'add' }} />}
            content={
              <div>
                <Form.Field>
                  <Label>name</Label>
                  <Input name="name" type="text" fluid />
                </Form.Field>
                <Button type="submit">Tallenna</Button>
              </div>
            }
            onSubmit={this.addObjectiveSubmit}
          />
        </div>
      )
    }
}

AddObjectiveForm.propTypes = {
  addObjective: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => (
  {
    addObjective: asyncAction(addObjective, dispatch)
  }
)

export default connect(null, mapDispatchToProps)(AddObjectiveForm)
