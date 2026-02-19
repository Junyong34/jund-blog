import React from "react"
import _ from "lodash"
import styled from "styled-components"
import { Link } from "gatsby"

const Wrapper = styled.aside`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 18px;
  background: ${props => props.theme.colors.surface};
  padding: 16px;
`

const Title = styled.h2`
  margin-bottom: 14px;
  font-size: 14px;
  color: ${props => props.theme.colors.tertiaryText};
  font-weight: 700;
  letter-spacing: 0.04em;
`

const TagList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Tag = styled.li`
  a {
    color: ${props => props.theme.colors.secondaryText};
    font-size: 14px;
    text-decoration: none;
    transition: color 0.18s ease;
  }

  a:hover {
    color: ${props => props.theme.colors.accent};
  }
`

const SideTagList = ({ tags, postCount }) => {
  return (
    <Wrapper>
      <Title>TAG LIST</Title>
      <TagList>
        <Tag>
          <Link to="/tags">all ({postCount})</Link>
        </Tag>
        {_.map(tags, tag => (
          <Tag key={tag.fieldValue}>
            <Link to={`/tags?q=${tag.fieldValue}`}>
              {tag.fieldValue} ({tag.totalCount})
            </Link>
          </Tag>
        ))}
      </TagList>
    </Wrapper>
  )
}

export default SideTagList
