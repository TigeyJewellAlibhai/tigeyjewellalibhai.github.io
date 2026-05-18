import styles from './AboutSection.module.css'

function AboutSection({ about }) {
  if (!about) {
    return null
  }

  return (
    <section className="container py-5">
      <div className={styles.wrap}>
        <img src={about.image} alt="Tigey portrait" className={styles.image} />
        <div>
          {about.paragraphs?.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
