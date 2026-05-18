import SiteShell from '../components/layout/SiteShell.jsx'
import SectionTitle from '../components/common/SectionTitle.jsx'
import ProjectTile from '../components/common/ProjectTile.jsx'
import ProjectCarousel from '../components/common/ProjectCarousel.jsx'
import { labsIntro } from '../data/siteData.js'
import {
  completedProjectSlugs,
  getProjectsBySlugs,
  inDevelopmentProjectSlugs,
  toProjectTile,
} from '../data/projectsData.js'
import styles from './LabsPage.module.css'

function LabsPage() {
  const inDevelopmentProjects = getProjectsBySlugs(inDevelopmentProjectSlugs)
  const inDevelopmentTiles = inDevelopmentProjects.map((project) => toProjectTile(project, 'labs'))
  const completedProjects = getProjectsBySlugs(completedProjectSlugs)

  return (
    <SiteShell theme="labs">
      <section className={`container py-5 ${styles.pageTopPad}`}>
        {inDevelopmentTiles?.length ? <ProjectCarousel projects={inDevelopmentTiles} /> : null}
      </section>

      <section className={`container pb-5 ${styles.sectionGap}`}>
        <div className={styles.projectsHeading}>
          <SectionTitle title="(Mostly) Completed Projects" centered />
        </div>
        {completedProjects?.length ? (
          <div className="row g-4">
            {completedProjects.map((project) => (
              <div className="col-md-6 col-lg-4" key={project.slug}>
                <ProjectTile project={toProjectTile(project, 'labs')} />
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className={styles.heroBand}>
        <div className="container py-5">
          <img src={labsIntro.image} alt="TigrisLabs" className="img-fluid" />
        </div>
      </section>
    </SiteShell>
  )
}

export default LabsPage
