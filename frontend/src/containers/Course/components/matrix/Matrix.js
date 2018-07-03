import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, List } from 'semantic-ui-react'

import AddCategoryForm from './AddCategoryForm'

class Matrix extends Component {
  render() {
    return (
      <Table className="matrix" celled structured>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell rowSpan="2">Osio</Table.HeaderCell>
            <Table.HeaderCell colSpan="3" textAlign="center">Taitotasot</Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            {this.props.levels.map(level => (
              <Table.HeaderCell key={level.id} textAlign="center">{level.name}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {Object.keys(this.props.categories).map(part => (
            <Table.Row key={part}>
              <Table.Cell>{part}</Table.Cell>
              {this.props.levels.map(level => (
                <Table.Cell textAlign="center" key={level.id}>
                  <List selection>
                    {this.props.categories[part][level.id].map(skill => (
                      <List.Item key={skill}>{skill}</List.Item>
                    ))}
                  </List>
                  {this.props.editing ? (<AddCategoryForm />) : (<div />)}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }
}

const mapStateToProps = state => {
  return {
    categories: state.category.categories,
    levels: state.level.levels
  }
}

export default connect(mapStateToProps, null)(Matrix)