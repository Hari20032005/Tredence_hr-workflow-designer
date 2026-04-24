import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { TaskNodeData } from '../../types/nodes'
import { useWorkflowStore } from '../../store/workflowStore'
import { FormField, Input, Textarea } from './shared/FormField'
import { KeyValueEditor } from './shared/KeyValueEditor'

interface Props {
  nodeId: string
  data: TaskNodeData
}

export function TaskNodeForm({ nodeId, data }: Props) {
  const { updateNodeData } = useWorkflowStore()
  const { register, watch, setValue, formState: { errors } } = useForm<TaskNodeData>({
    defaultValues: data,
  })

  useEffect(() => {
    const sub = watch((values) => {
      updateNodeData(nodeId, values as Partial<TaskNodeData>)
    })
    return () => sub.unsubscribe()
  }, [watch, nodeId, updateNodeData])

  return (
    <div className="space-y-4">
      <FormField label="Title" required error={errors.title?.message}>
        <Input
          {...register('title', { required: 'Title is required' })}
          placeholder="e.g. Collect Documents"
        />
      </FormField>

      <FormField label="Description">
        <Textarea {...register('description')} placeholder="Describe what this task involves..." />
      </FormField>

      <FormField label="Assignee">
        <Input {...register('assignee')} placeholder="e.g. HR Manager" />
      </FormField>

      <FormField label="Due Date">
        <Input type="date" {...register('dueDate')} />
      </FormField>

      <KeyValueEditor
        label="Custom Fields"
        pairs={data.customFields ?? []}
        onChange={(pairs) => {
          setValue('customFields', pairs)
          updateNodeData(nodeId, { customFields: pairs })
        }}
      />
    </div>
  )
}
