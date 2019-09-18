import React from 'react'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button } from 'semantic-ui-react'
import { selectAll, deselectAll } from '../actions/selfAssesmentList'

export const SelectAllButton = withLocalize(connect(null, dispatch => ({ select: selectAll(dispatch) }))(props => <Button basic content={props.translate('SelfAssessmentList.SelectionButtons.select')} onClick={props.select} />))
export const DeselectAllButton = withLocalize(connect(null, dispatch => ({ deselect: deselectAll(dispatch) }))(props => <Button basic content={props.translate('SelfAssessmentList.SelectionButtons.deselect')} onClick={props.deselect} />))
