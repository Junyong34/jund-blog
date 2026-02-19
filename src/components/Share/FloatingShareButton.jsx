import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { FaCheck, FaLink, FaShareAlt } from "react-icons/fa"

const FloatingContainer = styled.div`
  position: fixed;
  right: 40px;
  bottom: max(16px, env(safe-area-inset-bottom));
  z-index: 120;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;

  @media (max-width: 768px) {
    right: 16px;
  }
`

const ActionGroup = styled.div`
  display: grid;
  gap: 8px;
`

const BaseButton = styled.button`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 999px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease,
    background-color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${props => props.theme.colors.activatedBorder};
    background: ${props => props.theme.colors.surfaceMuted};
  }
`

const MainButton = styled(BaseButton)`
  min-width: 96px;
  height: 44px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;

  @media (max-width: 768px) {
    min-width: 44px;
    width: 44px;
    padding: 0;

    span {
      display: none;
    }
  }
`

const ActionButton = styled(BaseButton)`
  min-width: 120px;
  height: 40px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
`

const Feedback = styled.p`
  margin: 0;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.secondaryText};
  font-size: 12px;
`

const copyWithExecCommand = value => {
  if (typeof document === "undefined") return false

  const textarea = document.createElement("textarea")
  textarea.value = value
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.left = "-9999px"

  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  textarea.setSelectionRange(0, textarea.value.length)

  const copied = document.execCommand("copy")
  document.body.removeChild(textarea)

  return copied
}

const FloatingShareButton = ({ title, description, url }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)
  const [feedback, setFeedback] = useState("")
  const containerRef = useRef(null)

  useEffect(() => {
    if (typeof navigator === "undefined") return
    setCanNativeShare(typeof navigator.share === "function")
  }, [])

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return

    const onKeyDown = event => {
      if (event.key === "Escape") setIsOpen(false)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (
      !isOpen ||
      typeof window === "undefined" ||
      typeof document === "undefined"
    )
      return

    const closeMenu = () => {
      setIsOpen(false)
    }

    const onOutsidePointerDown = event => {
      const container = containerRef.current

      if (!container) return
      if (event.target instanceof Node && !container.contains(event.target)) {
        closeMenu()
      }
    }

    window.addEventListener("scroll", closeMenu)
    document.addEventListener("mousedown", onOutsidePointerDown)
    document.addEventListener("touchstart", onOutsidePointerDown)

    return () => {
      window.removeEventListener("scroll", closeMenu)
      document.removeEventListener("mousedown", onOutsidePointerDown)
      document.removeEventListener("touchstart", onOutsidePointerDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (!feedback) return

    const timer = setTimeout(() => {
      setFeedback("")
    }, 2200)

    return () => clearTimeout(timer)
  }, [feedback])

  const handleNativeShare = async () => {
    if (!canNativeShare || typeof navigator === "undefined") return

    try {
      await navigator.share({
        title,
        text: description,
        url,
      })
      setIsOpen(false)
    } catch (error) {
      if (error && error.name !== "AbortError") {
        setFeedback("공유 창을 열지 못했습니다.")
      }
    }
  }

  const handleCopy = async () => {
    let copied = false

    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      try {
        await navigator.clipboard.writeText(url)
        copied = true
      } catch (error) {
        copied = false
      }
    }

    if (!copied) {
      copied = copyWithExecCommand(url)
    }

    setFeedback(copied ? "링크를 복사했습니다." : "링크 복사에 실패했습니다.")
    setIsOpen(false)
  }

  return (
    <FloatingContainer ref={containerRef}>
      {feedback && (
        <Feedback role="status" aria-live="polite">
          {feedback}
        </Feedback>
      )}

      {isOpen && (
        <ActionGroup role="menu" aria-label="포스트 공유 메뉴">
          {canNativeShare && (
            <ActionButton
              type="button"
              role="menuitem"
              onClick={handleNativeShare}
            >
              <FaShareAlt aria-hidden="true" />
              공유하기
            </ActionButton>
          )}

          <ActionButton type="button" role="menuitem" onClick={handleCopy}>
            {feedback === "링크를 복사했습니다." ? (
              <FaCheck aria-hidden="true" />
            ) : (
              <FaLink aria-hidden="true" />
            )}
            링크 복사
          </ActionButton>
        </ActionGroup>
      )}

      <MainButton
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={isOpen ? "공유 메뉴 닫기" : "공유 메뉴 열기"}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <FaShareAlt aria-hidden="true" />
        <span>공유</span>
      </MainButton>
    </FloatingContainer>
  )
}

export default FloatingShareButton
