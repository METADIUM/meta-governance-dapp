import { useEffect, useRef } from 'react'

const usePrevious = (val) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = val
  }, [val])
  return ref
}

export { usePrevious }
