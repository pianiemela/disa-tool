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
  const [trigger, setTrigger] = useState(0)
  useEffect(() => {
    if (!trigger) return () => undefined
    const timeout = setTimeout(
      () => {
        if (callback) callback()
      },
      typeof delay === 'number' ? delay : 2000
    )
    return () => clearTimeout(timeout)
  }, [trigger])
  return () => setTrigger(trigger + 1)
}

export default useSave
