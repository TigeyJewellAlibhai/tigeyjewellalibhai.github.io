import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
  const location = useLocation()
  const { pathname } = location

  useEffect(() => {
    if (location.state?.backgroundLocation || location.state?.viaProjectReturn) {
      return
    }

    window.scrollTo(0, 0)
  }, [pathname, location.state])

  return null
}

export default ScrollToTop
