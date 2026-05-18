import { useCallback, useEffect, useState } from 'react'
import SiteShell from '../components/layout/SiteShell.jsx'
import SectionTitle from '../components/common/SectionTitle.jsx'
import ExperienceCard from '../components/common/ExperienceCard.jsx'
import ProjectTile from '../components/common/ProjectTile.jsx'
import AboutSection from '../components/common/AboutSection.jsx'
import { about, experiences, heroMediaConfig } from '../data/siteData.js'
import { featuredProjectSlugs, getProjectsBySlugs, toProjectTile } from '../data/projectsData.js'
import styles from './HomePage.module.css'

const meHeroGifModules = import.meta.glob('/public/media/bg-videos/me-hero/*.{gif,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const meHeroVideoModules = import.meta.glob('/public/media/bg-videos/me-hero/*.{mp4,webm,mov}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const meHeroGifs = Object.entries(meHeroGifModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, imageUrl]) => (imageUrl.startsWith('/public/') ? imageUrl.replace('/public', '') : imageUrl))

const meHeroVideos = Object.entries(meHeroVideoModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, videoUrl]) => (videoUrl.startsWith('/public/') ? videoUrl.replace('/public', '') : videoUrl))

const meHeroMedia = [...meHeroGifs, ...meHeroVideos]

const FALLBACK_GIF_DURATION_MS = 4200
const MIN_GIF_DURATION_MS = 1800
const MAX_GIF_DURATION_MS = 12000

function getGifDurationMsFromBytes(bytes) {
  let offset = 0
  let delayUnits = 0

  while (offset < bytes.length - 7) {
    // Graphic Control Extension: 21 F9 04 [packed] [delayLo] [delayHi] [transparency] 00
    if (bytes[offset] === 0x21 && bytes[offset + 1] === 0xf9 && bytes[offset + 2] === 0x04) {
      const frameDelayUnits = bytes[offset + 4] | (bytes[offset + 5] << 8)
      delayUnits += frameDelayUnits > 0 ? frameDelayUnits : 10
      offset += 8
      continue
    }

    offset += 1
  }

  if (!delayUnits) {
    return FALLBACK_GIF_DURATION_MS
  }

  // Delay units are in hundredths of a second.
  return Math.min(MAX_GIF_DURATION_MS, Math.max(MIN_GIF_DURATION_MS, delayUnits * 10))
}

async function getGifDurationMs(url) {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  return getGifDurationMsFromBytes(new Uint8Array(buffer))
}

function getFileNameFromUrl(url) {
  const parts = url.split('/')
  return parts[parts.length - 1]
}

function shuffleArray(items) {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const temp = result[index]
    result[index] = result[swapIndex]
    result[swapIndex] = temp
  }

  return result
}

function buildHeroPlaylist(mediaItems, firstMediaName) {
  if (!mediaItems.length) {
    return []
  }

  if (!firstMediaName) {
    return shuffleArray(mediaItems)
  }

  const chosenFirst = mediaItems.find((mediaUrl) => getFileNameFromUrl(mediaUrl) === firstMediaName)

  if (!chosenFirst) {
    return shuffleArray(mediaItems)
  }

  const remaining = mediaItems.filter((mediaUrl) => mediaUrl !== chosenFirst)
  return [chosenFirst, ...shuffleArray(remaining)]
}

const meSplashModules = import.meta.glob('/public/media/img/banner/me/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const meSplashImages = Object.entries(meSplashModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, imageUrl]) => (imageUrl.startsWith('/public/') ? imageUrl.replace('/public', '') : imageUrl))

const preferredInitialSplash =
  meSplashImages.find((imageUrl) => /me-splash-main\./i.test(imageUrl)) ||
  meSplashImages[0] ||
  '/media/img/banner/me/me-splash-main.png'

function HomePage() {
  const featuredProjects = getProjectsBySlugs(featuredProjectSlugs)
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const [gifDurations, setGifDurations] = useState({})
  const [heroPlaylist, setHeroPlaylist] = useState(() =>
    buildHeroPlaylist(meHeroMedia, heroMediaConfig.firstMedia),
  )
  const [heroSplashImage] = useState(() => {
    const hasVisitedHome = sessionStorage.getItem('hasVisitedHomePage') === 'true'

    if (!hasVisitedHome) {
      sessionStorage.setItem('hasVisitedHomePage', 'true')
      return preferredInitialSplash
    }

    if (!meSplashImages.length) {
      return preferredInitialSplash
    }

    const randomIndex = Math.floor(Math.random() * meSplashImages.length)
    return meSplashImages[randomIndex]
  })

  const activeHeroMedia =
    heroPlaylist[activeMediaIndex] || heroPlaylist[0] || '/media/img/banner/me/me-splash-main.png'
  const activeMediaIsVideo = /\.(mp4|webm|mov)$/i.test(activeHeroMedia)

  const goToNextMedia = useCallback(() => {
    setActiveMediaIndex((previous) => {
      if (!heroPlaylist.length) {
        return 0
      }

      const nextIndex = previous + 1

      if (nextIndex < heroPlaylist.length) {
        return nextIndex
      }

      setHeroPlaylist(buildHeroPlaylist(meHeroMedia, heroMediaConfig.firstMedia))
      return 0
    })
  }, [heroPlaylist])

  useEffect(() => {
    if (!meHeroGifs.length) {
      return undefined
    }

    let isCancelled = false

    const loadDurations = async () => {
      const entries = await Promise.all(
        meHeroGifs.map(async (gifUrl) => {
          try {
            const durationMs = await getGifDurationMs(gifUrl)
            return [gifUrl, durationMs]
          } catch {
            return [gifUrl, FALLBACK_GIF_DURATION_MS]
          }
        }),
      )

      if (!isCancelled) {
        setGifDurations(Object.fromEntries(entries))
      }
    }

    void loadDurations()

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    if (heroPlaylist.length < 2) {
      return undefined
    }

    const isVideo = /\.(mp4|webm|mov)$/i.test(activeHeroMedia)

    if (isVideo) {
      return undefined
    }

    const delayMs = gifDurations[activeHeroMedia] || FALLBACK_GIF_DURATION_MS

    const timeoutId = window.setTimeout(() => {
      goToNextMedia()
    }, delayMs)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [activeHeroMedia, activeMediaIndex, gifDurations, goToNextMedia, heroPlaylist])

  return (
    <SiteShell theme="me">
      <section className={styles.heroBand}>
        <div className={styles.heroReel}>
          {activeMediaIsVideo ? (
            <video
              key={activeHeroMedia}
              src={activeHeroMedia}
              className={styles.heroGif}
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={goToNextMedia}
            />
          ) : (
            <img key={activeHeroMedia} src={activeHeroMedia} alt="Featured project reel" className={styles.heroGif} />
          )}
          <div className={styles.heroForeground}>
            <img src={heroSplashImage} alt="Tigey portfolio" className={styles.heroSplash} />
            <h1 className={styles.heroTitle}>
              Hi, I'm
              <span>Tigey</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <SectionTitle title="About Me" centered />
        <AboutSection about={about} />
      </section>

      <section className="container pb-2">
        <div className="row g-4">
          {featuredProjects.map((project) => (
            <div className="col-md-6 col-lg-4" key={project.slug}>
              <ProjectTile project={toProjectTile(project, 'me')} />
            </div>
          ))}
        </div>
      </section>

      <section className="container py-5">
        <SectionTitle title="Work Experience" centered />
        {experiences?.length ? (
          <div className={styles.timeline}>
            <div className={styles.timelineTrack}>
              {experiences.map((experience, index) => {
                const sideClass = index % 2 === 0 ? styles.timelineItemLeft : styles.timelineItemRight

                return (
                  <article className={`${styles.timelineItem} ${sideClass}`} key={experience.title}>
                    <div className={styles.timelineCardWrap}>
                      <ExperienceCard experience={experience} sourceSection="me" />
                    </div>
                    <span className={styles.timelineDot} aria-hidden="true" />
                  </article>
                )
              })}
            </div>
          </div>
        ) : null}
      </section>
    </SiteShell>
  )
}

export default HomePage
