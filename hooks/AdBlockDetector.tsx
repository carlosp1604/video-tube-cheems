import { useEffect, useState } from 'react'

export function useAdBlockDetector () {
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    /**
    const script = document.createElement('script')

    script.src = 'https://loopflavour.com/e1f43240407676625505d3a7d12fd9d6/invoke.js'
    script.async = true

    script.onerror = () => {
      setIsBlocked(true)
    }

    script.onload = () => {
      setIsBlocked(false)
    }

    document.body.appendChild(script)

    return () => {
      script.remove()
    }
    */
  }, [])

  return isBlocked
}
