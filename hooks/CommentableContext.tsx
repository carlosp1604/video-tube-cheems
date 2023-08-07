import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

export const usePostCommentable = () => {
  const { status } = useSession()
  const commentable = useRef(true)

  useEffect(() => {
    commentable.current = status === 'authenticated'
  }, [status])

  return commentable.current
}
