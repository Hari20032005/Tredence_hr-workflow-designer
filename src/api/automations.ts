import type { AutomationAction } from '../types/api'

export const MOCK_AUTOMATIONS: AutomationAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    params: ['to', 'subject', 'body'],
    description: 'Send an automated email notification',
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient', 'format'],
    description: 'Generate a document from a template',
  },
  {
    id: 'send_slack',
    label: 'Send Slack Message',
    params: ['channel', 'message'],
    description: 'Post a message to a Slack channel',
  },
  {
    id: 'create_ticket',
    label: 'Create JIRA Ticket',
    params: ['project', 'summary', 'assignee'],
    description: 'Create a new ticket in JIRA',
  },
  {
    id: 'trigger_webhook',
    label: 'Trigger Webhook',
    params: ['url', 'method', 'payload'],
    description: 'Send an HTTP request to an external service',
  },
  {
    id: 'update_hrms',
    label: 'Update HRMS Record',
    params: ['employeeId', 'field', 'value'],
    description: 'Update an employee record in the HRMS system',
  },
]
