import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Input } from 'semantic-ui-react'
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

  toggleExpanded = e => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  addObjectiveSubmit = e => {
    e.preventDefault()
    this.props.addObjective({
      name: e.target.objective.value
    })
    this.setState({
      expanded: false
    })
  }

  renderContent() {
    if (this.state.expanded) {
      return (
        <div>
          <div className="expandedContent">
            <Form.Field inline>
              <Button type="submit" icon={{ name:"add", color:"green" }} />
              <Input className="textInput" type="text" name="objective" />
              <Button className="closeButton" icon={{ name: 'window minimize' }} type="button" onClick={this.toggleExpanded} />
            </Form.Field>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <Button className="openButton" icon={{ name: 'add' }} type="button" onClick={this.toggleExpanded} />
        </div>
      )
    }
  }

  render() {
    return (
      <Form className="addSkillForm" onSubmit={this.addObjectiveSubmit}>
        {this.renderContent()}
      </Form>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addObjective: asyncAction(addObjective, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(AddObjectiveForm)