import { FC } from 'react'
import TailwindConfig from '~/tailwind.config'
import NextNProgress from 'nextjs-progressbar'

export const AppProgressBar: FC = () => {
  return (
    <NextNProgress
      color={ TailwindConfig.theme.extend.colors['progress-bar'] }
      options={ { showSpinner: false } }
      showOnShallow={ true }
      height={ 2 }
    />
  )
}
