import styles from './SectionTitle.module.css'

function SectionTitle({ title, subtitle, centered = false }) {
  return (
    <div className={`${styles.block} ${centered ? styles.centered : ''}`}>
      <h2 className={styles.title}>{title}</h2>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
    </div>
  )
}

export default SectionTitle
