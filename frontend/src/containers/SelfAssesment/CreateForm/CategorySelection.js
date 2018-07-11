import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import PropTypes from 'prop-types'

const CategorySelection = (props) => {
  const { selectedView, category, objectives, toggleButton } = props
  return (
    <div>
      <Form.Field>
        <Button
          size="tiny"
          type="button"
          value={category}
          active={category === selectedView}
          toggle
          onClick={toggleButton}
        >
          Itsearviolomake kategorioiden pohjalta
        </Button>
        <Button
          size="tiny"
          type="button"
          value={objectives}
          active={objectives === selectedView}
          toggle
          onClick={toggleButton}
        >
          Itsearviolomake tavoitteiden pohjalta
        </Button>
      </Form.Field>
      <Form.Field>
        <Button style={{ marginTop: '25px', marginLeft: '220px' }} type="submit">
          Luo
        </Button>
      </Form.Field>

    </div>
  )
}

CategorySelection.propTypes = {
  selectedView: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  objectives: PropTypes.string.isRequired,
  toggleButton: PropTypes.func.isRequired,
  createForm: PropTypes.func.isRequired
}

export default CategorySelection
