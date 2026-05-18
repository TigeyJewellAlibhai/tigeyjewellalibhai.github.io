import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './HeroCarousel.module.css'

function HeroCarousel({ slides = [] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!slides.length) {
    return null
  }

  const activeSlide = slides[activeIndex]
  const isInternalLink = activeSlide.link?.startsWith('/')

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length)
  }

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.mediaWrap}>
        <img className={styles.media} src={activeSlide.image} alt={activeSlide.title} />
      </div>
      <div className={styles.meta}>
        <h3>{activeSlide.title}</h3>
        <p>{activeSlide.summary}</p>
        {isInternalLink ? (
          <Link to={activeSlide.link}>Open project</Link>
        ) : (
          <a href={activeSlide.link} target="_blank" rel="noreferrer">
            Open project
          </a>
        )}
      </div>
      <div className={styles.controls}>
        <button type="button" onClick={goPrev} aria-label="Previous project">
          Prev
        </button>
        <span>
          {activeIndex + 1} / {slides.length}
        </span>
        <button type="button" onClick={goNext} aria-label="Next project">
          Next
        </button>
      </div>
    </section>
  )
}

export default HeroCarousel
