import React from "react"
import { graphql } from "gatsby"

import styled from "styled-components"

import Layout from "components/Layout"
import SEO from "components/SEO"
import PostList from "components/PostList"
import Title from "components/Title"

import { description, siteUrl } from "../../blog-config"

const HeaderCard = styled.section`
  margin-bottom: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  background: ${props => props.theme.colors.surface};
  padding: 18px;
`

const Subtitle = styled.span`
  display: inline-flex;
  margin-bottom: 10px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.theme.colors.accent};
  background: ${props => props.theme.colors.accentSubtle};
`

const SeriesInform = styled.p`
  margin-top: 6px;
  font-size: 14px;
  color: ${props => props.theme.colors.tertiaryText};
`

const Series = ({ pathContext, data }) => {
  const seriesName = pathContext.series
  const posts = data.posts.nodes

  return (
    <Layout>
      <SEO
        title={`SERIES: ${seriesName}`}
        description={description}
        url={siteUrl}
      />

      <HeaderCard>
        <Subtitle>SERIES</Subtitle>
        <Title as="h1" size="lg">
          {seriesName}
        </Title>

        <SeriesInform>
          {posts.length} Posts · Last updated on{" "}
          {posts[posts.length - 1].frontmatter.date}
        </SeriesInform>
      </HeaderCard>

      <PostList postList={posts} variant="card" />
    </Layout>
  )
}

export default Series

export const pageQuery = graphql`
  query BlogSeriesBySeriesName($series: String) {
    posts: allMarkdownRemark(
      sort: { order: ASC, fields: [frontmatter___date] }
      filter: { frontmatter: { series: { eq: $series } } }
    ) {
      nodes {
        excerpt(pruneLength: 200, truncate: true)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          update(formatString: "MMM DD, YYYY")
          title
          description
          tags
        }
      }
    }
  }
`
