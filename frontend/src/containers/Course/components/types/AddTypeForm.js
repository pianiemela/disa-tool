import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, Form, Label, Input } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'
import './types.css'

import { addType } from '../../services/types'

class AddTypeForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  expand = () => {
    this.setState({
      expanded: true
    })
  }

  collapse = () => {
    this.setState({
      expanded: false
    })
  }

  addTypeSubmit = (e) => {
    e.preventDefault()
    this.props.addType({
      courseId: this.props.courseId,
      name: e.target.name.value
    })
    this.collapse(null)
  }

  render() {
    return (
      <div className="addTypeForm">
        <Modal
          trigger={<Button onClick={this.expand} className="addTypeButton" icon={{ name: 'add' }} />}
          open={this.state.expanded}
          onClose={this.collapse}
        >
          <Modal.Header>placeholder data</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.addTypeSubmit}>
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

const mapStateToProps = (state, ownProps) => ({
  ...ownProps
})

const mapDispatchToProps = dispatch => ({
  addType: asyncAction(addType, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AddTypeForm)
