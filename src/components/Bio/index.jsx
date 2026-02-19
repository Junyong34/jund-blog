import React from "react"
import styled from "styled-components"

import {
  FaGithub,
  FaKaggle,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaLink,
  FaEnvelope,
} from "react-icons/fa"

import { siteUrl, description, author, links } from "../../../blog-config"

const BioWrapper = styled.section`
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 18px;
  background: ${props => props.theme.colors.surface};
  padding: 16px;
`

const profileImageRoot =
  typeof window !== "undefined" && window.location.host === "localhost:8000"
    ? "http://localhost:8000"
    : siteUrl

const Profile = styled.div`
  flex: 0 0 auto;
  width: 80px;
  height: 80px;
  border-radius: 999px;
  background-image: url(${profileImageRoot}/profile.png);
  background-size: cover;
  background-position: center;
`

const Author = styled.p`
  margin-bottom: 6px;
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`

const Description = styled.p`
  margin-bottom: 10px;
  line-height: 1.45;
  font-size: 14px;
  color: ${props => props.theme.colors.secondaryText};
`

const LinksWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const IconLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  color: ${props => props.theme.colors.icon};
  border: 1px solid ${props => props.theme.colors.border};
  transition: color 0.18s ease, transform 0.18s ease;

  &:hover {
    color: ${props => props.theme.colors.accent};
    transform: translateY(-1px);
  }
`

const ExternalLink = ({ link, label, children }) => {
  if (!link) return null

  return (
    <IconLink href={link} target="_blank" rel="noreferrer" aria-label={label}>
      {children}
    </IconLink>
  )
}

const Bio = () => {
  const { github, kaggle, instagram, facebook, linkedIn, email, etc } = links

  return (
    <BioWrapper id="bio">
      <Profile aria-hidden="true" />
      <div>
        <Author>@{author}</Author>
        <Description>{description}</Description>
        <LinksWrapper>
          <ExternalLink link={github} label="GitHub">
            <FaGithub aria-hidden="true" />
          </ExternalLink>
          <ExternalLink link={kaggle} label="Kaggle">
            <FaKaggle aria-hidden="true" />
          </ExternalLink>
          <ExternalLink link={instagram} label="Instagram">
            <FaInstagram aria-hidden="true" />
          </ExternalLink>
          <ExternalLink link={facebook} label="Facebook">
            <FaFacebook aria-hidden="true" />
          </ExternalLink>
          <ExternalLink link={linkedIn} label="LinkedIn">
            <FaLinkedin aria-hidden="true" />
          </ExternalLink>
          <ExternalLink link={email} label="Email">
            <FaEnvelope aria-hidden="true" />
          </ExternalLink>
          <ExternalLink link={etc} label="External Link">
            <FaLink aria-hidden="true" />
          </ExternalLink>
        </LinksWrapper>
      </div>
    </BioWrapper>
  )
}

export default Bio
