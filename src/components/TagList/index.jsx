import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"

const TagListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const TagLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: ${props => (props.$compact ? "5px 10px" : "7px 12px")};
  border-radius: 999px;
  border: 1px solid
    ${props =>
      props.$selected
        ? props.theme.colors.selectedTagBackground
        : props.theme.colors.border};
  background-color: ${props =>
    props.$selected
      ? props.theme.colors.selectedTagBackground
      : props.theme.colors.tagBackground};
  color: ${props =>
    props.$selected
      ? props.theme.colors.selectedTagText
      : props.theme.colors.tagText};
  text-decoration: none;
  font-size: ${props => (props.$compact ? "12px" : "13px")};
  font-weight: 600;
  transition: transform 0.18s ease, background-color 0.18s ease,
    color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    background-color: ${props =>
      props.$selected
        ? props.theme.colors.hoveredSelectedTagBackground
        : props.theme.colors.hoveredTagBackground};
  }
`

const spaceToDash = text => text.replace(/\s+/g, "-")

const TagList = ({ tagList, count, selected, compact }) => {
  if (!tagList) return null

  if (!count) {
    return (
      <TagListWrapper>
        {tagList.map((tag, i) => (
          <TagLink
            key={JSON.stringify({ tag, i })}
            to={`/tags?q=${tag}`}
            $compact={compact}
          >
            {spaceToDash(tag)}
          </TagLink>
        ))}
      </TagListWrapper>
    )
  }

  return (
    <TagListWrapper>
      {tagList.map((tag, i) => {
        const isSelected = tag.fieldValue === selected
        const linkTo = isSelected ? "/tags" : `/tags?q=${tag.fieldValue}`

        return (
          <TagLink
            key={JSON.stringify({ tag, i })}
            to={linkTo}
            $selected={isSelected}
            $compact={compact}
          >
            {spaceToDash(tag.fieldValue)} ({tag.totalCount})
          </TagLink>
        )
      })}
    </TagListWrapper>
  )
}

TagList.defaultProps = {
  compact: false,
}

export default TagList
