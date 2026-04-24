import { Play, CheckSquare, ShieldCheck, Zap, Flag, LayoutTemplate } from 'lucide-react'
import type { NodeType } from '../../types/nodes'

interface PaletteItem {
  type: NodeType
  label: string
  description: string
  icon: React.ReactNode
  color: string
  borderColor: string
}

const PALETTE_ITEMS: PaletteItem[] = [
  {
    type: 'start',
    label: 'Start',
    description: 'Workflow entry point',
    icon: <Play size={16} />,
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-200 hover:border-emerald-400',
  },
  {
    type: 'task',
    label: 'Task',
    description: 'Human task or action',
    icon: <CheckSquare size={16} />,
    color: 'bg-blue-500',
    borderColor: 'border-blue-200 hover:border-blue-400',
  },
  {
    type: 'approval',
    label: 'Approval',
    description: 'Approval or review step',
    icon: <ShieldCheck size={16} />,
    color: 'bg-amber-500',
    borderColor: 'border-amber-200 hover:border-amber-400',
  },
  {
    type: 'automatedStep',
    label: 'Auto Step',
    description: 'System-triggered action',
    icon: <Zap size={16} />,
    color: 'bg-purple-500',
    borderColor: 'border-purple-200 hover:border-purple-400',
  },
  {
    type: 'end',
    label: 'End',
    description: 'Workflow completion',
    icon: <Flag size={16} />,
    color: 'bg-rose-500',
    borderColor: 'border-rose-200 hover:border-rose-400',
  },
]

const TEMPLATES = [
  { label: 'Employee Onboarding', icon: '👤' },
  { label: 'Leave Approval', icon: '📅' },
  { label: 'Doc Verification', icon: '📄' },
]

interface NodePaletteProps {
  onLoadTemplate: (name: string) => void
}

export function NodePalette({ onLoadTemplate }: NodePaletteProps) {
  function onDragStart(e: React.DragEvent, type: NodeType) {
    e.dataTransfer.setData('application/reactflow', type)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="w-56 bg-slate-900 text-white flex flex-col border-r border-slate-800">
      <div className="px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-xs font-bold">
            T
          </div>
          <span className="font-semibold text-sm">Tredence Studio</span>
        </div>
        <p className="text-xs text-slate-400">HR Workflow Designer</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
            Nodes
          </p>
          <p className="text-xs text-slate-500 px-1 mb-2">Drag onto canvas →</p>
          <div className="space-y-1.5">
            {PALETTE_ITEMS.map((item) => (
              <div
                key={item.type}
                draggable
                onDragStart={(e) => onDragStart(e, item.type)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border bg-slate-800 cursor-grab active:cursor-grabbing select-none transition-all ${item.borderColor}`}
              >
                <span className={`${item.color} text-white rounded p-1 shrink-0`}>
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white">{item.label}</p>
                  <p className="text-[10px] text-slate-400 truncate">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1">
            <LayoutTemplate size={10} /> Templates
          </p>
          <div className="space-y-1">
            {TEMPLATES.map((t) => (
              <button
                key={t.label}
                onClick={() => onLoadTemplate(t.label)}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
              >
                <span className="text-base">{t.icon}</span>
                <span className="text-xs text-slate-300">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
