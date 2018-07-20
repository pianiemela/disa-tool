import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { removeCategory } from '../../services/categories'

import ModalForm from '../../../../utils/components/ModalForm'

export class RemoveCategoryForm extends Component {
  removeCategory = () => {
    this.props.removeCategory({
      id: this.props.category.id
    })
  }

  render() {
    const contentPrompt = [
      'Poistetaanko kategoria',
      `"${this.props.category.name}"`
    ].join(' ')
    return (
      <div className="RemoveCategoryForm">
        <ModalForm
          header="Poista kategoria"
          trigger={<Button color="red" icon={{ name: 'delete' }} size="small" />}
          content={
            <div>
              <p>{contentPrompt}?</p>
              <div className="choiceContainer">
                <Button color="red" onClick={this.removeCategory}>
                  Poista
                </Button>
                <Button>
                  Peru
                </Button>
              </div>
            </div>
          }
        />

      </div>
    )
  }
}

RemoveCategoryForm.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  removeCategory: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  removeCategory: asyncAction(removeCategory, dispatch)
})

export default connect(null, mapDispatchToProps)(RemoveCategoryForm)
