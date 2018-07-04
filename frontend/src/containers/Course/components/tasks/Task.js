import React, { Component } from 'react'
import { Grid, Button, Dropdown } from 'semantic-ui-react'
import './tasks.css'

import SkillSlider from './SkillSlider'
import AddSkillForm from './AddSkillForm'

class Task extends Component {
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

  renderExpanded() {
    if (!this.state.expanded) {
      return <div />
    }
    const includedSkills = []
    const excludedSkills = []
    this.props.skills.forEach(skill => {
      if (this.props.task.skills.indexOf(skill.id) === -1) {
        excludedSkills.push(skill)
      } else {
        includedSkills.push(skill)
      }
    })
    return (
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column>
            <h3>{this.props.task.name}</h3>
            <h4>{this.props.task.description}</h4>
            <p>{this.props.task.info}</p>
          </Grid.Column>
        </Grid.Row>
        {includedSkills.map(skill => (
          <SkillSlider key={skill.name} skill={skill} />
        ))}
        {this.props.editing ? (<AddSkillForm skills={excludedSkills} task={this.props.task.id} />) : (<div />)}
      </Grid>
    )
  }

  render() {
    return (
      <div className="task">
        <Button onClick={this.toggleExpanded} basic={!this.state.expanded} fluid>{this.props.task.name}</Button>
        {this.renderExpanded()}
      </div>
    )
  }
}

export default Task