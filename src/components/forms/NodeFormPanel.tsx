import { X, Plus, Search, TrendingUp } from 'lucide-react'
import { useWorkflowStore } from '../../store/workflowStore'
import { StartNodeForm } from './StartNodeForm'
import { TaskNodeForm } from './TaskNodeForm'
import { ApprovalNodeForm } from './ApprovalNodeForm'
import { AutomatedStepNodeForm } from './AutomatedStepNodeForm'
import { EndNodeForm } from './EndNodeForm'
import type {
  StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedStepNodeData, EndNodeData,
} from '../../types/nodes'
import { clsx } from 'clsx'

const NODE_TYPE_LABELS: Record<string, string> = {
  start: 'Start Node', task: 'Task Node', approval: 'Approval Node',
  automatedStep: 'Automated Step', end: 'End Node',
}

const NODE_COLORS: Record<string, string> = {
  start: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  task: 'text-blue-600 bg-blue-50 border-blue-200',
  approval: 'text-amber-600 bg-amber-50 border-amber-200',
  automatedStep: 'text-purple-600 bg-purple-50 border-purple-200',
  end: 'text-rose-600 bg-rose-50 border-rose-200',
}

const WORKFLOW_INSIGHTS = [
  {
    label: 'Workflow A',
    sublabel: 'Triggered by User Actions',
    bars: [
      { w: 'w-16', color: 'bg-rose-400' },
      { w: 'w-28', color: 'bg-blue-400' },
      { w: 'w-20', color: 'bg-emerald-400' },
    ],
    badges: [
      { label: 'Task: 29', color: 'bg-rose-100 text-rose-600' },
      { label: 'Exec: 10', color: 'bg-blue-100 text-blue-600' },
      { label: 'Done: 13', color: 'bg-emerald-100 text-emerald-600' },
    ],
  },
  {
    label: 'Workflow B',
    sublabel: 'Scheduled Automation',
    bars: [
      { w: 'w-10', color: 'bg-rose-400' },
      { w: 'w-24', color: 'bg-blue-400' },
      { w: 'w-16', color: 'bg-emerald-400' },
    ],
    badges: [
      { label: 'Task: 10', color: 'bg-rose-100 text-rose-600' },
      { label: 'Exec: 33', color: 'bg-blue-100 text-blue-600' },
      { label: 'Done: 17', color: 'bg-emerald-100 text-emerald-600' },
    ],
  },
]

const FLOW_OBJECTIVES = [
  { label: 'Output Generation', sublabel: 'Compiling Delivering Outputs', icon: '🔗', stats: ['🚀 15', '✅ 55', '✓ 41', '⚡ 69'] },
  { label: 'Lorem Ipsum', sublabel: 'Lorem Ipsum Sit Dolor', icon: '📅', stats: ['⚙ 11', '🚀 27', '✓ 41', '⚡ 72'] },
  { label: 'Action Trigger', sublabel: 'Performing Tasks Conditions', icon: '⚡', stats: ['⚙ 87', '🚀 34', '✓ 17', '⚡ 18'] },
  { label: 'Data Validation', sublabel: 'Ensuring Data Accuracy', icon: '🔍', stats: ['⚙ 91', '🚀 18', '✓ 20', '⚡ 21'] },
  { label: 'Registration Form', sublabel: 'User registration process', icon: '📋', stats: ['⚙ 11', '🚀 27', '✓ 41', '⚡ 72'] },
]

