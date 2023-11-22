import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { ParsedUrlQuery } from 'querystring'

export function useUpdateQuery () {
  const { push, query } = useRouter()

  return useCallback(
    async (query: ParsedUrlQuery): Promise<void> => {
      await push({
        query,
      }, undefined, { shallow: true, scroll: false })
    },
    [query]
  )
}
