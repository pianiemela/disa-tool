import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Input, Modal, Label } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'
import './matrix.css'

import { addObjective } from '../../services/objectives'

class AddObjectiveForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  expand = e => {
    this.setState({
      expanded: true
    })
  }

  collapse = e => {
    this.setState({
      expanded: false
    })
  }

  addObjectiveSubmit = e => {
    e.preventDefault()
    this.props.addObjective({
      name: e.target.name.value
    })
    this.setState({
      expanded: false
    })
  }

  render() {
    return (
      <div className="addObjectiveForm">
        <Modal
          trigger={<Button onClick={this.expand} className="addObjectiveButton" icon={{ name: 'add' }} />}
          open={this.state.expanded}
          onClose={this.collapse}
        >
        <Modal.Header>placeholder data</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.addObjectiveSubmit}>
            <Form.Field>
              <Label>name</Label>
              <Input name="name" type="text" fluid />
            </Form.Field>
            <Button type="submit">Tallenna</Button>
          </Form>
        </Modal.Content>
        </Modal>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addObjective: asyncAction(addObjective, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(AddObjectiveForm)