import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface AdCashContextType {
  loaded: boolean
}

const AdCashContext = createContext<AdCashContextType>({ loaded: false })

export function AdCashProvider ({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (document.getElementById('aclib')) {
      setLoaded(true)

      return
    }

    const script = document.createElement('script')

    script.id = 'aclib'
    script.type = 'text/javascript'
    script.src = '//acscdn.com/script/aclib.js'
    script.async = true
    script.onload = () => setLoaded(true)
    script.onerror = () => console.error('Error cargando AdCash script')

    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  return (
    <AdCashContext.Provider value={ { loaded } }>
      { children }
    </AdCashContext.Provider>
  )
}

export function useAdCash () {
  return useContext(AdCashContext)
}
