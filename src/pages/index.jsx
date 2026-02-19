import React from "react"
import _ from "lodash"
import { graphql } from "gatsby"

import Layout from "components/Layout"
import SEO from "components/SEO"
import PostList from "components/PostList"
import SideTagList from "components/SideTagList"
import HomeHero from "components/HomeHero"

import { title, description, siteUrl } from "../../blog-config"

const BlogIndex = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes
  const tags = _.sortBy(data.allMarkdownRemark.group, ["totalCount"]).reverse()

  if (posts.length === 0) {
    return (
      <Layout>
        <p>아직 작성된 포스트가 없습니다.</p>
      </Layout>
    )
  }

  const featuredPosts = posts.slice(0, 2)
  const listPosts = posts.slice(featuredPosts.length)

  return (
    <Layout rail={<SideTagList tags={tags} postCount={posts.length} />}>
      <SEO title={title} description={description} url={siteUrl} />
      <HomeHero featuredPosts={featuredPosts} />
      {listPosts.length > 0 && <PostList postList={listPosts} variant="card" />}
    </Layout>
  )
}

export default BlogIndex

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
