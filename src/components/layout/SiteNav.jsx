import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './SiteNav.module.css'

const PAGE_SWITCH_MS = 420
const PROJECT_SLOT_MS = 560

function SiteNav({
  theme = 'me',
  sourceSection = 'labs',
  inProjectOverlay = false,
  overlayWithoutLayoutSpace = false,
}) {
  const [isSwitching, setIsSwitching] = useState(false)
  const [isCompactWidth, setIsCompactWidth] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.scrollY > 18
  })
  const location = useLocation()
  const navigate = useNavigate()
  const isProjectPage = location.pathname.startsWith('/projects/') || location.pathname.startsWith('/blog')
  const returnPath = sourceSection === 'me' ? '/' : '/labs'
  const onLabsPage = location.pathname === '/labs'
  const onMePage = location.pathname === '/'
  const centerIcon = onLabsPage
    ? theme === 'labs'
      ? '/media/img/labs-ico-black.png'
      : '/media/img/labs-ico-white.png'
    : theme === 'labs'
      ? '/media/img/me-ico-black.png'
      : '/media/img/me-ico-white.png'
  const nextIcon = onLabsPage ? '/media/img/me-ico-white.png' : '/media/img/labs-ico-black.png'
  const togglePath = onLabsPage ? '/' : '/labs'

  useEffect(() => {
    const onScroll = () => {
      const shouldCompact = window.scrollY > 18
      setIsCompactWidth((current) => (current === shouldCompact ? current : shouldCompact))
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const handleBarAction = (event) => {
    if (isProjectPage) {
      if (isSwitching) {
        return
      }

      const shell = event.currentTarget.closest('[data-site-shell="true"]')

      if (!shell) {
        navigate(returnPath, { state: { viaProjectReturn: true } })
        return
      }

      const barRect = event.currentTarget.getBoundingClientRect()
      const hasStoredOrigin =
        Number.isFinite(location.state?.slotOriginX) && Number.isFinite(location.state?.slotOriginY)
      const fallbackX = Math.min(Math.max(barRect.left + barRect.width / 2, 0), window.innerWidth)
      const fallbackY = Math.min(Math.max(barRect.top + barRect.height / 2, 0), window.innerHeight)
      const originX = hasStoredOrigin ? location.state.slotOriginX * window.innerWidth : fallbackX
      const originY = hasStoredOrigin ? location.state.slotOriginY * window.innerHeight : fallbackY

      shell.style.setProperty('--slot-origin-x', `${originX}px`)
      shell.style.setProperty('--slot-origin-y', `${originY}px`)
      shell.classList.add('app-project-transition-back')
      setIsSwitching(true)

      window.setTimeout(() => {
        navigate(returnPath, {
          state: {
            viaProjectReturn: true,
            slotOriginX: window.innerWidth ? originX / window.innerWidth : 0.5,
            slotOriginY: window.innerHeight ? originY / window.innerHeight : 0.5,
          },
        })
      }, PROJECT_SLOT_MS)
      return
    }

    if (isSwitching) {
      return
    }

    const shell = event.currentTarget.closest('[data-site-shell="true"]')
    shell?.classList.add('app-page-transition-out')
    setIsSwitching(true)

    window.setTimeout(() => {
      navigate(togglePath, { state: { viaNavSwitch: true } })
    }, PAGE_SWITCH_MS)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleBarAction(event)
    }
  }

  return (
    <header
      className={`${styles.frame} ${
        inProjectOverlay
          ? overlayWithoutLayoutSpace
            ? styles.overlayNoFlow
            : styles.overlayFrame
          : ''
      }`}
    >
      <div
        className={`${styles.bar} ${theme === 'labs' ? styles.light : styles.dark} ${isProjectPage ? styles.projectBar : ''} ${!isProjectPage && isCompactWidth ? styles.compactWidth : ''} ${isSwitching ? styles.switching : ''}`}
        onClick={handleBarAction}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={isProjectPage ? 'Return to previous page' : 'Toggle between Me and Labs'}
      >
        <svg className={styles.barShape} viewBox="0 0 1000 140" preserveAspectRatio="none" aria-hidden="true">
          <path
            className={styles.barPath}
            d="M0 0 H1000 L933 96 Q902 140 860 140 H140 Q98 140 67 96 L0 0 Z"
          />
        </svg>

        <div className={styles.content}>
          {isProjectPage ? null : (
            <span className={`${styles.sideLabel} ${onMePage ? styles.active : ''}`}>Me</span>
          )}

          {isProjectPage ? (
            <span className={styles.centerButton} aria-hidden="true">
              <span className={styles.returnIcon}>↩</span>
            </span>
          ) : (
            <span className={styles.centerBadge}>
              <span className={`${styles.iconFlip} ${isSwitching ? styles.flipToNext : ''}`}>
                <img
                  src={centerIcon}
                  alt={theme === 'labs' ? 'Labs icon' : 'Me icon'}
                  className={`${styles.centerImage} ${styles.iconFaceFront}`}
                />
                <img
                  src={nextIcon}
                  alt=""
                  aria-hidden="true"
                  className={`${styles.centerImage} ${styles.iconFaceBack}`}
                />
              </span>
            </span>
          )}

          {isProjectPage ? null : (
            <span className={`${styles.sideLabel} ${onLabsPage ? styles.active : ''}`}>Labs</span>
          )}
        </div>
      </div>
    </header>
  )
}

export default SiteNav
