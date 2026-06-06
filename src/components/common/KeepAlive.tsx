import { useRef, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'

/**
 * Keep-alive wrapper that preserves page state across route navigation.
 *
 * React Router v6 unmounts route components on navigation, losing local
 * state (useState, useMutation, form data, etc.). This component caches
 * visited route elements and hides inactive ones with `display: none`,
 * keeping their component instances alive.
 *
 * Usage: replace `<Outlet />` with `<KeepAlive />` in layout components.
 */
export default function KeepAlive() {
  const location = useLocation()
  const outlet = useOutlet()
  const currentPath = location.pathname
  const cacheRef = useRef(new Map<string, React.ReactElement>())
  const [cachedKeys, setCachedKeys] = useState<string[]>([])

  // Cache on first visit only — never overwrite so React keeps instances alive
  if (outlet && !cacheRef.current.has(currentPath)) {
    cacheRef.current.set(currentPath, outlet)
    setCachedKeys(Array.from(cacheRef.current.keys()))
  }

  return (
    <>
      {cachedKeys.map(path => (
        <div
          key={path}
          style={{ display: path === currentPath ? 'block' : 'none' }}
        >
          {cacheRef.current.get(path)}
        </div>
      ))}
    </>
  )
}
