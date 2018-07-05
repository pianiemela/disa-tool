import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table, List } from 'semantic-ui-react'

import CreateObjectiveForm from './CreateObjectiveForm'

const Matrix = props => (
  <Table className="matrix" celled structured>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell rowSpan="2">Osio</Table.HeaderCell>
        <Table.HeaderCell colSpan="3" textAlign="center">Taitotasot</Table.HeaderCell>
      </Table.Row>
      <Table.Row>
        {props.levels.map(level => (
          <Table.HeaderCell key={level.id} textAlign="center">{level.name}</Table.HeaderCell>
        ))}
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {props.categories.map(category => (
        <Table.Row key={category.id}>
          <Table.Cell>{category.name}</Table.Cell>
          {category.skill_levels.map(level => (
            <Table.Cell textAlign="center" key={level.id}>
              <List selection>
                {level.objectives.map(objective => (
                  <List.Item key={objective.id}>{objective.name}</List.Item>
                ))}
              </List>
              {props.editing ? (<CreateObjectiveForm />) : (<div />)}
            </Table.Cell>
          ))}
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
)

Matrix.propTypes = {
  levels: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired
  })).isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    skill_levels: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      objectives: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string.isRequired
      })).isRequired
    })).isRequired
  })).isRequired
}

const mapStateToProps = state => (
  {
    categories: state.category.categories,
    levels: state.level.levels
  }
)

export default connect(mapStateToProps, null)(Matrix)
