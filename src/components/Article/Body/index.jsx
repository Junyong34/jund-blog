import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"

import Toc from "./Toc"
import StyledMarkdown from "./StyledMarkdown"
import { renderMermaidDiagrams } from "./mermaid"

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
  const bodyRef = useRef(null)
  const [toc, setToc] = useState([])

  useEffect(() => {
    const bodyElement = bodyRef.current

    if (!bodyElement) {
      setToc([])
      return undefined
    }

    setToc(
      Array.from(bodyElement.children).filter(
        element => element.tagName === "H2" || element.tagName === "H3"
      )
    )

    renderMermaidDiagrams(bodyElement).catch(() => undefined)

    return undefined
  }, [html])

  return (
    <Wrapper>
      <Toc items={toc} />

      <StyledMarkdown
        ref={bodyRef}
        id="article-body"
        dangerouslySetInnerHTML={{ __html: html }}
        itemProp="articleBody"
      />
    </Wrapper>
  )
}

export default Body
