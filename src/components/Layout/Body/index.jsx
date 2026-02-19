import React from "react"
import styled from "styled-components"

const BodyWrapper = styled.div`
  margin: 0 auto;
  padding: 104px 24px 56px;
  max-width: ${props =>
    props.$layoutVariant === "wide" ? "1280px" : "1160px"};

  @media (max-width: 768px) {
    padding: 88px 14px 40px;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 28px;

  @media (min-width: 1120px) {
    grid-template-columns: minmax(0, 760px) minmax(220px, 280px);
    justify-content: center;
    align-items: start;
  }
`

const MainColumn = styled.main`
  min-width: 0;
`

const RailColumn = styled.aside`
  display: none;

  @media (min-width: 1120px) {
    display: block;
    position: sticky;
    top: 102px;
    min-height: 160px;
  }
`

const Body = ({ children, rail, layoutVariant }) => {
  const hasRail = Boolean(rail)

  return (
    <BodyWrapper $layoutVariant={layoutVariant}>
      <Grid>
        <MainColumn>{children}</MainColumn>
        {/*<RailColumn aria-hidden={!hasRail}>{rail}</RailColumn>*/}
      </Grid>
    </BodyWrapper>
  )
}

Body.defaultProps = {
  rail: null,
  layoutVariant: "default",
}

export default Body
