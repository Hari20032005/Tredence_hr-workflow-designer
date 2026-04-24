import { useRef } from 'react'
import {
  Play, Undo2, Redo2, Download, Upload, Trash2,
  ChevronDown, AlignCenter, Clock,
} from 'lucide-react'
import { useWorkflowStore } from '../../store/workflowStore'
import { useSimulation } from '../../hooks/useSimulation'
import { exportWorkflow, importWorkflow } from '../../utils/workflowSerializer'

export function TopBar() {
  const {
    workflowTitle, setWorkflowTitle,
    nodes, edges, undo, redo, past, future,
    loadWorkflow, reset,
  } = useWorkflowStore()
  const { runSimulation } = useSimulation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleExport() { exportWorkflow(nodes, edges, workflowTitle) }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = await importWorkflow(file)
      loadWorkflow(data.nodes, data.edges)
      setWorkflowTitle(data.title)
    } catch { alert('Failed to import workflow file') }
    e.target.value = ''
  }

  return (
    <header className="h-11 bg-white border-b border-slate-200 flex items-center px-4 gap-2 shrink-0">
      {/* Left — undo/redo */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={undo} disabled={past.length === 0} title="Undo (⌘Z)"
          className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-500"
        >
          <Undo2 size={14} />
        </button>
        <button
          onClick={redo} disabled={future.length === 0} title="Redo (⌘⇧Z)"
          className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-500"
        >
          <Redo2 size={14} />
        </button>
      </div>

      {/* Center — workflow title (matches reference center position) */}
      <div className="flex-1 flex justify-center">
        <button className="flex items-center gap-1 text-sm font-semibold text-slate-800 hover:text-slate-600 transition-colors group">
          <input
            className="bg-transparent border-none outline-none text-center font-semibold text-slate-800 w-56 cursor-text"
            value={workflowTitle}
            onChange={(e) => setWorkflowTitle(e.target.value)}
          />
          <ChevronDown size={13} className="text-slate-400 group-hover:text-slate-600" />
        </button>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1">
        {/* Icon group matches the reference top-right icons */}
        <button
          onClick={handleExport} title="Export JSON"
          className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
        >
          <Download size={15} />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()} title="Import JSON"
          className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
        >
          <Upload size={15} />
        </button>
        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

        <button
          onClick={reset} title="Clear canvas"
          className="p-1.5 rounded hover:bg-red-50 hover:text-red-500 text-slate-500 transition-colors"
        >
          <Trash2 size={15} />
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Reference shows play + layout icons */}
        <button className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Align nodes">
          <AlignCenter size={15} />
        </button>
        <button className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="History">
          <Clock size={15} />
        </button>

        {/* Run button — orange, matches Tredence brand */}
        <button
          onClick={runSimulation}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm ml-1"
        >
          <Play size={13} /> Run
        </button>
      </div>
    </header>
  )
}
