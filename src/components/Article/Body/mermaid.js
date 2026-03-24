let mermaidLoader = null
let mermaidInitialized = false

const MERMAID_LANGUAGE_CLASS = "language-mermaid"

const hasMermaidLanguageClass = element => {
  if (!element) {
    return false
  }

  if (element.classList?.contains(MERMAID_LANGUAGE_CLASS)) {
    return true
  }

  return (
    typeof element.className === "string" &&
    element.className.includes(MERMAID_LANGUAGE_CLASS)
  )
}

const findMermaidCodeBlocks = root => {
  const seen = new Set()

  return Array.from(root.querySelectorAll("pre code"))
    .map(code => {
      const pre = code.closest("pre")

      if (!pre || seen.has(pre)) {
        return null
      }

      if (!hasMermaidLanguageClass(code) && !hasMermaidLanguageClass(pre)) {
        return null
      }

      seen.add(pre)
      return pre
    })
    .filter(Boolean)
}

const replaceWithMermaidContainer = pre => {
  const code = pre.querySelector("code")
  const definition = (code?.textContent || pre.textContent || "").trim()

  if (!definition) {
    return null
  }

  const container = document.createElement("div")
  const prismWrapper = pre.parentElement?.classList.contains("gatsby-highlight")
    ? pre.parentElement
    : pre

  container.className = "mermaid"
  container.textContent = definition

  prismWrapper.replaceWith(container)

  return container
}

const loadMermaid = async () => {
  if (!mermaidLoader) {
    mermaidLoader = import("mermaid").then(module => {
      const mermaid = module.default || module

      if (!mermaidInitialized) {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
        })
        mermaidInitialized = true
      }

      return mermaid
    })
  }

  return mermaidLoader
}

export const renderMermaidDiagrams = async root => {
  const mermaidBlocks = findMermaidCodeBlocks(root)

  if (mermaidBlocks.length === 0) {
    return 0
  }

  const mermaidContainers = mermaidBlocks
    .map(replaceWithMermaidContainer)
    .filter(container => container?.isConnected)

  if (mermaidContainers.length === 0) {
    return 0
  }

  const mermaid = await loadMermaid()

  mermaid.init(undefined, mermaidContainers)

  return mermaidContainers.length
}
