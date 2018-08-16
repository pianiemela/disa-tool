import React from 'react'
import PropTypes from 'prop-types'
import { Header, Dropdown, Container } from 'semantic-ui-react'

const SelectTaskDropdown = props => (
  <Container>
    <Header as="h2">
      <Dropdown
        fluid
        options={[{ key: 0, text: '', value: null }].concat(props.tasks.map(task => ({
          key: task.id,
          text: task.name,
          value: task.id
        })))}
        placeholder="Valitse tehtävä tästä"
        scrolling
        search
        selectOnBlur={false}
        value={props.activeTask ? props.activeTask.id : null}
        onChange={props.changeActive}
      />
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
