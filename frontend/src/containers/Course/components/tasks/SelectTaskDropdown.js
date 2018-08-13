import React from 'react'
import PropTypes from 'prop-types'
import { Header, Dropdown, Button, Popup, Input, Container } from 'semantic-ui-react'

const SelectTaskDropdown = props => (
  <Container>
    <Header as="h2">
      <Dropdown
        fluid
        options={props.tasks.map(task => ({
          key: task.id,
          text: task.name,
          value: task.id
        }))}
        placeholder="Valitse tehtävä tästä"
        scrolling
        search
        selectOnBlur={false}
        value={props.activeTask ? props.activeTask.id : null}
        onChange={props.changeActive}
      />
      <Header.Subheader>Kerroin:
        {props.activeTask ?
          <Popup
            content={<div><Input action type="number" value={props.activeTask.defaultMultiplier}><input /><Button content="päivitä" /></Input></div>}
            trigger={<Button
              basic
              content={props.activeTask.defaultMultiplier.toFixed(2)}
            />}
            on="click"
          />
          : undefined}
      </Header.Subheader>
    </Header>
  </Container>
)

SelectTaskDropdown.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  activeTask: PropTypes.shape({
    id: PropTypes.number.isRequired,
    defaultMultiplier: PropTypes.number
  }),
  changeActive: PropTypes.func.isRequired
}

SelectTaskDropdown.defaultProps = {
  activeTask: null
}

export default SelectTaskDropdown
