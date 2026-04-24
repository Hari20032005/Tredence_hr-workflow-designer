import { ReactFlowProvider } from '@xyflow/react'
import { TopBar } from './components/layout/TopBar'
import { NodePalette } from './components/sidebar/NodePalette'
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas'
import { NodeFormPanel } from './components/forms/NodeFormPanel'
import { SandboxPanel } from './components/sandbox/SandboxPanel'
import { useWorkflowStore } from './store/workflowStore'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { getTemplate } from './utils/templates'

function AppInner() {
  const { loadWorkflow, setWorkflowTitle } = useWorkflowStore()
  useKeyboardShortcuts()

  function handleLoadTemplate(name: string) {
    const { nodes, edges } = getTemplate(name)
    loadWorkflow(nodes, edges)
    setWorkflowTitle(name + ' Workflow')
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <NodePalette onLoadTemplate={handleLoadTemplate} />
        <WorkflowCanvas />
        <NodeFormPanel />
      </div>
      <SandboxPanel />
    </div>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppInner />
    </ReactFlowProvider>
  )
}
