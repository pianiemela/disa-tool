import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Label, List } from 'semantic-ui-react'

const renderStudentAssessmentList = assessments => (
  <List selection size="big">
    {assessments.map(assessment => (
      !assessment.active ? undefined : (
        <List.Item key={assessment.id} style={{ display: 'flex' }}>
          <List.Content
            as={Link}
            to={`/selfAssesment/response/${assessment.id}`}
            style={{ flexGrow: 1 }}
          >
            {assessment.name}
          </List.Content>
          <List.Content floated="right">
            <Label
              color={assessment.open ? 'green' : 'red'}
              content={assessment.open ? 'avoin' : 'suljettu'}
            />
            <Label
              color={assessment.assessment_responses.length > 0 ? 'green' : 'red'}
              content={assessment.assessment_responses.length > 0 ? 'Vastattu' : 'Vastaamatta'}
            />
          </List.Content>
        </List.Item>)
        ))}
  </List>
)

const renderTeacherAssessmentList = (assessments, toggleAssessment) => (
  <List selection size="big">
    {assessments.map(assessment => (
      <List.Item key={assessment.id} style={{ display: 'flex' }}>
        <List.Content
          as={Link}
          to={`/selfAssesment/list/${assessment.id}`}
          style={{ flexGrow: 1 }}
        >
          {assessment.name}
        </List.Content>
        <List.Content floated="right">
          <Button
            name="assessmentActive"
            color={assessment.active ? 'green' : 'red'}
            compact
            content={assessment.active ? 'näkyvillä' : 'piilotettu'}
            disabled={assessment.open}
            size="small"
            value={assessment.id}
            onClick={toggleAssessment}
          />
          <Button
            name="assessmentOpen"
            color={assessment.open ? 'green' : 'red'}
            compact
            content={assessment.open ? 'avoin' : 'suljettu'}
            disabled={!assessment.active}
            size="small"
            value={assessment.id}
            onClick={toggleAssessment}
          />
          <Button
            name="feedbackOpen"
            color={assessment.show_feedback ? 'green' : 'red'}
            compact
            content={assessment.show_feedback ? 'palaute auki' : 'ei palautetta'}
            size="small"
            value={assessment.id}
            onClick={toggleAssessment}
          />
        </List.Content>
      </List.Item>))}
  </List>
)

export const CourseSelfAssessmentList = ({ assessments, isTeacher, toggleAssessment }) => {
  if (isTeacher) {
    return renderTeacherAssessmentList(assessments, toggleAssessment)
  }
  return renderStudentAssessmentList(assessments)
}

export default CourseSelfAssessmentList
