import React, { useMemo, useState } from "react"
import styled from "styled-components"
import SEO from "components/SEO"
import { graphql } from "gatsby"

import Layout from "components/Layout"
import PostList from "components/PostList"
import TextField from "components/TextField"
import Title from "components/Title"

import { title, description, siteUrl } from "../../blog-config"

const SearchHeader = styled.section`
  margin-bottom: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  background: ${props => props.theme.colors.surface};
  padding: 18px;
`

const SearchDescription = styled.p`
  margin-bottom: 12px;
  color: ${props => props.theme.colors.secondaryText};
  font-size: 15px;
`

const Search = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes
  const [query, setQuery] = useState("")

  const filteredPosts = useMemo(() => {
    const lowerQuery = query.toLowerCase().trim()

    if (!lowerQuery) return posts

    return posts.filter(post => {
      const { frontmatter, rawMarkdownBody } = post
      const postTitle = frontmatter.title.toLowerCase()
      const body = rawMarkdownBody.toLowerCase()

      return postTitle.includes(lowerQuery) || body.includes(lowerQuery)
    })
  }, [posts, query])

  return (
    <Layout>
      <SEO title={title} description={description} url={siteUrl} />

      <SearchHeader>
        <Title as="h1" size="md">
          검색 결과 {filteredPosts.length}개
        </Title>
        <SearchDescription>
          제목과 본문 전체에서 키워드를 검색합니다.
        </SearchDescription>
        <TextField
          ariaLabel="포스트 검색"
          onChange={e => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
          value={query}
        />
      </SearchHeader>

      <PostList postList={filteredPosts} variant="card" />
    </Layout>
  )
}

export default Search

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt(pruneLength: 200, truncate: true)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          tags
        }
        rawMarkdownBody
      }
    }
  }
`
