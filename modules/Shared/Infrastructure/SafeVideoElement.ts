import { Dispatch, SetStateAction } from 'react'

export async function SafePlayVideo (
  player: HTMLVideoElement,
  setPlayPromise: Dispatch<SetStateAction<Promise<void>>>
): Promise<void> {
  const isPlaying = player?.currentTime > 0 &&
    !player.paused &&
    !player.ended &&
    player?.readyState > player.HAVE_CURRENT_DATA

  if (!isPlaying) {
    setPlayPromise(player.play())
  }
}

export function SafeStopVideo (
  player: HTMLVideoElement,
  playPromise: Promise<void>
): void {
  playPromise.then(() => {
    player.load()
  })

}