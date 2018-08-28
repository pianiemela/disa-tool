import React from 'react'
import PropTypes from 'prop-types'
import { Input, Form } from 'semantic-ui-react'

const MultiLangInput = (props) => {
  const { headers, handleChange, handleBlur } = props
  const display = name =>
    (
      <p
        style={{
          width: '100px',
          padding: '10px',
          paddingLeft: '5px',
          background: '#e0e1e2',
          borderRadius: '2.5px 0 0 2.5px'
        }}
      >
        {name}
      </p>
    )

  return (
    <div style={{ paddingTop: '10px' }}>
      {headers.map(h => (
        <Form.Field key={h.id}>
          <Input
            label={display(h.prefix)}
            onChange={handleChange ? e => handleChange(h.id, e.target.value) : null}
            onBlur={handleBlur ? e => handleBlur(h.id, e.target.value) : null}
            defaultValue={h.value}
          />
        </Form.Field>
      ))
      }
    </div>
  )
}

MultiLangInput.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    displayName: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func
}

MultiLangInput.defaultProps = {
  handleBlur: undefined
}

export default MultiLangInput
