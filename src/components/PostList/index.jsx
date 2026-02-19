import React, { useEffect, useMemo, useState } from "react"
import styled, { css } from "styled-components"
import _ from "lodash"

import { Link, navigate } from "gatsby"

import TagList from "components/TagList"

const Wrapper = styled.section`
  margin-bottom: 48px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  ${props =>
    props.$variant === "card" &&
    css`
      @media (min-width: 780px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    `}
`

const Card = styled.article`
  position: relative;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 18px;
  background: ${props => props.theme.colors.surface};
  padding: 20px;
  transition: transform 0.18s ease, border-color 0.18s ease;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.theme.colors.accent};
    opacity: 0;
    transform: scaleX(0.75);
    transform-origin: left center;
    transition: transform 0.18s ease, opacity 0.18s ease;
  }

  &:hover,
  &:focus-within {
    transform: translateY(-4px);
    border-color: ${props => props.theme.colors.activatedBorder};

    &::after {
      opacity: 1;
      transform: scaleX(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &::after {
      transition: none;
    }

    &:hover,
    &:focus-within {
      transform: none;
    }
  }
`

const CardTitle = styled.h2`
  margin-bottom: 12px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;

  a {
    color: ${props => props.theme.colors.text};
    text-decoration: none;
  }
`

const Meta = styled.p`
  margin-bottom: 12px;
  font-size: 13px;
  color: ${props => props.theme.colors.tertiaryText};
`

const DescriptionText = styled.p`
  margin-bottom: 16px;
  line-height: 1.65;
  font-size: 15px;
  color: ${props => props.theme.colors.secondaryText};
  word-break: keep-all;
`

const checkIsScrollAtBottom = () => {
  return (
    document.documentElement.scrollHeight -
      document.documentElement.scrollTop <=
    document.documentElement.clientHeight + 120
  )
}

const isInteractiveTarget = event => {
  if (event.defaultPrevented) return true
  const target = event.target

  if (!target || typeof target.closest !== "function") return false

  return Boolean(target.closest("a, button, input, textarea, select, label"))
}

const PostList = ({ postList, variant }) => {
  const initialCount = variant === "card" ? 8 : 10
  const [postCount, setPostCount] = useState(initialCount)

  const handleMoreLoad = useMemo(
    () =>
      _.throttle(() => {
        if (checkIsScrollAtBottom() && postCount < postList.length) {
          setPostCount(prev => prev + (variant === "card" ? 4 : 6))
        }
      }, 250),
    [postCount, postList.length, variant]
  )

  useEffect(() => {
    window.addEventListener("scroll", handleMoreLoad)

    return () => {
      window.removeEventListener("scroll", handleMoreLoad)
      handleMoreLoad.cancel()
    }
  }, [handleMoreLoad])

  useEffect(() => {
    setPostCount(initialCount)
  }, [initialCount, postList])

  return (
    <Wrapper>
      <Grid $variant={variant}>
        {postList.slice(0, postCount).map((post, i) => {
          const { title, date, tags, description } = post.frontmatter
          const { slug } = post.fields
          const summary = description || "설명은 준비 중입니다."

          return (
            <Card
              key={JSON.stringify({ slug, i })}
              role="link"
              tabIndex={0}
              aria-label={`${title} 포스트로 이동`}
              onClick={event => {
                if (isInteractiveTarget(event)) return
                navigate(slug)
              }}
              onKeyDown={event => {
                if (event.key !== "Enter" && event.key !== " ") return
                if (isInteractiveTarget(event)) return
                event.preventDefault()
                navigate(slug)
              }}
            >
              <CardTitle>
                <Link to={slug}>{title}</Link>
              </CardTitle>
              <Meta>{date}</Meta>
              <DescriptionText>{summary}</DescriptionText>
              <TagList tagList={tags} compact />
            </Card>
          )
        })}
      </Grid>
    </Wrapper>
  )
}

PostList.defaultProps = {
  variant: "card",
}

export default PostList
