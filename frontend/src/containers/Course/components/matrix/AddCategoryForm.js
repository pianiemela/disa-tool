import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Input } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'
import './matrix.css'

import { addCategory } from '../../services/categories'

class AddCategoryForm extends Component {
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

  addCategorySubmit = e => {
    e.preventDefault()
    this.props.addCategory({
      name: e.target.category.value
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
              <Input className="textInput" type="text" name="category" />
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
      <Form className="addSkillForm" onSubmit={this.addCategorySubmit}>
        {this.renderContent()}
      </Form>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addCategory: asyncAction(addCategory, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(AddCategoryForm)