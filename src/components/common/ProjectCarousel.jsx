import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styles from './ProjectCarousel.module.css'

const TRANSITION_MS = 460
const PROJECT_SLOT_MS = 560

function wrapIndex(index, total) {
  if (!total) {
    return 0
  }

  return (index + total) % total
}

function ProjectLink({ project, className, children, onProjectClick }) {
  if (project.to) {
    return (
      <Link className={className} to={project.to} state={project.state} onClick={onProjectClick}>
        {children}
      </Link>
    )
  }

  if (project.href) {
    return (
      <a className={className} href={project.href} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }

  return <article className={className}>{children}</article>
}

function CardVisual({ project, imageClassName, reflectionClassName }) {
  return (
    <>
      <div
        className={`${styles.mediaWrap} ${reflectionClassName}`}
        style={{ '--reflection-image': `url(${project.image})` }}
      >
        <img src={project.image} alt={project.title} className={imageClassName} />
      </div>
    </>
  )
}

function ProjectCarousel({ projects }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [transition, setTransition] = useState(null)
  const [isProjectOpening, setIsProjectOpening] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const total = projects.length

  const activeProject = useMemo(() => projects[activeIndex], [activeIndex, projects])

  if (!total) {
    return null
  }

  const showSideCards = total > 1

  const handleProjectOpen = (event) => {
    const active = projects[activeIndex]

    if (!active?.to || transition || isProjectOpening) {
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
      navigate(active.to, {
        state: {
          ...(active.state || {}),
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
    setIsProjectOpening(true)

    window.setTimeout(() => {
      navigate(active.to, {
        state: {
          ...(active.state || {}),
          viaProjectSlot: true,
          backgroundLocation: location,
          slotOriginX: window.innerWidth ? originX / window.innerWidth : 0.5,
          slotOriginY: window.innerHeight ? originY / window.innerHeight : 0.5,
        },
      })

      window.setTimeout(() => {
        shell.classList.remove('app-project-transition-out')
        setIsProjectOpening(false)
      }, 34)
    }, PROJECT_SLOT_MS)
  }

  const triggerTransition = (direction) => {
    if (!showSideCards || transition) {
      return
    }

    const step = direction === 'right' ? 1 : -1
    const toIndex = wrapIndex(activeIndex + step, total)

    setTransition({ direction, toIndex })

    window.setTimeout(() => {
      setActiveIndex((previous) => wrapIndex(previous + step, total))
      setTransition(null)
    }, TRANSITION_MS)
  }

  const renderStageLayer = (baseIndex, layerClassName) => {
    const layerLeftIndex = wrapIndex(baseIndex - 1, total)
    const layerRightIndex = wrapIndex(baseIndex + 1, total)
    const layerActiveProject = projects[baseIndex]
    const layerLeftProject = projects[layerLeftIndex]
    const layerRightProject = projects[layerRightIndex]

    return (
      <div className={`${styles.stageLayer} ${layerClassName}`}>
        {showSideCards ? (
          <button
            type="button"
            className={`${styles.sideCard} ${styles.sideLeft}`}
            onClick={() => triggerTransition('left')}
            aria-label={`Show ${layerLeftProject.title}`}
          >
            <CardVisual
              project={layerLeftProject}
              imageClassName={styles.sideImage}
              reflectionClassName={styles.sideReflection}
            />
          </button>
        ) : null}

        <ProjectLink
          project={layerActiveProject}
          className={styles.centerCard}
          onProjectClick={handleProjectOpen}
        >
          <CardVisual
            project={layerActiveProject}
            imageClassName={styles.centerImage}
            reflectionClassName={styles.centerReflection}
          />
        </ProjectLink>

        {showSideCards ? (
          <button
            type="button"
            className={`${styles.sideCard} ${styles.sideRight}`}
            onClick={() => triggerTransition('right')}
            aria-label={`Show ${layerRightProject.title}`}
          >
            <CardVisual
              project={layerRightProject}
              imageClassName={styles.sideImage}
              reflectionClassName={styles.sideReflection}
            />
          </button>
        ) : null}
      </div>
    )
  }

  return (
    <div className={styles.carousel}>
      <div className={styles.activeInfo}>
        <p className={styles.activeYear}>In Development</p>
        <h3>{activeProject.title}</h3>
        <p className={styles.activeDescription}>{activeProject.description}</p>
      </div>

      <div className={`${styles.stage} ${transition ? styles.stageTransitioning : ''}`}>
        {transition ? (
          <>
            {renderStageLayer(
              transition.toIndex,
              `${styles.stageLayerStatic} ${styles.stageLayerNonInteractive} ${styles.stageLayerSidesOnly}`,
            )}
            {renderStageLayer(
              activeIndex,
              `${styles.stageLayerOutgoing} ${
                transition.direction === 'right' ? styles.stageLayerOutgoingRight : styles.stageLayerOutgoingLeft
              } ${styles.stageLayerNonInteractive} ${styles.stageLayerCenterOnly}`,
            )}
            {renderStageLayer(
              transition.toIndex,
              `${styles.stageLayerIncoming} ${
                transition.direction === 'right' ? styles.stageLayerIncomingRight : styles.stageLayerIncomingLeft
              } ${styles.stageLayerNonInteractive} ${styles.stageLayerCenterOnly}`,
            )}
          </>
        ) : (
          renderStageLayer(activeIndex, styles.stageLayerStatic)
        )}
      </div>

    </div>
  )
}

export default ProjectCarousel
