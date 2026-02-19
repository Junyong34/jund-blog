import React from "react"
import styled, { useTheme } from "styled-components"

import { Link } from "gatsby"

import { title } from "../../../../blog-config"

import {
  FaSun,
  FaMoon,
  FaTags,
  FaRss,
  FaSearch,
  FaListUl,
} from "react-icons/fa"

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 100;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.headerBackground};
  box-shadow: 0 8px 24px ${props => props.theme.colors.headerShadow};
  backdrop-filter: blur(10px);
`

const Inner = styled.div`
  margin: 0 auto;
  padding: 14px 24px;
  max-width: 1160px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 12px 14px;
  }
`

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
`

const BrandBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: ${props => props.theme.colors.accent};
  color: #ffffff;
  font-family: "Source Code Pro", sans-serif;
  font-size: 13px;
  font-weight: 700;
`

const BrandText = styled.span`
  display: inline-flex;
  flex-direction: column;
  gap: 1px;
`

const BrandTitle = styled.span`
  font-family: "Source Code Pro", "Noto Sans KR", sans-serif;
  font-size: 20px;
  font-weight: 700;
`

const BrandSub = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.tertiaryText};

  @media (max-width: 768px) {
    display: none;
  }
`

const Menu = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
`

const NavLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 10px;
  color: ${props => props.theme.colors.secondaryText};
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: color 0.18s ease, background-color 0.18s ease,
    transform 0.18s ease;

  &:hover,
  &.active {
    color: ${props => props.theme.colors.accent};
    background-color: ${props => props.theme.colors.accentSubtle};
    transform: translateY(-1px);
  }

  @media (max-width: 900px) {
    span {
      display: none;
    }

    padding: 8px;
  }
`

const ExternalLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 10px;
  color: ${props => props.theme.colors.secondaryText};
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: color 0.18s ease, background-color 0.18s ease,
    transform 0.18s ease;

  &:hover {
    color: ${props => props.theme.colors.accent};
    background-color: ${props => props.theme.colors.accentSubtle};
    transform: translateY(-1px);
  }

  @media (max-width: 900px) {
    span {
      display: none;
    }

    padding: 8px;
  }
`

const ThemeButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.icon};
  cursor: pointer;
  transition: color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;

  &:hover {
    color: ${props => props.theme.colors.accent};
    border-color: ${props => props.theme.colors.activatedBorder};
    transform: translateY(-1px);
  }
`

const Header = ({ toggleTheme }) => {
  const theme = useTheme()
  const ThemeIcon = theme.name === "light" ? FaMoon : FaSun

  return (
    <HeaderWrapper>
      <Inner>
        <Brand to="/" aria-label="홈으로 이동">
          <BrandBadge>JD</BrandBadge>
          <BrandText>
            <BrandTitle>{title}</BrandTitle>
            <BrandSub>Front-end Engineering Notes</BrandSub>
          </BrandText>
        </Brand>

        <Menu aria-label="주요 메뉴">
          <NavLink to="/tags" activeClassName="active" aria-label="태그 페이지">
            <FaTags aria-hidden="true" />
            <span>Tags</span>
          </NavLink>
          <NavLink
            to="/series"
            activeClassName="active"
            aria-label="시리즈 페이지"
          >
            <FaListUl aria-hidden="true" />
            <span>Series</span>
          </NavLink>
          <NavLink
            to="/search"
            activeClassName="active"
            aria-label="검색 페이지"
          >
            <FaSearch aria-hidden="true" />
            <span>Search</span>
          </NavLink>
          <ExternalLink href="/rss.xml" aria-label="RSS 피드">
            <FaRss aria-hidden="true" />
            <span>RSS</span>
          </ExternalLink>
          <ThemeButton
            type="button"
            onClick={toggleTheme}
            aria-label="테마 전환"
          >
            <ThemeIcon aria-hidden="true" />
          </ThemeButton>
        </Menu>
      </Inner>
    </HeaderWrapper>
  )
}

export default Header
