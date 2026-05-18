import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styles from './ProjectTile.module.css'

const PROJECT_SLOT_MS = 560

function ProjectTile({ project }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const to = project.to
  const state = project.state
  const href = project.href && project.href !== '#' ? project.href : undefined

  const handleProjectNavigate = (event) => {
    if (!to || isTransitioning) {
      return
    }

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return
    }

    event.preventDefault()

    const shell = event.currentTarget.closest('[data-site-shell="true"]')

    if (!shell) {
      navigate(to, { state: { ...(state || {}), viaProjectSlot: true } })
      return
    }

    const tileRect = event.currentTarget.getBoundingClientRect()
    const clickX = event.clientX || tileRect.left + tileRect.width / 2
    const clickY = event.clientY || tileRect.top + tileRect.height / 2
    const originX = Math.min(Math.max(clickX, 0), window.innerWidth)
    const originY = Math.min(Math.max(clickY, 0), window.innerHeight)

    shell.style.setProperty('--slot-origin-x', `${originX}px`)
    shell.style.setProperty('--slot-origin-y', `${originY}px`)
    shell.classList.add('app-project-transition-out')
    setIsTransitioning(true)

    window.setTimeout(() => {
      navigate(to, {
        state: {
          ...(state || {}),
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

  const content = (
    <>
      <img src={project.image} alt={project.title} className={styles.image} />
      <div className={styles.body}>
        <div className={styles.header}>
          <h3>{project.title}</h3>
          <span>{project.year}</span>
        </div>
        <p>{project.description}</p>
      </div>
    </>
  )

  if (to) {
    return (
      <Link
        className={styles.tile}
        to={to}
        state={state}
        onClick={handleProjectNavigate}
        aria-disabled={isTransitioning}
      >
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a className={styles.tile} href={href} target="_blank" rel="noreferrer">
        {content}
      </a>
    )
  }

  return <article className={styles.tile}>{content}</article>
}

export default ProjectTile
