import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './ExperienceCard.module.css'

const PROJECT_SLOT_MS = 560

function ExperienceCard({ experience, sourceSection = 'me' }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const popupTo = experience.popupProjectSlug ? `/projects/${experience.popupProjectSlug}` : undefined

  const navigateToProjectPopup = (event, explicitTo) => {
    const to = explicitTo || popupTo

    if (!to || isTransitioning) {
      return
    }

    const shell = event.currentTarget.closest('[data-site-shell="true"]')

    if (!shell) {
      navigate(to, {
        state: {
          fromSection: sourceSection,
          viaProjectSlot: true,
          backgroundLocation: location,
        },
      })
      return
    }

    const cardRect = event.currentTarget.getBoundingClientRect()
    const clickX = event.clientX || cardRect.left + cardRect.width / 2
    const clickY = event.clientY || cardRect.top + cardRect.height / 2
    const originX = Math.min(Math.max(clickX, 0), window.innerWidth)
    const originY = Math.min(Math.max(clickY, 0), window.innerHeight)

    shell.style.setProperty('--slot-origin-x', `${originX}px`)
    shell.style.setProperty('--slot-origin-y', `${originY}px`)
    shell.classList.add('app-project-transition-out')
    setIsTransitioning(true)

    window.setTimeout(() => {
      navigate(to, {
        state: {
          fromSection: sourceSection,
          viaProjectSlot: true,
          backgroundLocation: location,
          slotOriginX: window.innerWidth ? originX / window.innerWidth : 0.5,
          slotOriginY: window.innerHeight ? originY / window.innerHeight : 0.5,
        },
      })

      window.setTimeout(() => {
        shell.classList.remove('app-project-transition-out')
        setIsTransitioning(false)
      }, 34)
    }, PROJECT_SLOT_MS)
  }

  const handleCardClick = (event) => {
    if (!popupTo) {
      return
    }

    if (event.target.closest('a')) {
      return
    }

    navigateToProjectPopup(event)
  }

  const handleCardKeyDown = (event) => {
    if (!popupTo) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      navigateToProjectPopup(event)
    }
  }

  const handleLinkClick = (event, href) => {
    event.stopPropagation()

    if (!href?.startsWith('/projects/')) {
      return
    }

    event.preventDefault()
    navigateToProjectPopup(event, href)
  }

  return (
    <article
      className={`${styles.card} ${popupTo ? styles.clickableCard : ''}`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role={popupTo ? 'button' : undefined}
      tabIndex={popupTo ? 0 : undefined}
      aria-disabled={popupTo ? isTransitioning : undefined}
      aria-label={popupTo ? `Open ${experience.title} details` : undefined}
    >
      <img src={experience.image} alt={experience.title} className={styles.image} />
      <div>
        <h3 className={styles.title}>{experience.title}</h3>
        <p className={styles.period}>{experience.period}</p>
        <p className={styles.summary}>{experience.summary}</p>
        {experience.links?.length ? (
          <div className={styles.links}>
            {experience.links.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                target={link.href.startsWith('/') ? undefined : '_blank'}
                rel={link.href.startsWith('/') ? undefined : 'noreferrer'}
                onClick={(event) => handleLinkClick(event, link.href)}
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}

export default ExperienceCard
