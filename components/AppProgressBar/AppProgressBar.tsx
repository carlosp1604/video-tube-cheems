import { FC } from 'react'
import TailwindConfig from '~/tailwind.config'
import dynamic from 'next/dynamic'

const NextNProgress = dynamic(() =>
  import('nextjs-progressbar'), { ssr: false }
)

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
