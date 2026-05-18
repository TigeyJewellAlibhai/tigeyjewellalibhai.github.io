import { useEffect, useMemo, useRef, useState } from 'react'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import styles from './ProjectPdfCanvasView.module.css'

GlobalWorkerOptions.workerSrc = pdfWorkerUrl

function ProjectPdfCanvasView({ pdfUrl, title }) {
  const containerRef = useRef(null)
  const canvasRefs = useRef([])
  const linkLayerRefs = useRef([])
  const [pdfDoc, setPdfDoc] = useState(null)
  const [error, setError] = useState('')
  const [partialError, setPartialError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [containerWidth, setContainerWidth] = useState(0)
  const [renderedPages, setRenderedPages] = useState({})

  const pageCount = pdfDoc?.numPages || 0
  const pageIndices = useMemo(() => Array.from({ length: pageCount }, (_, index) => index), [pageCount])

  useEffect(() => {
    let isCancelled = false

    const loadingTask = getDocument(pdfUrl)

    loadingTask.promise
      .then((doc) => {
        if (isCancelled) {
          void doc.destroy()
          return
        }

        setPdfDoc(doc)
        setError('')
        setPartialError('')
        setRenderedPages({})
      })
      .catch(() => {
        if (!isCancelled) {
          setPdfDoc(null)
          setError('Unable to render this PDF in the page.')
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
      loadingTask.destroy()
    }
  }, [pdfUrl])

  useEffect(() => {
    const node = containerRef.current

    if (!node) {
      return undefined
    }

    const updateWidth = () => {
      const nextWidth = Math.max(0, Math.floor(node.clientWidth))
      setContainerWidth((previousWidth) => (previousWidth === nextWidth ? previousWidth : nextWidth))
    }

    updateWidth()

    const observer = new ResizeObserver(updateWidth)
    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!pdfDoc || !containerWidth) {
      return undefined
    }

    let isCancelled = false

    const withTimeout = async (promise, timeoutMs) => {
      let timeoutId = 0
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = window.setTimeout(() => reject(new Error('timeout')), timeoutMs)
      })

      try {
        return await Promise.race([promise, timeoutPromise])
      } finally {
        window.clearTimeout(timeoutId)
      }
    }

    const createLinkOverlays = async (page, viewport, pageNumber) => {
      const layer = linkLayerRefs.current[pageNumber - 1]

      if (!layer) {
        return
      }

      layer.replaceChildren()

      try {
        const annotations = await withTimeout(page.getAnnotations({ intent: 'display' }), 3000)

        annotations.forEach((annotation) => {
          if (annotation.subtype !== 'Link') {
            return
          }

          const href = annotation.url || annotation.unsafeUrl

          if (!href || !annotation.rect) {
            return
          }

          const [x1, y1, x2, y2] = viewport.convertToViewportRectangle(annotation.rect)
          const left = Math.min(x1, x2)
          const top = Math.min(y1, y2)
          const width = Math.abs(x2 - x1)
          const height = Math.abs(y2 - y1)

          if (width < 2 || height < 2) {
            return
          }

          const anchor = document.createElement('a')
          anchor.href = href
          anchor.target = '_blank'
          anchor.rel = 'noreferrer noopener'
          anchor.className = styles.pdfLink
          anchor.style.left = `${left}px`
          anchor.style.top = `${top}px`
          anchor.style.width = `${width}px`
          anchor.style.height = `${height}px`
          anchor.setAttribute('aria-label', 'PDF link')
          layer.appendChild(anchor)
        })
      } catch {
        setPartialError('Some pages or links failed to render fully.')
      }
    }

    const renderAllPages = async () => {
      for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber += 1) {
        if (isCancelled) {
          return
        }

        let canvas = canvasRefs.current[pageNumber - 1]

        while (!canvas && !isCancelled) {
          await new Promise((resolve) => {
            window.requestAnimationFrame(() => resolve())
          })
          canvas = canvasRefs.current[pageNumber - 1]
        }

        if (!canvas || isCancelled) {
          return
        }

        try {
          const page = await withTimeout(pdfDoc.getPage(pageNumber), 4000)
          const baseViewport = page.getViewport({ scale: 1 })
          const availableWidth = Math.max(220, containerWidth - 24)
          const widthScale = Math.max(0.25, availableWidth / baseViewport.width)
          const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
          const maxPixels = 1700000
          const maxScaleForPixels = Math.sqrt(
            maxPixels / Math.max(1, baseViewport.width * baseViewport.height * dpr * dpr),
          )
          const scale = Math.min(widthScale, maxScaleForPixels)
          const viewport = page.getViewport({ scale })

          canvas.width = Math.max(1, Math.floor(viewport.width * dpr))
          canvas.height = Math.max(1, Math.floor(viewport.height * dpr))
          canvas.style.width = `${Math.floor(viewport.width)}px`
          canvas.style.height = `${Math.floor(viewport.height)}px`

          const layer = linkLayerRefs.current[pageNumber - 1]
          if (layer) {
            layer.style.width = `${Math.floor(viewport.width)}px`
            layer.style.height = `${Math.floor(viewport.height)}px`
          }

          const ctx = canvas.getContext('2d', { alpha: false })
          if (!ctx) {
            throw new Error('Unable to get 2d context')
          }

          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
          const renderTask = page.render({ canvasContext: ctx, viewport })
          await withTimeout(renderTask.promise, 7000)
          await createLinkOverlays(page, viewport, pageNumber)
          page.cleanup()

          if (!isCancelled) {
            setRenderedPages((previous) => ({ ...previous, [pageNumber]: true }))
          }
        } catch {
          if (!isCancelled) {
            setPartialError('Some pages or links failed to render fully.')
          }
        }

        await new Promise((resolve) => {
          window.requestAnimationFrame(() => resolve())
        })
      }
    }

    void renderAllPages()

    return () => {
      isCancelled = true
    }
  }, [pdfDoc, containerWidth])

  return (
    <section className={styles.viewer} aria-label={title} ref={containerRef}>
      {isLoading ? <p className={styles.status}>Loading PDF...</p> : null}
      {error ? (
        <p className={styles.status}>
          {error} <a href={pdfUrl} target="_blank" rel="noreferrer">Open PDF in a new tab</a>.
        </p>
      ) : null}
      {!error && partialError ? (
        <p className={styles.status}>
          {partialError} <a href={pdfUrl} target="_blank" rel="noreferrer">Open PDF in a new tab</a>.
        </p>
      ) : null}

      {!error ? (
        <div className={styles.stack}>
          {pageIndices.map((pageIndex) => {
            const pageNumber = pageIndex + 1
            return (
              <div key={pageIndex} className={styles.pageShell}>
                <canvas
                  className={styles.pageCanvas}
                  ref={(node) => {
                    canvasRefs.current[pageIndex] = node
                  }}
                />
                <div
                  className={styles.linkLayer}
                  ref={(node) => {
                    linkLayerRefs.current[pageIndex] = node
                  }}
                />
                {!renderedPages[pageNumber] ? (
                  <div className={styles.pageLoading}>Loading page {pageNumber}...</div>
                ) : null}
              </div>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}

export default ProjectPdfCanvasView
