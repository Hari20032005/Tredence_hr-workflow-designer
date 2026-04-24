import { Plus, Trash2 } from 'lucide-react'
import type { KeyValuePair } from '../../../types/nodes'
import { nanoid } from '../../../store/nanoid'

interface KeyValueEditorProps {
  label: string
  pairs: KeyValuePair[]
  onChange: (pairs: KeyValuePair[]) => void
}

export function KeyValueEditor({ label, pairs, onChange }: KeyValueEditorProps) {
  function addPair() {
    onChange([...pairs, { id: nanoid(), key: '', value: '' }])
  }

  function updatePair(id: string, field: 'key' | 'value', val: string) {
    onChange(pairs.map((p) => (p.id === id ? { ...p, [field]: val } : p)))
  }

  function removePair(id: string) {
    onChange(pairs.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
        <button
          type="button"
          onClick={addPair}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
        >
          <Plus size={12} /> Add
        </button>
      </div>
      {pairs.map((pair) => (
        <div key={pair.id} className="flex gap-1 items-center">
          <input
            className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Key"
            value={pair.key}
            onChange={(e) => updatePair(pair.id, 'key', e.target.value)}
          />
          <input
            className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Value"
            value={pair.value}
            onChange={(e) => updatePair(pair.id, 'value', e.target.value)}
          />
          <button
            type="button"
            onClick={() => removePair(pair.id)}
            className="text-slate-400 hover:text-red-500"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
      {pairs.length === 0 && (
        <p className="text-xs text-slate-400 italic">No entries. Click Add to create one.</p>
      )}
    </div>
  )
}
