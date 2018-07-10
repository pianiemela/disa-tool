import React from 'react'
import PropTypes from 'prop-types'
import { Card, Form } from 'semantic-ui-react'
import CategoryQuestionModule from '../QuestionModules/CategoryQuestionModule'

const CategorySection = (props) => {
  const { formData, edit, handleChange, textArea } = props

  return (
    <div>
      <h2>{formData.name} kategorialomake</h2>
      <Card fluid color="red" className="formCard">
        <Card.Content>
          <Card.Header className="cardHead">
            Kategoria-arviointi
          </Card.Header>
          <Form>
            {formData.questionModules.map(questionModules =>
              (<CategoryQuestionModule
                key={questionModules.id}
                data={questionModules}
                edit={edit}
                handleChange={handleChange}
                textArea={textArea}
              />))}
          </Form>
        </Card.Content>
      </Card>
    </div>
  )
}

CategorySection.defaultProps = {
  formData: {}
}

CategorySection.propTypes = {
  formData: PropTypes.shape(),
  edit: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  textArea: PropTypes.func.isRequired
}

export default CategorySection
