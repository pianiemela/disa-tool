import React, { useState, useEffect } from 'react'
import { shape, number, string, func, bool, arrayOf } from 'prop-types'
import { Card, Header, Form, Dropdown, Label } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'
import { editCategoryResponse, createCategoryResponse } from '../../actions/categoryResponse'
import useSave from '../../../../utils/hooks/useSave'

const CategoryResponse = ({
  category,
  question,
  response: initResponse,
  grades,
  translate: baseTranslate
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.CategoryQuestion.CategoryResponse.${id}`)
  const [response, setResponse] = useState({
    text: '',
    grade_id: null
  })
  const saveChanges = useSave(() => {
    if (!response.grade_id) return
    if (response.id) {
      editCategoryResponse(response.id, response)
    } else {
      createCategoryResponse(response).then(({ created }) => {
        setResponse({
          ...response,
          id: created.id
        })
      })
    }
  })

  useEffect(() => {
    if (initResponse) {
      setResponse({
        ...response,
        ...initResponse
      })
    }
  }, [initResponse])

  const onGradeIdChange = (e, { value }) => {
    setResponse({
      ...response,
      grade_id: value
    })
    saveChanges()
  }
  const onTextChange = ({ target: { value } }) => {
    setResponse({
      ...response,
      text: value
    })
    saveChanges()
  }

  return (
    <Card fluid>
      <Card.Header>
        {category ? (
          <Header>{category.name}</Header>
        ) : null}
      </Card.Header>
      <Card.Content>
        <div>
          <Label>{translate('grade')}</Label>
          <Dropdown
            selection
            onChange={onGradeIdChange}
            value={response.grade_id}
            options={grades.map(grade => ({
              key: grade.id,
              text: grade.name,
              value: grade.id
            })).concat({
              key: null,
              text: '',
              value: null
            })}
          />
        </div>
        <div>
          <Label>{translate('text_field')}</Label>
          {question.text_field ? (
            <Form.TextArea
              onChange={onTextChange}
              value={response.text}
            />
          ) : null}
        </div>
      </Card.Content>
    </Card>
  )
}

CategoryResponse.propTypes = {
  category: shape({
    name: string.isRequired
  }),
  question: shape({
    text_field: bool.isRequired
  }).isRequired,
  response: shape({
    id: number,
    category_question_id: number.isRequired,
    response_id: number,
    grade_id: number,
    text: string
  }).isRequired,
  translate: func.isRequired,
  grades: arrayOf((
    shape({
      id: number.isRequired,
      name: string.isRequired
    }).isRequired
  )).isRequired
}

CategoryResponse.defaultProps = {
  category: null
}

export default withLocalize(CategoryResponse)
