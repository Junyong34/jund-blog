import React, { useEffect, useMemo, useState } from "react"
import styled from "styled-components"
import _ from "lodash"

import { Link, navigate } from "gatsby"

const SeriesListWrapper = styled.section`
  margin-bottom: 48px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 780px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const Card = styled.article`
  position: relative;
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

const SeriesTitle = styled.h2`
  margin-bottom: 10px;
  line-height: 1.3;
  font-size: 24px;
  font-weight: 700;

  a {
    color: ${props => props.theme.colors.text};
    text-decoration: none;
  }
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${props => props.theme.colors.tertiaryText};
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

const SeriesList = ({ seriesList }) => {
  const [seriesCount, setSeriesCount] = useState(8)

  const handleMoreLoad = useMemo(
    () =>
      _.throttle(() => {
        if (checkIsScrollAtBottom() && seriesCount < seriesList.length) {
          setSeriesCount(prev => prev + 4)
        }
      }, 250),
    [seriesCount, seriesList.length]
  )

  useEffect(() => {
    window.addEventListener("scroll", handleMoreLoad)

    return () => {
      window.removeEventListener("scroll", handleMoreLoad)
      handleMoreLoad.cancel()
    }
  }, [handleMoreLoad])

  useEffect(() => {
    setSeriesCount(8)
  }, [seriesList])

  return (
    <SeriesListWrapper>
      <Grid>
        {seriesList.slice(0, seriesCount).map((series, i) => {
          const seriesPath = `/series/${_.replace(series.name, /\s/g, "-")}`

          return (
            <Card
              key={JSON.stringify({ name: series.name, i })}
              role="link"
              tabIndex={0}
              aria-label={`${series.name} 시리즈로 이동`}
              onClick={event => {
                if (isInteractiveTarget(event)) return
                navigate(seriesPath)
              }}
              onKeyDown={event => {
                if (event.key !== "Enter" && event.key !== " ") return
                if (isInteractiveTarget(event)) return
                event.preventDefault()
                navigate(seriesPath)
              }}
            >
              <SeriesTitle>
                <Link to={seriesPath}>{series.name}</Link>
              </SeriesTitle>
              <Meta>
                <span>{series.posts.length} Posts</span>
                <span>·</span>
                <span>Last updated on {series.lastUpdated}</span>
              </Meta>
            </Card>
          )
        })}
      </Grid>
    </SeriesListWrapper>
  )
}

export default SeriesList
