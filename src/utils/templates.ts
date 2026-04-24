import type { WorkflowNode, WorkflowEdge } from '../types/nodes'
import { nanoid } from '../store/nanoid'

export function getTemplate(name: string): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } {
  switch (name) {
    case 'Employee Onboarding':
      return onboardingTemplate()
    case 'Leave Approval':
      return leaveApprovalTemplate()
    case 'Doc Verification':
      return docVerificationTemplate()
    default:
      return { nodes: [], edges: [] }
  }
}

function onboardingTemplate() {
  const ids = { start: nanoid(), task1: nanoid(), task2: nanoid(), auto: nanoid(), approval: nanoid(), end: nanoid() }
  const nodes: WorkflowNode[] = [
    { id: ids.start, type: 'start', position: { x: 300, y: 50 }, data: { type: 'start', title: 'New Hire Joins', metadata: [{ id: nanoid(), key: 'dept', value: 'Engineering' }] } },
    { id: ids.task1, type: 'task', position: { x: 300, y: 180 }, data: { type: 'task', title: 'Collect Documents', description: 'ID, education certs, bank details', assignee: 'HR Manager', dueDate: '', customFields: [] } },
    { id: ids.auto, type: 'automatedStep', position: { x: 300, y: 310 }, data: { type: 'automatedStep', title: 'Send Welcome Email', actionId: 'send_email', actionLabel: 'Send Email', params: { to: 'employee@company.com', subject: 'Welcome!', body: 'Welcome to the team!' } } },
    { id: ids.task2, type: 'task', position: { x: 300, y: 440 }, data: { type: 'task', title: 'IT Setup & Access', description: 'Laptop, email, system access provisioning', assignee: 'IT Team', dueDate: '', customFields: [] } },
    { id: ids.approval, type: 'approval', position: { x: 300, y: 570 }, data: { type: 'approval', title: 'Manager Sign-off', approverRole: 'Manager', autoApproveThreshold: 0 } },
    { id: ids.end, type: 'end', position: { x: 300, y: 700 }, data: { type: 'end', endMessage: 'Employee onboarding complete!', includeSummary: true } },
  ]
  const edges: WorkflowEdge[] = [
    { id: nanoid(), source: ids.start, target: ids.task1 },
    { id: nanoid(), source: ids.task1, target: ids.auto },
    { id: nanoid(), source: ids.auto, target: ids.task2 },
    { id: nanoid(), source: ids.task2, target: ids.approval },
    { id: nanoid(), source: ids.approval, target: ids.end },
  ]
  return { nodes, edges }
}

function leaveApprovalTemplate() {
  const ids = { start: nanoid(), task: nanoid(), approval: nanoid(), auto: nanoid(), end: nanoid() }
  const nodes: WorkflowNode[] = [
    { id: ids.start, type: 'start', position: { x: 300, y: 50 }, data: { type: 'start', title: 'Leave Request Submitted', metadata: [] } },
    { id: ids.task, type: 'task', position: { x: 300, y: 180 }, data: { type: 'task', title: 'Review Leave Request', description: 'Check leave balance and schedule', assignee: 'HR Manager', dueDate: '', customFields: [] } },
    { id: ids.approval, type: 'approval', position: { x: 300, y: 310 }, data: { type: 'approval', title: 'Director Approval', approverRole: 'Director', autoApproveThreshold: 80 } },
    { id: ids.auto, type: 'automatedStep', position: { x: 300, y: 440 }, data: { type: 'automatedStep', title: 'Update HRMS', actionId: 'update_hrms', actionLabel: 'Update HRMS Record', params: { employeeId: '', field: 'leaveBalance', value: '' } } },
    { id: ids.end, type: 'end', position: { x: 300, y: 570 }, data: { type: 'end', endMessage: 'Leave approved and recorded.', includeSummary: false } },
  ]
  const edges: WorkflowEdge[] = [
    { id: nanoid(), source: ids.start, target: ids.task },
    { id: nanoid(), source: ids.task, target: ids.approval },
    { id: nanoid(), source: ids.approval, target: ids.auto },
    { id: nanoid(), source: ids.auto, target: ids.end },
  ]
  return { nodes, edges }
}

function docVerificationTemplate() {
  const ids = { start: nanoid(), task: nanoid(), auto: nanoid(), approval: nanoid(), end: nanoid() }
  const nodes: WorkflowNode[] = [
    { id: ids.start, type: 'start', position: { x: 300, y: 50 }, data: { type: 'start', title: 'Documents Received', metadata: [] } },
    { id: ids.task, type: 'task', position: { x: 300, y: 180 }, data: { type: 'task', title: 'Initial Document Check', description: 'Verify completeness and authenticity', assignee: 'Compliance Team', dueDate: '', customFields: [] } },
    { id: ids.auto, type: 'automatedStep', position: { x: 300, y: 310 }, data: { type: 'automatedStep', title: 'Generate Verification Report', actionId: 'generate_doc', actionLabel: 'Generate Document', params: { template: 'verification-report', recipient: 'hr@company.com', format: 'PDF' } } },
    { id: ids.approval, type: 'approval', position: { x: 300, y: 440 }, data: { type: 'approval', title: 'HRBP Sign-off', approverRole: 'HRBP', autoApproveThreshold: 0 } },
    { id: ids.end, type: 'end', position: { x: 300, y: 570 }, data: { type: 'end', endMessage: 'Document verification complete.', includeSummary: true } },
  ]
  const edges: WorkflowEdge[] = [
    { id: nanoid(), source: ids.start, target: ids.task },
    { id: nanoid(), source: ids.task, target: ids.auto },
    { id: nanoid(), source: ids.auto, target: ids.approval },
    { id: nanoid(), source: ids.approval, target: ids.end },
  ]
  return { nodes, edges }
}
