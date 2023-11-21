import { useRouter } from 'next/router'
import { useCallback } from 'react'

export function useUpdateQuery () {
  const { push, query, pathname, locale } = useRouter()

  return useCallback(
    async (pathname: string): Promise<void> => {
      await push({
        pathname,
      }, undefined, { shallow: true, scroll: false })
    },
    [query, pathname]
  )
}
