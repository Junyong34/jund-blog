import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { useSelector } from "react-redux"
import styled, { useTheme } from "styled-components"
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi"
import { Utterances } from "utterances-react-component"

import { utterances } from "../../../../blog-config"

import MDSpinner from "react-md-spinner"

import Divider from "components/Divider"
import Bio from "components/Bio"

const ArticleButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const ArticleButton = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 92px;
  gap: 8px;
  border-radius: 14px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.nextPostButtonBackground};
  padding: 14px;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  transition: transform 0.18s ease, border-color 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${props => props.theme.colors.activatedBorder};
    background: ${props => props.theme.colors.hoveredNextPostButtonBackground};
  }
`

const ArticleButtonLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${props => props.theme.colors.tertiaryText};
`

const ArticleButtonTitle = styled.span`
  font-size: 16px;
  line-height: 1.35;
`

const CommentWrapper = styled.section`
  margin-top: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 18px;
  background: ${props => props.theme.colors.surface};
  padding: 16px;
`

const SpinnerWrapper = styled.div`
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const HiddenWrapper = styled.div`
  height: ${props => (props.$isHidden ? "0px" : "auto")};
  overflow: ${props => (props.$isHidden ? "hidden" : "visible")};
`

const Spinner = () => {
  const theme = useTheme()

  return (
    <SpinnerWrapper aria-live="polite">
      <MDSpinner singleColor={theme.colors.spinner} />
    </SpinnerWrapper>
  )
}

const Comment = () => {
  const { theme } = useSelector(state => state.theme)
  const [spinner, setSpinner] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSpinner(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {spinner && <Spinner />}

      <HiddenWrapper $isHidden={spinner}>
        <HiddenWrapper $isHidden={theme === "light"}>
          <Utterances
            repo={utterances.repo}
            theme="github-dark"
            issueTerm={utterances.type}
          />
        </HiddenWrapper>
        <HiddenWrapper $isHidden={theme === "dark"}>
          <Utterances
            repo={utterances.repo}
            theme="github-light"
            issueTerm={utterances.type}
          />
        </HiddenWrapper>
      </HiddenWrapper>
    </>
  )
}

const Footer = ({ previous, next }) => {
  return (
    <>
      <ArticleButtonContainer>
        {previous ? (
          <ArticleButton
            to={previous.fields.slug}
            aria-label="이전 포스트로 이동"
          >
            <ArticleButtonLabel>
              <BiLeftArrowAlt aria-hidden="true" /> Previous Post
            </ArticleButtonLabel>
            <ArticleButtonTitle>
              {previous.frontmatter.title}
            </ArticleButtonTitle>
          </ArticleButton>
        ) : (
          <div />
        )}

        {next ? (
          <ArticleButton to={next.fields.slug} aria-label="다음 포스트로 이동">
            <ArticleButtonLabel>
              Next Post <BiRightArrowAlt aria-hidden="true" />
            </ArticleButtonLabel>
            <ArticleButtonTitle>{next.frontmatter.title}</ArticleButtonTitle>
          </ArticleButton>
        ) : (
          <div />
        )}
      </ArticleButtonContainer>

      <Bio />

      <CommentWrapper>
        <Divider mt="0" mb="18px" />
        <Comment />
      </CommentWrapper>
    </>
  )
}

export default Footer
