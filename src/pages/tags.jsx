import React, { useEffect, useMemo, useState } from "react"
import _ from "lodash"
import styled from "styled-components"
import SEO from "components/SEO"
import filter from "lodash/filter"

import { graphql } from "gatsby"

import queryString from "query-string"

import Layout from "components/Layout"
import Title from "components/Title"
import TagList from "components/TagList"
import PostList from "components/PostList"

import { title, description, siteUrl } from "../../blog-config"

const HeaderCard = styled.section`
  margin-bottom: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  background: ${props => props.theme.colors.surface};
  padding: 18px;
`

const SummaryText = styled.p`
  margin-bottom: 12px;
  color: ${props => props.theme.colors.secondaryText};
  font-size: 15px;
`

const TagsPage = ({ data }) => {
  const tags = _.sortBy(data.allMarkdownRemark.group, ["totalCount"]).reverse()
  const posts = data.allMarkdownRemark.nodes

  const [selected, setSelected] = useState()

  const query =
    typeof document !== "undefined"
      ? queryString.parse(document.location.search)
      : {}

  useEffect(() => {
    setSelected(query.q)
  }, [query.q])

  const filteredPosts = useMemo(() => {
    if (!selected) return posts

    return filter(posts, post => post.frontmatter.tags.indexOf(selected) !== -1)
  }, [posts, selected])

  return (
    <Layout>
      <SEO title={title} description={description} url={siteUrl} />

      <HeaderCard>
        {selected ? (
          <Title as="h1" size="md">
            #{selected} 태그 포스트 {filteredPosts.length}개
          </Title>
        ) : (
          <Title as="h1" size="md">
            전체 태그 {tags.length}개
          </Title>
        )}

        <SummaryText>
          태그를 눌러 포스트를 필터링할 수 있습니다. 선택된 태그를 다시 누르면
          전체 보기로 돌아갑니다.
        </SummaryText>

        <TagList count tagList={tags} selected={selected} compact />
      </HeaderCard>

      <PostList postList={filteredPosts} variant="card" />
    </Layout>
  )
}

export default TagsPage

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
          description
          tags
        }
      }
    }
  }
`
