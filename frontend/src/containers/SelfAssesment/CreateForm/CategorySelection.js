import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import PropTypes from 'prop-types'

const CategorySelection = (props) => {
  const { selectedView, category, objectives, toggleButton, createForm } = props
  return (
    <Form
      onSubmit={createForm}
      style={{ padding: '20px' }}
    >
      <Form.Field>
        <div>
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
        </div>
      </Form.Field>
      <Form.Button style={{}} type="submit">
        Luo
      </Form.Button>
    </Form>)
}

CategorySelection.propTypes = {
  selectedView: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  objectives: PropTypes.string.isRequired,
  toggleButton: PropTypes.func.isRequired,
  createForm: PropTypes.func.isRequired
}

export default CategorySelection
