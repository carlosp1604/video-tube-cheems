import { FC } from 'react'

interface Props {
  initCodeRendered: boolean
}

export const OctoClickInPage: FC<Props> = ({ initCodeRendered }) => {
  if (
    !process.env.NEXT_PUBLIC_OCTOCLICK_IN_PAGE_ZONE_ID ||
    !process.env.NEXT_PUBLIC_OCTOCLICK_IN_PAGE_CLASS_ID ||
    !initCodeRendered
  ) {
    return null
  }

  return (
    <div
      id={ process.env.NEXT_PUBLIC_OCTOCLICK_IN_PAGE_ZONE_ID }
      className={ process.env.NEXT_PUBLIC_OCTOCLICK_IN_PAGE_CLASS_ID }
    />
  )
}
