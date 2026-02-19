import styled from "styled-components"

const StyledMarkdown = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  line-height: 1.78;
  overflow: hidden;

  & *:first-child {
    margin-top: 0;
  }

  & > p,
  & > ul,
  & > ol,
  & table,
  & blockquote,
  & pre,
  & img,
  & .katex-display {
    margin-top: 0;
    margin-bottom: 24px;
  }

  & p {
    word-break: keep-all;
    color: ${props => props.theme.colors.secondaryText};
  }

  & h2,
  & h3,
  & h4,
  & h5,
  & h6 {
    margin: 40px 0 14px;
    font-weight: 700;
  }

  & h2 {
    font-size: 32px;
    margin-top: 56px;
  }

  & h3 {
    font-size: 26px;
  }

  & h4 {
    font-size: 22px;
  }

  & h5 {
    font-size: 18px;
  }

  & h6 {
    font-size: 15px;
  }

  & strong {
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }

  & em {
    font-style: italic;
  }

  & blockquote {
    padding: 16px 20px;
    border-left: 4px solid ${props => props.theme.colors.blockQuoteBorder};
    border-radius: 0 12px 12px 0;
    background-color: ${props => props.theme.colors.blockQuoteBackground};
  }

  & blockquote blockquote {
    margin-top: 20px;
  }

  & table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 12px;
    overflow: hidden;
  }

  & th {
    border-bottom: 1px solid ${props => props.theme.colors.border};
    font-weight: 700;
    background: ${props => props.theme.colors.surfaceMuted};
  }

  & td {
    border-top: 1px solid ${props => props.theme.colors.border};
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  & td,
  & th {
    padding: 10px;
  }

  & tr:first-child td {
    border-top: none;
  }

  & tr:nth-child(even) {
    background-color: ${props => props.theme.colors.tableBackground};
  }

  & tr:last-child td {
    border-bottom: none;
  }

  & p > code {
    word-break: break-word;
  }

  pre[class*="language-"] {
    padding: 18px;
    border-radius: 14px;
    background-color: #0f172a;
  }

  & h2 > code.language-text,
  & h3 > code.language-text,
  & h4 > code.language-text,
  & p > code.language-text,
  & li > code.language-text,
  & table code.language-text {
    padding: 2px 6px;
    border-radius: 6px;
    font-size: 14px;
    background-color: ${props => props.theme.colors.inlineCodeBackground};
    color: ${props => props.theme.colors.text};
    font-weight: 700;
  }

  & h2 > code.language-text,
  & h3 > code.language-text,
  & h4 > code.language-text {
    font-size: inherit;
  }

  & tr:nth-child(even) code.language-text {
    background-color: ${props => props.theme.colors.inlineCodeBackgroundDarker};
  }

  & ul,
  & ol {
    padding-left: 30px;
  }

  & ol {
    list-style: decimal;
  }

  & ul {
    list-style: disc;
  }

  & ul ul {
    list-style: circle;
  }

  & ul ul ul {
    list-style: square;
  }

  & li {
    margin-bottom: 10px;
  }

  & li p {
    margin-top: 8px;
  }

  & pre {
    ::-webkit-scrollbar {
      height: 10px;
    }

    ::-webkit-scrollbar-track {
      background: ${props => props.theme.colors.scrollTrack};
    }

    ::-webkit-scrollbar-thumb {
      background: ${props => props.theme.colors.scrollHandle};
      border-radius: 999px;
    }
  }

  & pre > code {
    font-size: 14px;
  }

  & img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%;
    border-radius: 12px;
  }

  & figcaption {
    margin-top: 5px;
    text-align: center;
    color: ${props => props.theme.colors.tertiaryText};
    font-size: 12px;
    font-style: italic;
  }

  & hr {
    border: none;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  & a {
    color: ${props => props.theme.colors.accent};
    text-decoration-color: rgba(245, 158, 11, 0.42);
  }

  & a:hover {
    color: ${props => props.theme.colors.accentHover};
  }
`

export default StyledMarkdown
