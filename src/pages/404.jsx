import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"

import Layout from "components/Layout"
import SEO from "components/SEO"

import { title, description, siteUrl } from "../../blog-config"

const NotFound = styled.section`
  height: 62vh;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 22px;
  background: ${props => props.theme.colors.surface};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.colors.tertiaryText};
  gap: 10px;

  h2 {
    font-weight: 700;
    font-size: 44px;
    color: ${props => props.theme.colors.text};
  }

  p {
    font-size: 18px;
  }

  a {
    margin-top: 8px;
    color: ${props => props.theme.colors.accent};
    text-decoration: none;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    height: 42vh;

    h2 {
      font-size: 36px;
    }

    p {
      font-size: 16px;
    }
  }
`

const NotFoundPage = () => (
  <Layout>
    <SEO title={title} description={description} url={siteUrl} />
    <NotFound>
      <h2>404</h2>
      <p>요청한 페이지를 찾을 수 없습니다.</p>
      <Link to="/">홈으로 이동</Link>
    </NotFound>
  </Layout>
)

export default NotFoundPage
