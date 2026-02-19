import React from "react"
import styled, { css } from "styled-components"

import useScroll from "hooks/useScroll"

const StyledWrapper = styled.div`
  position: relative;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.12s ease, transform 0.12s ease;

  ${props =>
    props.visible &&
    css`
      opacity: 1;
      transform: translateY(0);
    `}
`

const RevealOnScroll = ({ revealAt, reverse, children }) => {
  const { y } = useScroll()

  const reveal = reverse ? y < revealAt : y > revealAt

  return <StyledWrapper visible={reveal}>{children}</StyledWrapper>
}

export default RevealOnScroll
