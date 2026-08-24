import { useContext } from 'react'
import { ContentContext } from './content-core'

export function useContent() {
  const context = useContext(ContentContext)
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider')
  }
  return context
}

export default useContent
