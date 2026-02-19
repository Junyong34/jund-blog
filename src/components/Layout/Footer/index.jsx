import React from "react"
import styled from "styled-components"

import { title } from "../../../../blog-config"

const FooterWrapper = styled.footer`
  margin: 24px auto 0;
  padding: 28px 24px 46px;
  max-width: 1160px;

  @media (max-width: 768px) {
    padding: 24px 14px 32px;
  }
`

const FooterCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 18px;
  background: ${props => props.theme.colors.surface};
  padding: 16px;
  color: ${props => props.theme.colors.tertiaryText};
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  gap: 12px;

  a {
    color: ${props => props.theme.colors.accent};
    text-decoration: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterCard>
        <span>© {title}. Built with Gatsby.</span>
        <a
          href="https://github.com/devHudi/gatsby-starter-hoodie"
          target="_blank"
          rel="noreferrer"
        >
          Starter reference
        </a>
      </FooterCard>
    </FooterWrapper>
  )
}

export default Footer
