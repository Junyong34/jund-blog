import React, { useEffect, useState } from "react"
import styled, { css } from "styled-components"

import { animateScroll } from "react-scroll"

import useScroll from "hooks/useScroll"

import getElementOffset from "utils/getElmentOffset"

const TOC_TOP_OFFSET = 160
const TOC_CONTENT_GAP = 20
const HEADER_HEIGHT = 62
const SCROLL_OFFSET = HEADER_HEIGHT + 40
const TOC_BOTTOM_GAP = 28

const TocWrapper = styled.nav`
  position: absolute;
  opacity: 1;
  left: calc(100% + ${TOC_CONTENT_GAP}px);
  top: 0;
  width: 240px;
  height: 100%;

  > div {
    position: sticky;
    top: ${TOC_TOP_OFFSET}px;
    width: 100%;
    max-height: calc(100vh - ${TOC_TOP_OFFSET + TOC_BOTTOM_GAP}px);
    padding: 8px 8px 8px 14px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 14px;
    background: ${props => props.theme.colors.surface};
    overflow-y: auto;

    ::-webkit-scrollbar {
      width: 6px;
    }

    ::-webkit-scrollbar-track {
      background: ${props => props.theme.colors.scrollTrack};
    }

    ::-webkit-scrollbar-thumb {
      background: ${props => props.theme.colors.scrollHandle};
      border-radius: 999px;
    }
  }

  @media (max-width: 1300px) {
    display: none;
  }
`

const HeadingButton = styled.button`
  display: block;
  width: 100%;
  padding: 6px 8px;
  border: none;
  border-radius: 8px;
  background: transparent;
  text-align: left;
  font-size: 13px;
  line-height: 1.35;
  color: ${props => props.theme.colors.mutedText};
  cursor: pointer;
  transition: transform 0.18s ease, color 0.18s ease,
    background-color 0.18s ease;
  margin-bottom: 3px;
  padding-left: ${props => (props.$subtitle ? "20px" : "8px")};

  &:first-child {
    margin-top: 8px;
  }

  &:last-child {
    margin-bottom: 8px;
  }

  ${props =>
    props.$active &&
    css`
      color: ${props.theme.colors.accent};
      background: ${props.theme.colors.accentSubtle};
      transform: translateX(2px);
    `}

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`

const Toc = ({ items }) => {
  const { y } = useScroll()

  const [active, setActive] = useState(0)
  const headingElements = items || []

  useEffect(() => {
    if (headingElements.length === 0) return

    const currentScrollPosition = y + SCROLL_OFFSET
    let nextActiveIndex = 0

    for (let i = 0; i < headingElements.length; i += 1) {
      const top = getElementOffset(headingElements[i]).top

      if (top <= currentScrollPosition) {
        nextActiveIndex = i
      } else {
        break
      }
    }

    setActive(nextActiveIndex)
  }, [headingElements, y])

  const handleClickTitle = index => {
    const target = headingElements[index]

    if (!target) return

    const targetTop = getElementOffset(target).top

    animateScroll.scrollTo(targetTop - SCROLL_OFFSET, {
      duration: 220,
      smooth: "easeOutQuad",
    })

    setActive(index)
  }

  return (
    <TocWrapper aria-label="목차">
      <div>
        {items.map((item, i) => (
          <HeadingButton
            key={JSON.stringify({ text: item.innerText, i })}
            $subtitle={item.tagName === "H3"}
            $active={i === active}
            type="button"
            onClick={() => handleClickTitle(i)}
          >
            {item.innerText}
          </HeadingButton>
        ))}
      </div>
    </TocWrapper>
  )
}

export default Toc