function InsightCard({ item }: { item: typeof FLOW_OBJECTIVES[0] }) {
  return (
    <div className="flex items-start gap-2 p-2 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
      <span className="text-base shrink-0">{item.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <p className="text-xs font-medium text-slate-700 truncate">{item.label}</p>
          <button className="text-slate-300 hover:text-slate-500 shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <circle cx="2" cy="6" r="1"/><circle cx="6" cy="6" r="1"/><circle cx="10" cy="6" r="1"/>
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-slate-400 truncate mb-1.5">{item.sublabel}</p>
        <div className="flex flex-wrap gap-1">
          {item.stats.map((s, i) => (
            <span key={i} className={clsx(
              'text-[10px] px-1.5 py-0.5 rounded-full border font-medium',
              i === 0 && 'border-slate-200 text-slate-500 bg-slate-50',
              i === 1 && 'border-blue-200 text-blue-600 bg-blue-50',
              i === 2 && 'border-emerald-200 text-emerald-600 bg-emerald-50',
              i === 3 && 'border-purple-200 text-purple-600 bg-purple-50',
            )}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function NodeFormPanel() {
  const { nodes, selectedNodeId, selectNode } = useWorkflowStore()
  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  return (
    <aside className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0">
      {selectedNode ? (
        <>
          {/* Node edit header */}
          <div className={clsx(
            'flex items-center justify-between px-4 py-3 border-b border-slate-100',
            NODE_COLORS[selectedNode.data.type] ?? 'text-slate-700 bg-slate-50 border-slate-200'
          )}>
            <h2 className="text-sm font-semibold">
              {NODE_TYPE_LABELS[selectedNode.data.type] ?? selectedNode.data.type}
            </h2>
            <button onClick={() => selectNode(null)} className="hover:opacity-70 rounded p-0.5 transition-opacity">
              <X size={14} />
            </button>
          </div>
          {/* key forces form remount when switching between nodes of the same type */}
          <div key={selectedNode.id} className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedNode.data.type === 'start' && <StartNodeForm nodeId={selectedNode.id} data={selectedNode.data as StartNodeData} />}
            {selectedNode.data.type === 'task' && <TaskNodeForm nodeId={selectedNode.id} data={selectedNode.data as TaskNodeData} />}
            {selectedNode.data.type === 'approval' && <ApprovalNodeForm nodeId={selectedNode.id} data={selectedNode.data as ApprovalNodeData} />}
            {selectedNode.data.type === 'automatedStep' && <AutomatedStepNodeForm nodeId={selectedNode.id} data={selectedNode.data as AutomatedStepNodeData} />}
            {selectedNode.data.type === 'end' && <EndNodeForm nodeId={selectedNode.id} data={selectedNode.data as EndNodeData} />}
          </div>
        </>
      ) : (
        <>
          {/* Performance Overview — matches Reference 1 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Performance Overview</h2>
              <p className="text-[10px] text-slate-400">Overview Performance Time</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Insight Metrics */}
            <div className="px-4 pt-3 pb-2 border-b border-slate-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-slate-700">Insight Metrics</h3>
                <button className="text-slate-400 hover:text-slate-600"><Plus size={13} /></button>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 mb-3">
                <Search size={12} className="text-slate-400" />
                <input className="flex-1 text-xs bg-transparent outline-none text-slate-500 placeholder:text-slate-400" placeholder="Search Here..." />
                <kbd className="text-[10px] text-slate-400 bg-white border border-slate-200 rounded px-1">⌘K</kbd>
              </div>

              {/* Automation Coverage */}
              <div className="flex items-center justify-between mb-3 p-2 rounded-lg bg-slate-50">
                <div>
                  <p className="text-xs font-medium text-slate-700">Automation Coverage</p>
                  <p className="text-[10px] text-slate-400">Your last week is better <span className="text-emerald-600 font-semibold">72%</span></p>
                </div>
                <button className="text-slate-300 hover:text-slate-500"><X size={12} /></button>
              </div>

              {/* Workflow A & B */}
              {WORKFLOW_INSIGHTS.map((wf) => (
                <div key={wf.label} className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-xs font-medium text-slate-700">{wf.label}</p>
                      <p className="text-[10px] text-slate-400">{wf.sublabel}</p>
                    </div>
                    <button className="text-slate-300 hover:text-slate-500"><Plus size={12} /></button>
                  </div>
                  <div className="flex gap-1 mb-1.5 h-1.5">
                    {wf.bars.map((b, i) => (
                      <div key={i} className={clsx('h-full rounded-full', b.w, b.color)} />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {wf.badges.map((b, i) => (
                      <span key={i} className={clsx('text-[10px] px-1.5 py-0.5 rounded-full font-medium border', b.color, 'border-current/20')}>
                        • {b.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Flow Objectives */}
            <div className="px-4 pt-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <TrendingUp size={12} /> Flow Objectives
                </h3>
                <button className="text-slate-400 hover:text-slate-600"><Plus size={13} /></button>
              </div>
              <div className="space-y-2">
                {FLOW_OBJECTIVES.map((item) => (
                  <InsightCard key={item.label} item={item} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  )
}
