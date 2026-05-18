import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SiteNav from './SiteNav.jsx'
import SiteFooter from './SiteFooter.jsx'
import styles from './SiteShell.module.css'

const PAGE_SWITCH_MS = 420
const PROJECT_SLOT_MS = 560

function SiteShell({
  children,
  theme = 'me',
  overlayOnBackground = false,
  overlayNavWithoutLayoutSpace = false,
  showFooter = true,
  disableProjectEntryAnimation = false,
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isEntering, setIsEntering] = useState(false)
  const [isProjectEntering, setIsProjectEntering] = useState(
    () => theme === 'project' && Boolean(location.state?.viaProjectSlot) && !disableProjectEntryAnimation,
  )
  const [isOverlayClosing, setIsOverlayClosing] = useState(false)
  const overlayCloseTimeoutRef = useRef(0)
  const viaNavSwitch = Boolean(location.state?.viaNavSwitch)
  const viaProjectSlot = Boolean(location.state?.viaProjectSlot)
  const isProjectLayout = theme === 'project'
  const isProjectOverlay = isProjectLayout && overlayOnBackground

  useEffect(() => {
    if (location.pathname === '/') {
      sessionStorage.setItem('lastMainPage', 'me')
    }

    if (location.pathname === '/labs') {
      sessionStorage.setItem('lastMainPage', 'labs')
    }
  }, [location.pathname])

  useEffect(() => {
    if (!viaNavSwitch) {
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsEntering(true)

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsEntering(false)
      })
    })

    const timeoutId = window.setTimeout(() => {
      setIsEntering(false)
    }, PAGE_SWITCH_MS)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timeoutId)
    }
  }, [location.pathname, viaNavSwitch])

  useEffect(() => {
    if (!isProjectLayout || !viaProjectSlot || disableProjectEntryAnimation) {
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsProjectEntering(true)
  }, [isProjectLayout, viaProjectSlot, location.pathname, disableProjectEntryAnimation])

  useEffect(() => {
    if (!isProjectOverlay) {
      return
    }

    const cleanupId = window.requestAnimationFrame(() => {
      const transitioningShells = document.querySelectorAll('[data-site-shell="true"].app-project-transition-out')
      transitioningShells.forEach((node) => {
        node.classList.remove('app-project-transition-out')
      })
    })

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.cancelAnimationFrame(cleanupId)
      document.body.style.overflow = previousOverflow
    }
  }, [isProjectOverlay])

  useEffect(() => {
    return () => {
      if (overlayCloseTimeoutRef.current) {
        window.clearTimeout(overlayCloseTimeoutRef.current)
      }
    }
  }, [])

  const fromSection =
    location.state?.fromSection || sessionStorage.getItem('lastMainPage') || 'labs'

  const resolvedTheme = theme === 'project' ? (fromSection === 'me' ? 'me' : 'labs') : theme
  const themeClass = resolvedTheme === 'labs' ? styles.labs : styles.me
  const slotOriginX = Number.isFinite(location.state?.slotOriginX)
    ? `${location.state.slotOriginX * 100}%`
    : '50%'
  const slotOriginY = Number.isFinite(location.state?.slotOriginY)
    ? `${location.state.slotOriginY * 100}%`
    : '42%'
  const returnPath = fromSection === 'me' ? '/' : '/labs'

  const handleOverlayPointerDown = (event) => {
    if (!isProjectOverlay || isOverlayClosing || event.button !== 0) {
      return
    }

    if (event.target.closest(`.${styles.projectPanel}`)) {
      return
    }

    const shell = event.currentTarget
    const originX = Math.min(Math.max(event.clientX, 0), window.innerWidth)
    const originY = Math.min(Math.max(event.clientY, 0), window.innerHeight)

    shell.style.setProperty('--slot-origin-x', `${originX}px`)
    shell.style.setProperty('--slot-origin-y', `${originY}px`)
    shell.classList.add('app-project-transition-back')
    setIsOverlayClosing(true)

    overlayCloseTimeoutRef.current = window.setTimeout(() => {
      navigate(returnPath, {
        state: {
          viaProjectReturn: true,
          slotOriginX: window.innerWidth ? originX / window.innerWidth : 0.5,
          slotOriginY: window.innerHeight ? originY / window.innerHeight : 0.5,
        },
      })
    }, PROJECT_SLOT_MS)
  }

  return (
    <div
      className={`${styles.page} ${themeClass} ${isEntering ? styles.entering : ''} ${
        isProjectLayout ? styles.projectStage : ''
      } ${isProjectOverlay ? styles.projectOverlay : ''} ${
        isProjectEntering && !disableProjectEntryAnimation ? styles.projectEntering : ''
      }`}
      data-site-shell="true"
      style={{ '--slot-origin-x': slotOriginX, '--slot-origin-y': slotOriginY }}
      onMouseDown={isProjectOverlay ? handleOverlayPointerDown : undefined}
    >
      {isProjectLayout ? (
        <div className={styles.projectPanel}>
          <SiteNav
            theme={resolvedTheme}
            sourceSection={fromSection}
            inProjectOverlay
            overlayWithoutLayoutSpace={isProjectOverlay && overlayNavWithoutLayoutSpace}
          />
          
          <main className={styles.projectMain}>{children}</main>
          {showFooter ? <SiteFooter theme={resolvedTheme} /> : null}
        </div>
      ) : (
        <>
          <SiteNav theme={resolvedTheme} sourceSection={fromSection} />
          <main>{children}</main>
          <SiteFooter theme={resolvedTheme} />
        </>
      )}
    </div>
  )
}

export default SiteShell
