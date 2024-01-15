import { useCallback } from 'react'

interface CharacterValue {
  [letter: string]: number
}

const characterValues: CharacterValue = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9,
  j: 10,
  k: 11,
  l: 12,
  m: 13,
  n: 14,
  o: 15,
  p: 16,
  q: 17,
  r: 18,
  s: 19,
  t: 20,
  u: 21,
  v: 22,
  w: 23,
  x: 24,
  y: 25,
  z: 26,
}

const allowedAvatarColors = [
  '#E74C3C',
  '#7D3C98',
  '#3498DB',
  '#16A085',
  '#2ECC71',
  '#F39C12',
  '#D35400',
  '#000080',
  '#800080',
  '#000000',
]

export const useAvatarColor = () => {
  return useCallback((avatarName: string) => {
    let avatarValue = 0

    for (let i = 0; i < avatarName.length; i++) {
      const value = characterValues[avatarName[i].toLocaleLowerCase()]

      if (!value) {
        continue
      }

      avatarValue = value + avatarValue
    }

    const colorIndex = avatarValue % allowedAvatarColors.length

    return allowedAvatarColors[colorIndex]
  }, [])
}
