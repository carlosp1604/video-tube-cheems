import { useEffect, useRef } from 'react'
import { useUserContext } from './UserContext'

export const usePostCommentable = () => {
  const { status } = useUserContext()
  const commentable = useRef(true)

  useEffect(() => {
    commentable.current = status === 'SIGNED_IN'
  }, [status])

  return commentable.current
}
