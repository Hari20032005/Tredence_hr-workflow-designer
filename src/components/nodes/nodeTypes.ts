import { StartNode } from './StartNode'
import { TaskNode } from './TaskNode'
import { ApprovalNode } from './ApprovalNode'
import { AutomatedStepNode } from './AutomatedStepNode'
import { EndNode } from './EndNode'

export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automatedStep: AutomatedStepNode,
  end: EndNode,
} as const
