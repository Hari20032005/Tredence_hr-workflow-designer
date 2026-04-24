import type { WorkflowNode, WorkflowEdge } from '../types/nodes'
import { nanoid } from '../store/nanoid'

const EDGE_COLORS: Record<string, string> = {
  task: '#3b82f6',
  approval: '#f59e0b',
  automatedStep: '#a855f7',
  end: '#f43f5e',
  start: '#10b981',
}

function edge(source: string, target: string, targetType: string): WorkflowEdge {
  return {
    id: nanoid(),
    source,
    target,
    type: 'smoothstep',
    style: { stroke: EDGE_COLORS[targetType] ?? '#3b82f6', strokeWidth: 2 },
  }
}

export function getTemplate(name: string): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } {
  switch (name) {
    case 'Employee Onboarding': return onboardingTemplate()
    case 'Leave Approval': return leaveApprovalTemplate()
    case 'Doc Verification': return docVerificationTemplate()
    default: return { nodes: [], edges: [] }
  }
}

function onboardingTemplate() {
  const ids = { start: nanoid(), task1: nanoid(), task2: nanoid(), auto: nanoid(), approval: nanoid(), end: nanoid() }
  const nodes: WorkflowNode[] = [
    { id: ids.start, type: 'start', position: { x: 300, y: 50 }, data: { type: 'start', title: 'New Hire Joins', metadata: [{ id: nanoid(), key: 'dept', value: 'Engineering' }] } },
    { id: ids.task1, type: 'task', position: { x: 300, y: 170 }, data: { type: 'task', title: 'Collect Documents', description: 'ID, education certs, bank details', assignee: 'HR Manager', dueDate: '', customFields: [] } },
    { id: ids.auto, type: 'automatedStep', position: { x: 300, y: 300 }, data: { type: 'automatedStep', title: 'Send Welcome Email', actionId: 'send_email', actionLabel: 'Send Email', params: { to: 'employee@company.com', subject: 'Welcome!', body: 'Welcome to the team!' } } },
    { id: ids.task2, type: 'task', position: { x: 300, y: 430 }, data: { type: 'task', title: 'IT Setup & Access', description: 'Laptop, email, system access', assignee: 'IT Team', dueDate: '', customFields: [] } },
    { id: ids.approval, type: 'approval', position: { x: 300, y: 560 }, data: { type: 'approval', title: 'Manager Sign-off', approverRole: 'Manager', autoApproveThreshold: 0 } },
    { id: ids.end, type: 'end', position: { x: 300, y: 680 }, data: { type: 'end', endMessage: 'Employee onboarding complete!', includeSummary: true } },
  ]
  return {
    nodes,
    edges: [
      edge(ids.start, ids.task1, 'task'),
      edge(ids.task1, ids.auto, 'automatedStep'),
      edge(ids.auto, ids.task2, 'task'),
      edge(ids.task2, ids.approval, 'approval'),
      edge(ids.approval, ids.end, 'end'),
    ],
  }
}

function leaveApprovalTemplate() {
  const ids = { start: nanoid(), task: nanoid(), approval: nanoid(), auto: nanoid(), end: nanoid() }
  const nodes: WorkflowNode[] = [
    { id: ids.start, type: 'start', position: { x: 300, y: 50 }, data: { type: 'start', title: 'Leave Request Submitted', metadata: [] } },
    { id: ids.task, type: 'task', position: { x: 300, y: 170 }, data: { type: 'task', title: 'Review Leave Request', description: 'Check leave balance and schedule', assignee: 'HR Manager', dueDate: '', customFields: [] } },
    { id: ids.approval, type: 'approval', position: { x: 300, y: 300 }, data: { type: 'approval', title: 'Director Approval', approverRole: 'Director', autoApproveThreshold: 80 } },
    { id: ids.auto, type: 'automatedStep', position: { x: 300, y: 430 }, data: { type: 'automatedStep', title: 'Update HRMS', actionId: 'update_hrms', actionLabel: 'Update HRMS Record', params: { employeeId: '', field: 'leaveBalance', value: '' } } },
    { id: ids.end, type: 'end', position: { x: 300, y: 550 }, data: { type: 'end', endMessage: 'Leave approved and recorded.', includeSummary: false } },
  ]
  return {
    nodes,
    edges: [
      edge(ids.start, ids.task, 'task'),
      edge(ids.task, ids.approval, 'approval'),
      edge(ids.approval, ids.auto, 'automatedStep'),
      edge(ids.auto, ids.end, 'end'),
    ],
  }
}

function docVerificationTemplate() {
  const ids = { start: nanoid(), task: nanoid(), auto: nanoid(), approval: nanoid(), end: nanoid() }
  const nodes: WorkflowNode[] = [
    { id: ids.start, type: 'start', position: { x: 300, y: 50 }, data: { type: 'start', title: 'Documents Received', metadata: [] } },
    { id: ids.task, type: 'task', position: { x: 300, y: 170 }, data: { type: 'task', title: 'Initial Document Check', description: 'Verify completeness and authenticity', assignee: 'Compliance Team', dueDate: '', customFields: [] } },
    { id: ids.auto, type: 'automatedStep', position: { x: 300, y: 300 }, data: { type: 'automatedStep', title: 'Generate Verification Report', actionId: 'generate_doc', actionLabel: 'Generate Document', params: { template: 'verification-report', recipient: 'hr@company.com', format: 'PDF' } } },
    { id: ids.approval, type: 'approval', position: { x: 300, y: 430 }, data: { type: 'approval', title: 'HRBP Sign-off', approverRole: 'HRBP', autoApproveThreshold: 0 } },
    { id: ids.end, type: 'end', position: { x: 300, y: 550 }, data: { type: 'end', endMessage: 'Document verification complete.', includeSummary: true } },
  ]
  return {
    nodes,
    edges: [
      edge(ids.start, ids.task, 'task'),
      edge(ids.task, ids.auto, 'automatedStep'),
      edge(ids.auto, ids.approval, 'approval'),
      edge(ids.approval, ids.end, 'end'),
    ],
  }
}
