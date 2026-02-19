import React from "react"
import styled from "styled-components"

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  border: 1px dashed ${props => props.theme.colors.border};
  border-radius: 16px;
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.tertiaryText};
  background: ${props => props.theme.colors.surface};
`

const NoContent = ({ name }) => <Wrapper>There is no {name}.</Wrapper>

export default NoContent
