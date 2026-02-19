import React from "react"
import styled from "styled-components"

import { author } from "../../../../blog-config"

import TagList from "components/TagList"

const Wrapper = styled.header`
  margin-bottom: 26px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 22px;
  background: ${props => props.theme.colors.surface};
  padding: 22px;
`

const Label = styled.span`
  display: inline-flex;
  margin-bottom: 14px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.theme.colors.accent};
  background: ${props => props.theme.colors.accentSubtle};
`

const ArticleTitle = styled.h1`
  margin-bottom: 16px;
  line-height: 1.2;
  font-size: 42px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 34px;
  }
`

const Information = styled.p`
  margin-bottom: 16px;
  font-size: 14px;
  color: ${props => props.theme.colors.tertiaryText};
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

const Strong = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 700;
`

const Header = ({ title, date, update, tags, minToRead }) => {
  return (
    <Wrapper>
      <Label>ARTICLE</Label>
      <ArticleTitle>{title}</ArticleTitle>
      <Information>
        <Strong>@{author}</Strong>
        <span>·</span>
        <span>{date}</span>
        <span>·</span>
        <span>{minToRead} min read</span>
        {update && (
          <>
            <span>·</span>
            <span>updated {update}</span>
          </>
        )}
      </Information>
      {tags && <TagList tagList={tags} compact />}
    </Wrapper>
  )
}

export default Header
