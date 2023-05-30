import { useEffect, useRef } from 'react'
import { useUserContext } from './UserContext'

export const usePostCommentable = () => {
  const { status } = useUserContext()
  const commentable = useRef(true)

  useEffect(() => {
    if (status === 'SIGNED_IN') {
      commentable.current = true
    }
    else {
      commentable.current = false
    }
  }, [status])

  return commentable.current
}