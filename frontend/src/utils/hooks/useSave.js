import { useState, useEffect } from 'react'

// This is a tad hacky, but it works.
// TODO: make this less hacky.

/**
 *
 * @param {function} callback
 * @param {number} delay
 */
const useSave = (
  callback,
  delay
) => {
  const [args, setArgs] = useState([0])
  useEffect(() => {
    if (!args[0]) return () => undefined
    const timeout = setTimeout(
      () => {
        if (callback) callback(...args.slice(1))
      },
      typeof delay === 'number' ? delay : 2000
    )
    return () => clearTimeout(timeout)
  }, [args])
  return (...newArgs) => {
    setArgs([args[0] + 1, ...newArgs])
  }
}

export default useSave
