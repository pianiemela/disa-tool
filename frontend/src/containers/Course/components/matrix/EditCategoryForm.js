import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { details } from '../../../../api/categories'
import { editCategory } from '../../actions/categories'

import ModalForm from '../../../../utils/components/ModalForm'
import MultilingualField from '../../../../utils/components/MultilingualField'

class EditCategoryForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      values: {
        name: {
          eng: '',
          fin: '',
          swe: ''
        }
      }
    }
  }

  editCategorySubmit = e => this.props.editCategory({
    id: this.props.categoryId,
    eng_name: e.target.eng_name.value,
    fin_name: e.target.fin_name.value,
    swe_name: e.target.swe_name.value
  })

  loadDetails = async () => {
    const categoryDetails = (await this.props.details({
      id: this.props.categoryId
    })).data.data
    this.setState({
      loading: false,
      values: {
        name: {
          eng: categoryDetails.eng_name,
          fin: categoryDetails.fin_name,
          swe: categoryDetails.swe_name
        }
      }
    })
  }

  translate = id => this.props.translate(`Course.matrix.EditCategoryForm.${id}`)

  render() {
    return (
      <div className="EditCategoryForm">
        <ModalForm
          header={this.translate('header')}
          trigger={<Button basic circular onClick={this.loadDetails} icon={{ name: 'edit' }} size="mini" />}
          content={
            <div>
              <MultilingualField field="name" fieldDisplay={this.translate('name')} values={this.state.values.name} />
              <Button color="green">{this.translate('save')}</Button>
            </div>
          }
          onSubmit={this.editCategorySubmit}
          loading={this.state.loading}
        />
      </div>
    )
  }
}

EditCategoryForm.propTypes = {
  editCategory: PropTypes.func.isRequired,
  categoryId: PropTypes.number.isRequired,
  details: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  editCategory: asyncAction(editCategory, dispatch),
  details
})

export default withLocalize(connect(null, mapDispatchToProps)(EditCategoryForm))
