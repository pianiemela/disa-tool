import React from 'react'
import { shape, bool, func, number } from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Table, Header, Segment } from 'semantic-ui-react'

import asyncAction from '../../../../utils/asyncAction'
import { removeLevel, editLevel } from '../../actions/levels'
import DeleteForm from '../../../../utils/components/DeleteForm'
import EditLevelForm from './EditLevelForm'
import dndItem from '../../../../utils/components/DnDItem'

const DnDItem = dndItem('skill_level')

const HeaderLevel = (props) => {
  const translate = id => props.translate(`Course.matrix.HeaderLevel.${id}`)
  const { level, editing, moveLevel, slots } = props
  const cellContent = (
    <div className="flexContainer">
      <div className="flexGrower">
        <Header>{level.name}</Header>
      </div>
      {editing ? (
        <div className="flexContainer">
          <div className="paddedBlock">
            <EditLevelForm levelId={level.id} />
          </div>
          <div className="paddedBlock">
            <DeleteForm
              onExecute={() => props.removeLevel({ id: level.id })}
              prompt={[
                translate('delete_prompt_1'),
                `"${level.name}"`
              ]}
              header={translate('delete_header')}
            />
          </div>
        </div>
      ) : (
          null
        )}
    </div>
  )
  return (
    <Table.HeaderCell key={level.id} textAlign="center">
      {editing ? (
        <DnDItem
          element={level}
          mover={moveLevel}
          slots={slots}
        >
          <Segment>
            {cellContent}
          </Segment>
        </DnDItem>
      ) : cellContent}
    </Table.HeaderCell>
  )
}

HeaderLevel.propTypes = {
  level: shape({}).isRequired,
  editing: bool.isRequired,
  removeLevel: func.isRequired,
  translate: func.isRequired,
  moveLevel: func.isRequired,
  slots: shape({
    previous: number.isRequired,
    next: number.isRequired
  }).isRequired
}

const mapDispatchToProps = dispatch => ({
  removeLevel: asyncAction(removeLevel, dispatch),
  moveLevel: asyncAction(editLevel, dispatch)
})

export default connect(null, mapDispatchToProps)(withLocalize(HeaderLevel))
