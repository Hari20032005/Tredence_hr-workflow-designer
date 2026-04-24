import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { ApprovalNodeData } from '../../types/nodes'
import { useWorkflowStore } from '../../store/workflowStore'
import { FormField, Input, Select } from './shared/FormField'

interface Props {
  nodeId: string
  data: ApprovalNodeData
}

const APPROVER_ROLES = [
  { value: 'Manager', label: 'Manager' },
  { value: 'HRBP', label: 'HRBP' },
  { value: 'Director', label: 'Director' },
  { value: 'VP', label: 'VP' },
]

export function ApprovalNodeForm({ nodeId, data }: Props) {
  const { updateNodeData } = useWorkflowStore()
  const { register, watch } = useForm<ApprovalNodeData>({ defaultValues: data })

  useEffect(() => {
    const sub = watch((values) => {
      updateNodeData(nodeId, {
        ...values,
        autoApproveThreshold: Number(values.autoApproveThreshold ?? 0),
      } as Partial<ApprovalNodeData>)
    })
    return () => sub.unsubscribe()
  }, [watch, nodeId, updateNodeData])

  return (
    <div className="space-y-4">
      <FormField label="Title">
        <Input {...register('title')} placeholder="e.g. Manager Approval" />
      </FormField>

      <FormField label="Approver Role">
        <Select {...register('approverRole')} options={APPROVER_ROLES} />
      </FormField>

      <FormField label="Auto-Approve Threshold (%)">
        <Input
          type="number"
          min={0}
          max={100}
          {...register('autoApproveThreshold', { valueAsNumber: true })}
          placeholder="0"
        />
        <p className="text-xs text-slate-400 mt-1">
          Auto-approve if confidence score exceeds this threshold
        </p>
      </FormField>
    </div>
  )
}
