import { Handle, Position } from '@xyflow/react'
import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import { AlertCircle, MoreHorizontal } from 'lucide-react'
import type { ValidationError } from '../../types/nodes'

interface StatBadge {
  icon: string
  value: number | string
  color: string
}

interface BaseNodeProps {
  selected: boolean
  hasSource?: boolean
  hasTarget?: boolean
  borderColor: string
  headerBg: string
  icon: ReactNode
  title: string
  subtitle?: string
  children?: ReactNode
  errors?: ValidationError[]
  stats?: StatBadge[]
  nodeIcon?: ReactNode
}

export function BaseNode({
  selected,
  hasSource = true,
  hasTarget = true,
  borderColor,
  headerBg,
  icon,
  title,
  subtitle,
  children,
  errors = [],
  stats,
}: BaseNodeProps) {
  const hasErrors = errors.length > 0

  return (
    <div
      className={clsx(
        'rounded-xl bg-white shadow-md border-2 min-w-[210px] max-w-[250px] transition-all duration-150',
        selected ? 'shadow-xl ring-2 ring-offset-1 ring-blue-400' : 'shadow-sm hover:shadow-md',
        hasErrors ? 'border-red-400' : borderColor,
      )}
    >
      {hasTarget && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !border-2 !border-white !bg-slate-400 hover:!bg-blue-500 transition-colors"
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={clsx('p-1 rounded-md text-white shrink-0', headerBg)}>{icon}</span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">{title}</p>
            {subtitle && <p className="text-[10px] text-slate-400 truncate">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {hasErrors && (
            <span title={errors.map((e) => e.message).join('\n')}>
              <AlertCircle size={13} className="text-red-500" />
            </span>
          )}
          <MoreHorizontal size={14} className="text-slate-300" />
        </div>
      </div>

      {/* Body */}
      {children && (
        <div className="px-3 pb-2 text-xs text-slate-500 space-y-1">{children}</div>
      )}

      {/* Stats row — matches CodeAuto reference */}
      {stats && stats.length > 0 && (
        <div className="flex items-center gap-1.5 px-3 pb-2.5 pt-1 border-t border-slate-50">
          {stats.map((s, i) => (
            <span
              key={i}
              className={clsx(
                'inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full border',
                s.color
              )}
            >
              {s.icon} {s.value}
            </span>
          ))}
        </div>
      )}

      {hasSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !border-2 !border-white !bg-slate-400 hover:!bg-blue-500 transition-colors"
        />
      )}
    </div>
  )
}

/* Pill-shaped connector node — matches "Initialize Data", "Execute Triggered" style in reference */
interface PillNodeProps {
  selected: boolean
  label: string
  color: string
  hasSource?: boolean
  hasTarget?: boolean
}

export function PillNode({ selected, label, color, hasSource = true, hasTarget = true }: PillNodeProps) {
  return (
    <div
      className={clsx(
        'px-4 py-1.5 rounded-full border-2 text-xs font-semibold shadow-sm transition-all',
        color,
        selected && 'ring-2 ring-offset-1 ring-blue-400 shadow-md'
      )}
    >
      {hasTarget && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-2.5 !h-2.5 !border-2 !border-white !bg-slate-400"
        />
      )}
      {label}
      {hasSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-2.5 !h-2.5 !border-2 !border-white !bg-slate-400"
        />
      )}
    </div>
  )
}
