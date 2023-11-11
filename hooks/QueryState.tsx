import { useRouter } from 'next/router'
import { useCallback } from 'react'

export interface QueryItem {
  key: string
  value: string
}

export function useUpdateQuery () {
  const { push, query } = useRouter()

  const setQuery = useCallback(
    async (items: QueryItem[]): Promise<void> => {
      const newQuery = { ...query }

      items.forEach((item) => {
        const param = query[item.key]

        if (param && param === item.value) {
          return
        }

        newQuery[item.key] = item.value
      })

      await push({
        query: newQuery,
      }, undefined, { shallow: true, scroll: false })
    },
    [query, push]
  )

  return setQuery
}
