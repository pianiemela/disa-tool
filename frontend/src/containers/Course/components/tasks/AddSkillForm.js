import React, { Component } from 'react'
import { Form, Button, Dropdown } from 'semantic-ui-react'
import './tasks.css'

import { addSkillToTask } from '../../services/tasks.js'

class AddSkillForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      skillSelection: undefined
    }
  }

  toggleExpanded = e => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  changeSkillSelection = (e, {value}) => {
    this.setState({
      skillSelection: value
    })
  }

  addSkillSubmit = e => {
    e.preventDefault()
    addSkillToTask({
      taskId: this.props.task,
      skillId: this.state.skillSelection
    }).then(response => {
      console.log(response)
    })
    this.setState({
      expanded: false
    })
  }

  renderContent() {
    if (this.state.expanded) {
      const options = this.props.skills.map(skill => {
        return {
          value: skill.id,
          text: skill.name
        }
      })
      return (
        <div>
          <Button icon={{ name: 'window minimize', size: 'large' }} type="button" onClick={this.toggleExpanded} />
          <div className="expandedContent">
            <Form.Field>
              <Button type="submit" icon={{ name:"add", color:"green" }} />
              <Dropdown name="skill" className="skillDropdown" options={options} selection value={this.state.skillSelection} onChange={this.changeSkillSelection} />
            </Form.Field>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <Button icon={{ name: 'add', size: 'large' }} type="button" onClick={this.toggleExpanded} />
        </div>
      )
    }
  }

  render() {
    return (
      <Grid.Row>
        <Grid.Column textAlign="right">
          <Form className="addSkillForm" onSubmit={this.addSkillSubmit}>
            {this.renderContent()}
          </Form>
        </Grid.Column>
      </Grid.Row>
    )
  }
}

export default AddSkillForm