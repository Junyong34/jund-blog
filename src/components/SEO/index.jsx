import React from "react"
import { Helmet } from "react-helmet"
import {
  description as defaultDescription,
  siteUrl,
} from "../../../blog-config"

const toAbsoluteUrl = value => {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value

  const trimmedSiteUrl = siteUrl.replace(/\/+$/, "")
  const normalizedPath = value.startsWith("/") ? value : `/${value}`

  return `${trimmedSiteUrl}${normalizedPath}`
}

const SEO = ({ title, description, url, image, type }) => {
  const resolvedDescription = description || defaultDescription
  const resolvedUrl = toAbsoluteUrl(url) || siteUrl
  const resolvedImage = toAbsoluteUrl(image || "/og-image.png")

  return (
    <Helmet>
      <title>{title}</title>

      <link rel="canonical" href={resolvedUrl} />
      <meta property="og:url" content={resolvedUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:description" content={resolvedDescription} />

      <meta name="description" content={resolvedDescription} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={resolvedImage} />

      {/* Google tag (gtag.js) */}
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-Y92P8TWLB7"
      />
      <script>{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-Y92P8TWLB7');
      `}</script>
    </Helmet>
  )
}

SEO.defaultProps = {
  description: defaultDescription,
  image: "/og-image.png",
  type: "website",
  url: siteUrl,
}

export default SEO
