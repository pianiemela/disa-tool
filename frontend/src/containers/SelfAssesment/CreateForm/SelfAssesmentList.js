import React from 'react'
import { List, Popup } from 'semantic-ui-react'

const SelfAssesmentList = (props) => {
  const { selfAssesments, onClick } = props
  const visible = selfAssesments.length > 0

  if (visible) {
    return (
      <List animated selection>
        <List.Item>
          <List.Header>Selfassesments of selected course - click item - to edit</List.Header>
        </List.Item>
        {selfAssesments.map(sa => (
          <List.Item
            key={sa.id}
            onClick={() => onClick('edit', sa.id)}
          >
            {sa.name}
          </List.Item>
        ))}
      </List>
    )
  }
  return (
    ''
  )
}

export default SelfAssesmentList
