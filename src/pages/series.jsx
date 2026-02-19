import React from "react"
import { flow, map, groupBy, sortBy, filter, reverse } from "lodash/fp"
import styled from "styled-components"
import SEO from "components/SEO"

import { graphql } from "gatsby"

import Layout from "components/Layout"
import Title from "components/Title"
import SeriesList from "components/SeriesList"
import NoContent from "components/NoContent"

import { title, description, siteUrl } from "../../blog-config"

const HeaderCard = styled.section`
  margin-bottom: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  background: ${props => props.theme.colors.surface};
  padding: 18px;
`

const SummaryText = styled.p`
  color: ${props => props.theme.colors.secondaryText};
  font-size: 15px;
`

const SeriesPage = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes
  const series = flow(
    map(post => ({ ...post.frontmatter, slug: post.fields.slug })),
    groupBy("series"),
    map(seriesGroup => ({
      name: seriesGroup[0].series,
      posts: seriesGroup,
      lastUpdated: seriesGroup[0].date,
    })),
    sortBy(seriesGroup => new Date(seriesGroup.lastUpdated)),
    filter(seriesGroup => seriesGroup.name),
    reverse
  )(posts)

  return (
    <Layout>
      <SEO title={title} description={description} url={siteUrl} />

      <HeaderCard>
        <Title as="h1" size="md">
          시리즈 {series.length}개
        </Title>
        <SummaryText>
          주제별로 묶인 포스트를 시간 순서로 확인할 수 있습니다.
        </SummaryText>
      </HeaderCard>

      {series.length === 0 ? (
        <NoContent name="series" />
      ) : (
        <SeriesList seriesList={series} />
      )}
    </Layout>
  )
}

export default SeriesPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
      nodes {
        excerpt(pruneLength: 200, truncate: true)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          update(formatString: "MMM DD, YYYY")
          title
          tags
          series
        }
      }
    }
  }
`
