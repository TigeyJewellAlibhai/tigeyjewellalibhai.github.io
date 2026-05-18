import { socialLinks } from '../../data/siteData.js'
import styles from './SiteFooter.module.css'

function SiteFooter({ theme = 'me' }) {
  const isDark = theme === 'labs'
  const iconPath = isDark ? '/media/img/me-ico-white.png' : '/media/img/me-ico-black.png'

  return (
    <footer className={`${styles.footer} ${isDark ? styles.dark : styles.light}`}>
      <div className="container py-4 text-center">
        <img src={iconPath} alt="Me icon" className={styles.icon} />
        <p className={styles.follow}>Follow Me</p>
        <ul className={styles.links}>
          {socialLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}

export default SiteFooter
