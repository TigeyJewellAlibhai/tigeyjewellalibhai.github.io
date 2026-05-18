import { lazy, Suspense } from 'react'
import styles from './ProjectTemplate.module.css'

const ProjectPdfCanvasView = lazy(() => import('./ProjectPdfCanvasView.jsx'))

function ProjectTemplate({ project }) {
  if (!project) {
    return null
  }

  if (project.renderMode === 'pdf' && project.pdfUrl) {
    return (
      <article className={`${styles.page} ${styles.pdfPage}`}>
        <Suspense fallback={<p className={styles.pdfLoading}>Loading PDF...</p>}>
          <ProjectPdfCanvasView
            key={project.pdfUrl}
            pdfUrl={project.pdfUrl}
            title={`${project.title} PDF`}
          />
        </Suspense>
      </article>
    )
  }

  return (
    <article className={styles.page}>
      <section className={styles.hero}>
        <img src={project.heroImage || project.image} alt={project.title} className={styles.heroImage} />
        <div className={styles.heroText}>
          <p className={styles.badge}>{project.status}</p>
          <h1>{project.title}</h1>
          <p>{project.tagline}</p>
        </div>
      </section>

      <section className="container py-5">
        <div className={styles.overviewGrid}>
          <div className={styles.body}>
            <h2>Overview</h2>
            {project.overview?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.metaCard}>
              <h3>Project Details</h3>
              <p>
                <strong>Year:</strong> {project.year}
              </p>
              <p>
                <strong>Status:</strong> {project.status}
              </p>
            </div>

            {project.recommendation?.text ? (
              <div className={styles.metaCard}>
                <h3>Recommendation</h3>
                <p className={styles.recommendationText}>{project.recommendation.text}</p>
                {project.recommendation.recommender ? (
                  <p className={styles.recommendationBy}>- {project.recommendation.recommender}</p>
                ) : null}
              </div>
            ) : project.highlights?.length ? (
              <div className={styles.metaCard}>
                <h3>Highlights</h3>
                <ul>
                  {project.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {project.links?.length ? (
              <div className={styles.metaCard}>
                <h3>Links</h3>
                <ul>
                  {project.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {project.gallery?.length ? (
        <section className="container pb-5">
          <h2 className={styles.galleryTitle}>Gallery</h2>
          <div className="row g-4">
            {project.gallery.map((item) => (
              <figure className="col-md-6 col-lg-4" key={item.image}>
                <img src={item.image} alt={item.caption} className={styles.galleryImage} />
                <figcaption className={styles.caption}>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}

export default ProjectTemplate
