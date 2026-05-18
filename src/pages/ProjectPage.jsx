import { Navigate, useParams } from 'react-router-dom'
import SiteShell from '../components/layout/SiteShell.jsx'
import ProjectTemplate from '../components/projects/ProjectTemplate.jsx'
import { getProjectBySlug } from '../data/projectsData.js'

function ProjectPage({ overlayOnBackground = false }) {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)
  const isPdfProject = project?.renderMode === 'pdf' && typeof project.pdfUrl === 'string'

  if (!project) {
    return <Navigate to="/not-found" replace />
  }

  return (
    <SiteShell
      theme="project"
      overlayOnBackground={overlayOnBackground}
      overlayNavWithoutLayoutSpace={overlayOnBackground && !isPdfProject}
      showFooter={!isPdfProject}
      disableProjectEntryAnimation={isPdfProject}
    >
      <ProjectTemplate project={project} />
    </SiteShell>
  )
}

export default ProjectPage
