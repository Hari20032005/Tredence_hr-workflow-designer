import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { StartNodeData } from '../../types/nodes'
import { useWorkflowStore } from '../../store/workflowStore'
import { FormField, Input } from './shared/FormField'
import { KeyValueEditor } from './shared/KeyValueEditor'

interface Props {
  nodeId: string
  data: StartNodeData
}

export function StartNodeForm({ nodeId, data }: Props) {
  const { updateNodeData } = useWorkflowStore()
  const { register, watch, setValue } = useForm<StartNodeData>({ defaultValues: data })

  useEffect(() => {
    const sub = watch((values) => {
      updateNodeData(nodeId, values as Partial<StartNodeData>)
    })
    return () => sub.unsubscribe()
  }, [watch, nodeId, updateNodeData])

  return (
    <div className="space-y-4">
      <FormField label="Start Title" required>
        <Input {...register('title')} placeholder="e.g. Employee Onboarding Start" />
      </FormField>

      <KeyValueEditor
        label="Metadata"
        pairs={data.metadata ?? []}
        onChange={(pairs) => {
          setValue('metadata', pairs)
          updateNodeData(nodeId, { metadata: pairs })
        }}
      />
    </div>
  )
}
