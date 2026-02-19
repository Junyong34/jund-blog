import React from "react"
import styled from "styled-components"

const Wrapper = styled.h1`
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.$size};
  font-weight: 700;
  line-height: 1.25;
  word-break: keep-all;

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.18s ease;
  }

  a:hover {
    color: ${props => props.theme.colors.accent};
  }
`

const sizes = {
  sm: "20px",
  md: "28px",
  lg: "36px",
  xl: "48px",
  bg: "36px",
}

const Title = ({ size, children, as }) => {
  return (
    <Wrapper as={as} $size={sizes[size] || sizes.md}>
      {children}
    </Wrapper>
  )
}

Title.defaultProps = {
  size: "md",
  as: "h1",
}

export default Title
