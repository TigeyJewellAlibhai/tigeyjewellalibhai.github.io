import { Link } from 'react-router-dom'
import SiteShell from '../components/layout/SiteShell.jsx'

function NotFoundPage() {
  return (
    <SiteShell theme="me">
      <section className="container py-5 text-center">
        <h1>Page not found</h1>
        <p className="text-muted">The route you requested is not available yet.</p>
        <Link to="/" className="btn btn-dark mt-3">
          Back to home
        </Link>
      </section>
    </SiteShell>
  )
}

export default NotFoundPage
