import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useRef } from 'react'
import styles from './PostComments.module.scss'

// TODO: Change styles to make this component more reusable

interface AutoSizableTextAreaProps {
  setComment: Dispatch<SetStateAction<string>>
  comment: string
}

export const AutoSizableTextArea: FC<AutoSizableTextAreaProps> = ({ 
  setComment,
  comment 
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value)
  }

  useEffect(() => {
    if (textAreaRef !== null && textAreaRef.current !== null) {
      textAreaRef.current.style.height = '0px'
      let scrollHeight = textAreaRef.current.scrollHeight
      if (scrollHeight === 0) {
        scrollHeight = 40
      }
      textAreaRef.current.style.height = Math.min(scrollHeight, 90) + 'px'
    }
 
  }, [comment])

  return (
    <textarea
      className={styles.postComments__commentInput}
      placeholder={ 'Escribe tu comentario'}
      onChange={handleOnChange}
      value={comment}
      ref={textAreaRef}
    />
  )
}