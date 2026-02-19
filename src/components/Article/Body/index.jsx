import React, { useEffect, useState } from "react"
import styled from "styled-components"

import Toc from "./Toc"
import StyledMarkdown from "./StyledMarkdown"

const Wrapper = styled.div`
  position: relative;
  margin-bottom: 96px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 22px;
  background: ${props => props.theme.colors.surface};
  padding: 24px;

  @media (max-width: 768px) {
    margin-bottom: 72px;
    padding: 16px;
  }
`

const Body = ({ html }) => {
  const [toc, setToc] = useState([])

  useEffect(() => {
    setToc(
      Array.from(
        document.querySelectorAll("#article-body > h2, #article-body > h3")
      )
    )
  }, [html])

  return (
    <Wrapper>
      <Toc items={toc} />

      <StyledMarkdown
        id="article-body"
        dangerouslySetInnerHTML={{ __html: html }}
        itemProp="articleBody"
      />
    </Wrapper>
  )
}

export default Body
