import React from 'react'
import { number, shape, func, bool } from 'prop-types'
import { Button, Header, Card, Form } from 'semantic-ui-react'
import {
  createCategoryQuestion,
  deleteCategoryQuestion,
  editCategoryQuestion
} from '../../actions/categoryQuestion'

const CategoryQuestion = ({
  selfAssessmentFormId,
  category,
  question,
  dispatchQuestions
}) => {
  const addQuestion = () => {
    createCategoryQuestion({
      self_assessment_form_id: selfAssessmentFormId,
      category_id: category.id,
      text_field: false,
      order: 1
    }).then(({ created }) => {
      // TODO: optimism
      dispatchQuestions({
        type: 'CREATE',
        created
      })
    })
  }
  const removeQuestion = () => {
    dispatchQuestions({
      type: 'DELETE',
      deleted: question
    })
    deleteCategoryQuestion(question.id)
  }
  const toggleTextField = () => {
    dispatchQuestions({
      type: 'UPDATE',
      edited: {
        id: question.id,
        text_field: !question.text_field
      }
    })
    editCategoryQuestion(question.id, {
      ...question,
      text_field: !question.text_field
    })
  }
  return (
    <Card fluid>
      <Card.Header>
        <Header>{category.name}</Header>
      </Card.Header>
      {question ? (
        <Card.Content>
          <Button
            type="button"
            onClick={removeQuestion}
          >
            translate: Delete
          </Button>
          <div
            style={{
              position: 'relative'
            }}
          >
            <div
              style={{
                cursor: 'pointer',
                position: 'absolute',
                textAlign: 'center',
                paddingTop: '30px',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                margin: 'auto'
              }}
              onClick={toggleTextField}
            >
              <Button
                type="button"
              >
                tanslate: Text Field Off
              </Button>
            </div>
            <Form.TextArea
              autoHeight
              disabled={!question.text_field}
            />
          </div>
        </Card.Content>
      ) : (
        <Card.Content>
          <Button
            type="button"
            onClick={addQuestion}
          >
            translate: Add
          </Button>
        </Card.Content>
      )}
    </Card>
  )
}

CategoryQuestion.propTypes = {
  selfAssessmentFormId: number.isRequired,
  category: shape({
    id: number.isRequired
  }).isRequired,
  question: shape({
    id: number.isRequired,
    text_field: bool.isRequired
  }),
  dispatchQuestions: func.isRequired
}

CategoryQuestion.defaultProps = {
  question: null
}

export default CategoryQuestion
