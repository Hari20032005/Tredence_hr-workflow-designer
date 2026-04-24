import { useEffect } from 'react'
import { useWorkflowStore } from '../store/workflowStore'

export function useKeyboardShortcuts() {
  const { undo, redo } = useWorkflowStore()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey
      if (!meta) return
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [undo, redo])
}
