import React from 'react'
import { boolean, func, string, shape } from 'prop-types'
import { Button, Container, Form, Input, Label } from 'semantic-ui-react'

const ChangeObjectiveMultiplier = ({
  objective,
  values,
  loading,
  changeModified,
  changeMultiplier,
  defaultText,
  orText,
  modifyText
}) => (
  <Form.Field key={objective.id}>
    <Container>
      <Label basic size="large">{objective.name}</Label>
    </Container>
    <Container>
      <Button.Group size="small">
        <Button
          type="button"
          content={defaultText}
          color={loading || values[objective.id].modified ? undefined : 'blue'}
          onClick={changeModified(objective.id, false)}
        />
        <Button.Or text={orText} />
        <Button
          type="button"
          content={modifyText}
          color={!loading && values[objective.id].modified ? 'blue' : undefined}
          onClick={changeModified(objective.id, true)}
        />
      </Button.Group>
      <Input
        className="multiplierInput"
        value={loading ? 0 : values[objective.id].multiplier}
        onChange={changeMultiplier(objective.id)}
        name={`objective ${objective.id}`}
        type="number"
        min={0}
        max={1}
        step={0.01}
        disabled={loading || !values[objective.id].modified}
      />
    </Container>
  </Form.Field>
)

ChangeObjectiveMultiplier.propTypes = {
  objective: shape().isRequired,
  values: shape().isRequired,
  loading: boolean.isRequired,
  changeModified: func.isRequired,
  changeMultiplier: func.isRequired,
  defaultText: string.isRequired,
  orText: string.isRequired,
  modifyText: string.isRequired
}

export default ChangeObjectiveMultiplier
