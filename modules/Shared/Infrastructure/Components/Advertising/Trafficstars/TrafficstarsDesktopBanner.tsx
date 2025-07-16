import styles from '~/modules/Shared/Infrastructure/Components/Advertising/Banner.module.scss'

export default function TrafficstarsDesktopBanner () {
  return (
    <div className={ styles.banner__bannerWrapper250x300 }>
      <iframe
        width="300"
        height="250"
        frameBorder="0"
        scrolling="no"
        src="//tsyndicate.com/iframes2/ae2ccba0e1ad48c2b52c62e6fa0337b4.html?"
      />
    </div>
  )
}
