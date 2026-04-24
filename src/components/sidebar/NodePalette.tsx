import {
  Play, CheckSquare, ShieldCheck, Zap, Flag,
  LayoutDashboard, ShieldAlert, Calendar, BarChart2,
  Link2, GitBranch, Workflow, Users, Inbox, MessageSquare,
  Settings, HelpCircle, ChevronDown,
} from 'lucide-react'
import { useState } from 'react'
import type { NodeType } from '../../types/nodes'
import { clsx } from 'clsx'

interface PaletteItem {
  type: NodeType
  label: string
  description: string
  icon: React.ReactNode
  accentColor: string
}

const PALETTE_ITEMS: PaletteItem[] = [
  { type: 'start', label: 'Start', description: 'Entry point', icon: <Play size={13} />, accentColor: 'bg-emerald-500' },
  { type: 'task', label: 'Task', description: 'Human task', icon: <CheckSquare size={13} />, accentColor: 'bg-blue-500' },
  { type: 'approval', label: 'Approval', description: 'Review step', icon: <ShieldCheck size={13} />, accentColor: 'bg-amber-500' },
  { type: 'automatedStep', label: 'Auto Step', description: 'System action', icon: <Zap size={13} />, accentColor: 'bg-purple-500' },
  { type: 'end', label: 'End', description: 'Completion', icon: <Flag size={13} />, accentColor: 'bg-rose-500' },
]

const TEMPLATES = [
  { label: 'Employee Onboarding', icon: '👤' },
  { label: 'Leave Approval', icon: '📅' },
  { label: 'Doc Verification', icon: '📄' },
]

interface NavItem {
  icon: React.ReactNode
  label: string
  badge?: number
  active?: boolean
}

interface NavSection {
  title: string
  items: NavItem[]
  collapsible?: boolean
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'General',
    collapsible: true,
    items: [
      { icon: <LayoutDashboard size={15} />, label: 'Dashboard', active: true },
      { icon: <ShieldAlert size={15} />, label: 'Compliance' },
      { icon: <Calendar size={15} />, label: 'Scheduler', badge: 11 },
      { icon: <BarChart2 size={15} />, label: 'Analytics' },
    ],
  },
  {
    title: 'Automation',
    collapsible: true,
    items: [
      { icon: <Link2 size={15} />, label: 'Integrations' },
      { icon: <GitBranch size={15} />, label: 'Repository', badge: 7 },
      { icon: <Workflow size={15} />, label: 'Workflows' },
    ],
  },
  {
    title: 'Resources',
    collapsible: true,
    items: [
      { icon: <Users size={15} />, label: 'Member' },
      { icon: <Inbox size={15} />, label: 'Inbox', badge: 13 },
      { icon: <MessageSquare size={15} />, label: 'Messages' },
    ],
  },
]

interface NodePaletteProps {
  onLoadTemplate: (name: string) => void
}

function SectionHeader({ title, collapsed, onToggle }: { title: string; collapsed: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full px-3 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
    >
      {title}
      <ChevronDown size={10} className={clsx('transition-transform', collapsed && '-rotate-90')} />
    </button>
  )
}

export function NodePalette({ onLoadTemplate }: NodePaletteProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [showNodes, setShowNodes] = useState(true)
  const [showTemplates, setShowTemplates] = useState(true)

  function toggleSection(title: string) {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  function onDragStart(e: React.DragEvent, type: NodeType) {
    e.dataTransfer.setData('application/reactflow', type)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="w-52 bg-slate-900 text-white flex flex-col border-r border-slate-800 shrink-0">
      {/* Logo */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2.5">
        <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center text-xs font-bold shrink-0">
          T
        </div>
        <span className="text-sm font-semibold text-white truncate">Tredence Studio</span>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {/* App navigation — matches Reference 1 */}
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-1">
            <SectionHeader
              title={section.title}
              collapsed={!!collapsed[section.title]}
              onToggle={() => toggleSection(section.title)}
            />
            {!collapsed[section.title] && (
              <div className="mt-0.5">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className={clsx(
                      'flex items-center justify-between px-4 py-1.5 mx-1.5 rounded-lg text-xs cursor-pointer transition-colors',
                      item.active
                        ? 'bg-slate-700 text-white font-medium'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </div>
                    {item.badge && (
                      <span className="text-[10px] bg-slate-600 text-slate-300 px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="border-t border-slate-800 my-2" />

        {/* Node palette */}
        <div className="mb-1">
          <SectionHeader
            title="Nodes"
            collapsed={!showNodes}
            onToggle={() => setShowNodes((v) => !v)}
          />
          {showNodes && (
            <div className="px-2 mt-1 space-y-1">
              <p className="text-[10px] text-slate-500 px-1 mb-1.5">Drag onto canvas →</p>
              {PALETTE_ITEMS.map((item) => (
                <div
                  key={item.type}
                  draggable
                  onDragStart={(e) => onDragStart(e, item.type)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-grab active:cursor-grabbing select-none transition-all"
                >
                  <span className={clsx('p-1 rounded text-white shrink-0', item.accentColor)}>
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200">{item.label}</p>
                    <p className="text-[10px] text-slate-500 truncate">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Templates */}
        <div className="mb-1">
          <SectionHeader
            title="Templates"
            collapsed={!showTemplates}
            onToggle={() => setShowTemplates((v) => !v)}
          />
          {showTemplates && (
            <div className="px-2 mt-1 space-y-1">
              {TEMPLATES.map((t) => (
                <button
                  key={t.label}
                  onClick={() => onLoadTemplate(t.label)}
                  className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  <span>{t.icon}</span>
                  <span className="text-xs text-slate-300 truncate">{t.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer — matches reference */}
      <div className="border-t border-slate-800 p-2 space-y-0.5">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 cursor-pointer transition-colors text-xs">
          <Settings size={14} /> Settings
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 cursor-pointer transition-colors text-xs">
          <HelpCircle size={14} /> Help & Support
        </div>
      </div>
    </aside>
  )
}
