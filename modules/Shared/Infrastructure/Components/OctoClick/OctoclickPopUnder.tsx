import { FC } from 'react'
import { useRouter } from 'next/router'

interface Props {
  initCodeRendered: boolean
}

export const OctoclickPopUnder: FC<Props> = ({ initCodeRendered }) => {
  const { pathname } = useRouter()

  if (
    !process.env.NEXT_PUBLIC_POPUNDER_ID ||
    !process.env.NEXT_PUBLIC_OCTOCLICK_IN_PAGE_CLASS_ID ||
    !initCodeRendered ||
    !pathname.startsWith('/posts/videos')
  ) {
    return null
  }

  return (
    <div
      id={ process.env.NEXT_PUBLIC_POPUNDER_ID }
      className={ process.env.NEXT_PUBLIC_OCTOCLICK_IN_PAGE_CLASS_ID }
    />
  )
}
