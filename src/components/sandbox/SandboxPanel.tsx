import { X, Play, CheckCircle, XCircle, Loader2, AlertTriangle, Clock } from 'lucide-react'
import { useSimulationStore } from '../../store/simulationStore'
import type { ExecutionStep } from '../../types/api'

const STATUS_ICONS = {
  running: <Loader2 size={14} className="animate-spin text-blue-500" />,
  success: <CheckCircle size={14} className="text-emerald-500" />,
  error: <XCircle size={14} className="text-red-500" />,
  skipped: <Clock size={14} className="text-slate-400" />,
}

const NODE_TYPE_COLORS: Record<string, string> = {
  start: 'bg-emerald-100 text-emerald-700',
  task: 'bg-blue-100 text-blue-700',
  approval: 'bg-amber-100 text-amber-700',
  automatedStep: 'bg-purple-100 text-purple-700',
  end: 'bg-rose-100 text-rose-700',
}

function StepItem({ step, index }: { step: ExecutionStep; index: number }) {
  return (
    <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col items-center">
        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
          {index + 1}
        </div>
        <div className="w-px flex-1 bg-slate-200 mt-1" />
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center gap-2 mb-1">
          {STATUS_ICONS[step.status]}
          <span className="text-sm font-medium text-slate-800">{step.nodeTitle}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${NODE_TYPE_COLORS[step.nodeType] ?? 'bg-slate-100 text-slate-600'}`}>
            {step.nodeType}
          </span>
          <span className="text-[10px] text-slate-400 ml-auto">{step.durationMs}ms</span>
        </div>
        <p className="text-xs text-slate-500">{step.message}</p>
      </div>
    </div>
  )
}

export function SandboxPanel() {
  const { isOpen, close, status, visibleSteps, errors, totalDurationMs } = useSimulationStore()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={close} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <Play size={16} className="text-slate-600" />
          <h2 className="font-semibold text-slate-800 flex-1">Workflow Simulation</h2>
          {status === 'success' && (
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ✓ {(totalDurationMs / 1000).toFixed(1)}s
            </span>
          )}
          <button onClick={close} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Validation errors */}
          {errors.length > 0 && (
            <div className="mb-4 space-y-2">
              {errors.map((err, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                    err.severity === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  {err.message}
                </div>
              ))}
            </div>
          )}

          {/* Running state */}
          {status === 'running' && visibleSteps.length === 0 && (
            <div className="flex items-center gap-3 py-8 justify-center text-slate-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Initializing simulation...</span>
            </div>
          )}

          {/* Steps */}
          {visibleSteps.length > 0 && (
            <div>
              {visibleSteps.map((step, i) => (
                <StepItem key={step.nodeId + i} step={step} index={i} />
              ))}
              {status === 'running' && (
                <div className="flex items-center gap-2 text-sm text-slate-400 mt-2 pl-9">
                  <Loader2 size={14} className="animate-spin" /> Processing next step...
                </div>
              )}
              {status === 'success' && (
                <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-sm text-emerald-700 flex items-center gap-2">
                  <CheckCircle size={16} />
                  Workflow completed successfully in {(totalDurationMs / 1000).toFixed(1)}s
                </div>
              )}
            </div>
          )}

          {/* Error state with no steps */}
          {status === 'error' && visibleSteps.length === 0 && errors.length === 0 && (
            <div className="flex items-center gap-2 py-8 justify-center text-red-500">
              <XCircle size={20} />
              <span className="text-sm">Simulation failed. Check workflow structure.</span>
            </div>
          )}

          {/* Idle */}
          {status === 'idle' && (
            <div className="text-center py-8 text-slate-400">
              <Play size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Run the simulation to see step-by-step execution</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
