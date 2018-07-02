import React, { Component } from 'react'
import { Table, List } from 'semantic-ui-react'

class Matrix extends Component {
  render() {
    return (
      <Table celled structured>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell rowSpan="2">Osio</Table.HeaderCell>
            <Table.HeaderCell colSpan="3" textAlign="center">Taitotasot</Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            {this.props.skillLevels.map(level => (
              <Table.HeaderCell textAlign="right">{level}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {Object.keys(this.props.courseParts).map(part => (
            <Table.Row>
              <Table.Cell>{part}</Table.Cell>
              {this.props.skillLevels.map(level => (
                <Table.Cell>
                  <List selection>
                    {this.props.courseParts[part][level].map(skill => (
                      <List.Item>{skill}</List.Item>
                    ))}
                  </List>
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }
}

export default Matrix