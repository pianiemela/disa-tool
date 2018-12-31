import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Table, Segment, Header } from 'semantic-ui-react'

import asyncAction from '../../../../utils/asyncAction'
import MatrixLevel from './MatrixLevel'
import DeleteForm from '../../../../utils/components/DeleteForm'
import { removeCategory, moveCategory } from '../../actions/categories'
import EditCategoryForm from './EditCategoryForm'
import dndItem from '../../../../utils/components/DnDItem'

const DnDItem = dndItem('category')

export const MatrixCategory = (props) => {
  const translate = id => props.translate(`Course.matrix.MatrixCategory.${id}`)
  const cellContent = (
    <div>
      <Header>{props.category.name}</Header>
      {props.editing ? (
        <div className="flexContainer">
          <div className="paddedBlock">
            <EditCategoryForm categoryId={props.category.id} />
          </div>
          <div className="paddedBlock">
            <DeleteForm
              onExecute={() => props.removeCategory({ id: props.category.id })}
              prompt={[
                translate('delete_prompt_1'),
                `"${props.category.name}"`
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
    <Table.Row className="MatrixCategory">
      <Table.Cell>
        {props.editing ? (
          <DnDItem element={props.category} mover={props.moveCategory}>
            <Segment>
              {cellContent}
            </Segment>
          </DnDItem>
        ) : cellContent}
      </Table.Cell>
      {props.category.skill_levels.sort((a, b) => a.order - b.order).map(level => (
        <MatrixLevel
          key={level.id}
          category={props.category}
          level={level}
          courseId={props.courseId}
          editing={props.editing}
          activeMap={props.activeMap}
          activeTaskId={props.activeTaskId}
          showDetails={props.showDetails}
        />
      ))}
    </Table.Row>
  )
}

MatrixCategory.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    skill_levels: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired
    })).isRequired,
    order: PropTypes.number.isRequired
  }).isRequired,
  courseId: PropTypes.number,
  editing: PropTypes.bool.isRequired,
  removeCategory: PropTypes.func.isRequired,
  activeMap: PropTypes.objectOf(PropTypes.bool).isRequired,
  activeTaskId: PropTypes.number,
  showDetails: PropTypes.bool,
  translate: PropTypes.func.isRequired,
  moveCategory: PropTypes.func.isRequired
}

MatrixCategory.defaultProps = {
  courseId: null,
  activeTaskId: null,
  showDetails: false
}

const mapDispatchToProps = dispatch => ({
  removeCategory: asyncAction(removeCategory, dispatch),
  moveCategory: moveCategory(dispatch)
})

export default withLocalize(connect(null, mapDispatchToProps)(MatrixCategory))
