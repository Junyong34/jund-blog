import React, { useEffect, useMemo, useState } from "react"
import styled from "styled-components"
import _ from "lodash"

import { Link } from "gatsby"

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
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 18px;
  background: ${props => props.theme.colors.surface};
  padding: 20px;
  transition: transform 0.18s ease, border-color 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${props => props.theme.colors.activatedBorder};
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
          return (
            <Card key={JSON.stringify({ name: series.name, i })}>
              <SeriesTitle>
                <Link to={`/series/${_.replace(series.name, /\s/g, "-")}`}>
                  {series.name}
                </Link>
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
