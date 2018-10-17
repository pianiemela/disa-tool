import React from 'react'
import { func, string, number, shape } from 'prop-types'
import { Button, Container, Form, Input, Label } from 'semantic-ui-react'

const ChangeAllObjectivesMultipliers = ({
  defaultMultiplier,
  defaultInd,
  changeMultiplier,
  changeModified,
  allText,
  defaultText,
  modifyText,
  orText
}) => (
  <Form.Field>
    <Container>
      <Label basic size="large">{allText}</Label>
    </Container>
    <Container>
      <Button.Group size="small">
        <Button
          type="button"
          content={defaultText}
          color={defaultMultiplier.modified === false ? 'blue' : undefined}
          onClick={changeModified(defaultInd, false)}
        />
        <Button.Or text={orText} />
        <Button
          type="button"
          content={modifyText}
          color={defaultMultiplier.modified === true ? 'blue' : undefined}
          onClick={changeModified(defaultInd, true)}
        />
      </Button.Group>
      <Input
        className="multiplierInput"
        value={defaultMultiplier.multiplier}
        onChange={changeMultiplier(defaultInd)}
        name="all"
        type="number"
        min={0}
        max={1}
        step={0.01}
        disabled={!defaultMultiplier.modified}
      />
    </Container>
  </Form.Field>
)

ChangeAllObjectivesMultipliers.propTypes = {
  defaultMultiplier: shape().isRequired,
  defaultInd: number.isRequired,
  changeModified: func.isRequired,
  changeMultiplier: func.isRequired,
  allText: string.isRequired,
  defaultText: string.isRequired,
  orText: string.isRequired,
  modifyText: string.isRequired
}

export default ChangeAllObjectivesMultipliers
