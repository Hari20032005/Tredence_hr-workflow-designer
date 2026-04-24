import { useRef } from 'react'
import {
  Play,
  Undo2,
  Redo2,
  Download,
  Upload,
  Trash2,
} from 'lucide-react'
import { useWorkflowStore } from '../../store/workflowStore'
import { useSimulation } from '../../hooks/useSimulation'
import { exportWorkflow, importWorkflow } from '../../utils/workflowSerializer'

export function TopBar() {
  const {
    workflowTitle,
    setWorkflowTitle,
    nodes,
    edges,
    undo,
    redo,
    past,
    future,
    loadWorkflow,
    reset,
  } = useWorkflowStore()
  const { runSimulation } = useSimulation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    exportWorkflow(nodes, edges, workflowTitle)
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = await importWorkflow(file)
      loadWorkflow(data.nodes, data.edges)
      setWorkflowTitle(data.title)
    } catch {
      alert('Failed to import workflow file')
    }
    e.target.value = ''
  }

  return (
    <header className="h-12 bg-white border-b border-slate-200 flex items-center px-4 gap-3 shrink-0">
      {/* Title */}
      <input
        className="flex-1 text-sm font-semibold text-slate-800 bg-transparent border-none outline-none focus:ring-0 truncate max-w-xs"
        value={workflowTitle}
        onChange={(e) => setWorkflowTitle(e.target.value)}
      />

      <div className="flex items-center gap-1 ml-auto">
        {/* Undo/Redo */}
        <button
          onClick={undo}
          disabled={past.length === 0}
          title="Undo (⌘Z)"
          className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600"
        >
          <Undo2 size={15} />
        </button>
        <button
          onClick={redo}
          disabled={future.length === 0}
          title="Redo (⌘⇧Z)"
          className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600"
        >
          <Redo2 size={15} />
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Export */}
        <button
          onClick={handleExport}
          title="Export JSON"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Download size={13} /> Export
        </button>

        {/* Import */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Import JSON"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Upload size={13} /> Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImport}
        />

        {/* Clear */}
        <button
          onClick={reset}
          title="Clear canvas"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg"
        >
          <Trash2 size={13} /> Clear
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Run */}
        <button
          onClick={runSimulation}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
        >
          <Play size={13} /> Run Workflow
        </button>
      </div>
    </header>
  )
}
