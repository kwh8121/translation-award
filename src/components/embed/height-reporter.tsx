'use client'

import { useEffect } from 'react'

export function HeightReporter() {
  useEffect(() => {
    if (typeof window === 'undefined' || window.parent === window) return

    let lastHeight = 0
    const send = () => {
      const height = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      )
      if (Math.abs(height - lastHeight) < 2) return
      lastHeight = height
      window.parent.postMessage({ type: 'literary-news:height', height }, '*')
    }

    send()
    const observer = new ResizeObserver(send)
    observer.observe(document.body)
    window.addEventListener('load', send)

    return () => {
      observer.disconnect()
      window.removeEventListener('load', send)
    }
  }, [])

  return null
}
