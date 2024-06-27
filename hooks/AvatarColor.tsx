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
  '#03002e',
  '#010048',
  '#010057',
  '#02006c',
  '#ff0000',
  '#bf0000',
  '#800000',
  '#400000',
  '#2c4c3b',
  '#306844',
  '#182c25',
  '#455b55',
  '#181716',
  '#2a2727',
  '#393433',
  '#453f3d',
  '#57504d',
  '#304233',
  '#353b45',
  '#392e3a',
  '#3e2a2a',
  '#474747',
  '#bec7c7',
  '#d6c372',
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
