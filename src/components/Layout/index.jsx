import React, { useCallback, useEffect } from "react"
import { ThemeProvider } from "styled-components"

import { useSelector, useDispatch } from "react-redux"
import { setLight, setDark } from "reducers/theme"

import { light, dark } from "assets/theme"

import GlobalStyles from "components/GlobalStyles"

import Header from "./Header"
import Body from "./Body"
import Footer from "./Footer"

const Layout = ({ children, layoutVariant, rail }) => {
  const dispatch = useDispatch()
  const { theme } = useSelector(state => state.theme)

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    dispatch(nextTheme === "dark" ? setDark : setLight)

    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", nextTheme)
    }
  }, [dispatch, theme])

  useEffect(() => {
    if (typeof window === "undefined") return

    const isSystemDarkMode = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
    const localTheme = window.localStorage.getItem("theme")

    if (localTheme) {
      dispatch(localTheme === "dark" ? setDark : setLight)
      return
    }

    dispatch(isSystemDarkMode ? setDark : setLight)
  }, [dispatch])

  return (
    <ThemeProvider theme={theme === "light" ? light : dark}>
      <GlobalStyles />
      <Header toggleTheme={toggleTheme} />
      <Body layoutVariant={layoutVariant} rail={rail}>
        {children}
      </Body>
      <Footer />
    </ThemeProvider>
  )
}

Layout.defaultProps = {
  layoutVariant: "default",
  rail: null,
}

export default Layout
