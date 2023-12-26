import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Custom404 () {
  const { replace, locale } = useRouter()

  const currentLocale = locale ?? 'en'

  useEffect(() => {
    replace(`/${currentLocale}/not-found`)
  })

  return null
}
