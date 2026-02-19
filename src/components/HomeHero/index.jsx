import React from "react"
import styled from "styled-components"
import { Link, navigate } from "gatsby"

import TagList from "components/TagList"

import { author, description } from "../../../blog-config"

const Wrapper = styled.section`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 24px;
  background: ${props => props.theme.colors.surface};
  padding: 24px;
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const IntroSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.colors.border};
  object-fit: cover;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 64px;
    height: 64px;
  }
`

const IntroContent = styled.div`
  flex: 1;
`

const IntroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin-bottom: 14px;
  padding: 5px 10px;
  border-radius: 999px;
  background: ${props => props.theme.colors.accentSubtle};
  color: ${props => props.theme.colors.accent};
  font-size: 12px;
  font-weight: 700;
`

const IntroTitle = styled.h1`
  margin-bottom: 12px;
  font-size: 42px;
  font-weight: 700;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`

const IntroText = styled.p`
  margin-bottom: 18px;
  color: ${props => props.theme.colors.secondaryText};
  font-size: 16px;
`

const IntroMeta = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.tertiaryText};
`

const FeaturedList = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const FeaturedCard = styled.article`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 14px;
  background: ${props => props.theme.colors.surfaceMuted};
  padding: 14px;
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

const FeaturedTitle = styled.h2`
  margin-bottom: 7px;
  font-size: 20px;
  line-height: 1.3;

  a {
    color: ${props => props.theme.colors.text};
    text-decoration: none;
  }
`

const FeaturedMeta = styled.p`
  margin-bottom: 9px;
  font-size: 13px;
  color: ${props => props.theme.colors.tertiaryText};
`

const FeaturedDescription = styled.p`
  margin-bottom: 10px;
  color: ${props => props.theme.colors.secondaryText};
  font-size: 14px;
`

const isInteractiveTarget = event => {
  if (event.defaultPrevented) return true
  const target = event.target

  if (!target || typeof target.closest !== "function") return false

  return Boolean(target.closest("a, button, input, textarea, select, label"))
}

const HomeHero = ({ featuredPosts }) => {
  return (
    <Wrapper>
      <IntroSection>
        <ProfileImage src="/profile.png" alt={`${author} 프로필`} />
        <IntroContent>
          <IntroBadge>기술 블로그</IntroBadge>
          <IntroTitle>{description}</IntroTitle>
          <IntroText>
            프론트엔드 구현, 아키텍처, 팀 생산성을 높이는 개발 경험을
            기록합니다.
          </IntroText>
          <IntroMeta>Written by @{author}</IntroMeta>
        </IntroContent>
      </IntroSection>

      <FeaturedList>
        {featuredPosts.map(post => {
          const {
            title,
            date,
            tags,
            description: postDescription,
          } = post.frontmatter
          const { slug } = post.fields
          const summary = postDescription || "설명은 준비 중입니다."

          return (
            <FeaturedCard
              key={slug}
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
              <FeaturedTitle>
                <Link to={slug}>{title}</Link>
              </FeaturedTitle>
              <FeaturedMeta>{date}</FeaturedMeta>
              <FeaturedDescription>{summary}</FeaturedDescription>
              <TagList tagList={tags} compact />
            </FeaturedCard>
          )
        })}
      </FeaturedList>
    </Wrapper>
  )
}

export default HomeHero
