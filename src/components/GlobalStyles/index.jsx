import { createGlobalStyle } from "styled-components"
import reset from "styled-reset"

const GlobalStyles = createGlobalStyle`
  ${reset}

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    font-family: "Noto Sans KR", "Apple SD Gothic Neo", sans-serif;
    color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.bodyBackground};
    background-image: ${props => props.theme.colors.bodyPattern};
    background-size: 24px 24px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  main {
    min-width: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${props => props.theme.colors.text};
    font-family: "Source Code Pro", "Noto Sans KR", sans-serif;
    line-height: 1.25;
    text-wrap: balance;
  }

  p,
  li,
  blockquote,
  figcaption {
    text-wrap: pretty;
  }

  a {
    color: ${props => props.theme.colors.accent};
    text-decoration-color: rgba(245, 158, 11, 0.45);
    text-underline-offset: 2px;
    transition: color 0.18s ease, text-decoration-color 0.18s ease;
  }

  a:hover {
    color: ${props => props.theme.colors.accentHover};
    text-decoration-color: ${props => props.theme.colors.accent};
  }

  code,
  pre,
  kbd,
  samp {
    font-family: "Source Code Pro", Menlo, Monaco, Consolas, monospace;
  }

  ::selection {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.inlineCodeBackground};
  }

  :focus-visible {
    outline: 3px solid ${props => props.theme.colors.focusRing};
    outline-offset: 2px;
    border-radius: 4px;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }

    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`

export default GlobalStyles
