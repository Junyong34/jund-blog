import React from "react"
import styled from "styled-components"

import { FiSearch } from "react-icons/fi"

const Wrapper = styled.div`
  position: relative;
`

const Icon = styled.span`
  position: absolute;
  top: 12px;
  left: 14px;
  display: inline-flex;
  color: ${props => props.theme.colors.textFieldBorder};
  transition: color 0.18s ease;
`

const Input = styled.input.attrs({ type: "text" })`
  width: 100%;
  padding: 12px 14px 12px 42px;
  border: 1px solid ${props => props.theme.colors.textFieldBorder};
  border-radius: 12px;
  background-color: ${props => props.theme.colors.surface};
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  &:focus {
    border-color: ${props => props.theme.colors.textFieldActivatedBorder};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.focusRing};
  }

  &:focus + ${Icon} {
    color: ${props => props.theme.colors.textFieldActivatedBorder};
  }
`

const TextField = props => {
  const { ariaLabel, ...rest } = props

  return (
    <Wrapper>
      <Input aria-label={ariaLabel} {...rest} />
      <Icon aria-hidden="true">
        <FiSearch />
      </Icon>
    </Wrapper>
  )
}

TextField.defaultProps = {
  ariaLabel: "검색어 입력",
}

export default TextField
