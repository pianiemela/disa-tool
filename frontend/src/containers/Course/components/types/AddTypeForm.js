import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Form, Label, Input } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addType } from '../../services/types'

import ModalForm from '../../../../utils/components/ModalForm'

class AddTypeForm extends Component {
  addTypeSubmit = (e) => {
    this.props.addType({
      courseId: this.props.courseId,
      name: e.target.name.value
    })
  }

  render() {
    return (
      <div className="addTypeForm">
        <ModalForm
          header="placeholder data"
          trigger={<Button onClick={this.expand} className="addTypeButton" icon={{ name: 'add' }} />}
          content={
            <div>
              <Form.Field>
                <Label>name</Label>
                <Input name="name" type="text" fluid />
              </Form.Field>
              <Button type="submit">Tallenna</Button>
            </div>
          }
          onSubmit={this.addTypeSubmit}
        />
      </div>
    )
  }
}

AddTypeForm.propTypes = {
  addType: PropTypes.func.isRequired,
  courseId: PropTypes.number.isRequired
}

const mapDispatchToProps = dispatch => ({
  addType: asyncAction(addType, dispatch)
})

export default connect(null, mapDispatchToProps)(AddTypeForm)
