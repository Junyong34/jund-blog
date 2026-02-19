import React, { useMemo, useState } from "react"
import _ from "lodash"
import styled from "styled-components"
import { Link } from "gatsby"

const SeriesWrapper = styled.section`
  margin-bottom: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  background-color: ${props => props.theme.colors.seriesBackground};
  padding: 16px;
`

const SeriesHeader = styled.h2`
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};

  a {
    color: inherit;
    text-decoration: none;
  }

  span {
    margin-left: 6px;
    font-weight: 400;
    color: ${props => props.theme.colors.tertiaryText};
  }
`

const PostWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Post = styled.li`
  color: ${props =>
    props.$currentPost
      ? props.theme.colors.text
      : props.theme.colors.secondaryText};

  a {
    text-decoration: none;
    color: inherit;
    font-size: 14px;
    line-height: 1.35;
  }
`

const CurrentLabel = styled.span`
  margin-left: 8px;
  font-size: 12px;
  color: ${props => props.theme.colors.accent};
`

const ViewMore = styled.button`
  margin-top: 12px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.accent};
  font-size: 14px;
  cursor: pointer;
`

const Series = ({ header, series }) => {
  const [fold, setFold] = useState(true)

  const filteredPosts = useMemo(() => {
    if (series.length < 5 || !fold) return series

    const currentPostIdx = _.findIndex(series, { currentPost: true })

    if (currentPostIdx < 2) return series.slice(0, 5)
    if (series.length - currentPostIdx - 1 < 2) {
      return series.slice(series.length - 5, series.length)
    }

    return series.slice(currentPostIdx - 2, currentPostIdx + 3)
  }, [series, fold])

  const showViewButton = series.length > 5

  return (
    <SeriesWrapper>
      <SeriesHeader>
        <Link to={`/series/${_.replace(header, /\s/g, "-")}`}>
          SERIES: {header}
        </Link>
        <span>({series.length})</span>
      </SeriesHeader>

      <PostWrapper>
        {filteredPosts.map((post, i) => (
          <Post
            key={JSON.stringify({ title: post.frontmatter.title, i })}
            $currentPost={post.currentPost}
          >
            <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
            {post.currentPost && <CurrentLabel>현재 글</CurrentLabel>}
          </Post>
        ))}
      </PostWrapper>

      {showViewButton && (
        <ViewMore type="button" onClick={() => setFold(prev => !prev)}>
          {fold
            ? `View More (+${series.length - filteredPosts.length})`
            : "View Less"}
        </ViewMore>
      )}
    </SeriesWrapper>
  )
}

export default Series
