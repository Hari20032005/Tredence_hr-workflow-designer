import { Handle, Position } from '@xyflow/react'
import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import { AlertCircle } from 'lucide-react'
import type { ValidationError } from '../../types/nodes'

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
}: BaseNodeProps) {
  const hasErrors = errors.length > 0

  return (
    <div
      className={clsx(
        'rounded-xl bg-white shadow-md border-2 min-w-[200px] max-w-[240px] transition-all duration-150',
        borderColor,
        selected && 'shadow-lg ring-2 ring-offset-2 ring-blue-400',
        hasErrors && 'border-red-400'
      )}
    >
      {hasTarget && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !border-2 !border-white !bg-slate-400"
        />
      )}

      <div className={clsx('flex items-center gap-2 px-3 py-2 rounded-t-[10px]', headerBg)}>
        <span className="text-white">{icon}</span>
        <span className="text-white font-semibold text-sm truncate flex-1">{title}</span>
        {hasErrors && (
          <span title={errors.map((e) => e.message).join('\n')}>
            <AlertCircle size={14} className="text-red-200 shrink-0" />
          </span>
        )}
      </div>

      {(subtitle || children) && (
        <div className="px-3 py-2 text-xs text-slate-500 space-y-1">
          {subtitle && <p className="truncate">{subtitle}</p>}
          {children}
        </div>
      )}

      {hasSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !border-2 !border-white !bg-slate-400"
        />
      )}
    </div>
  )
}
