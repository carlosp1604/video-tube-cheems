import { useEffect, useState } from 'react'

export const useTimer = ({ initialTime = 0 }) => {
  const [time, setTime] = useState<number>(initialTime)

  const getTime = () => {
    const newTime = time + 1

    setTime(newTime)
  }

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000)

    return () => clearInterval(interval)
  }, [time])

  return time
}
