"""
HR Workflow Designer — FastAPI Backend
Demonstrates Python/FastAPI skills per Tredence JD requirements.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Any, Optional
from collections import deque
from datetime import datetime
import asyncio
import random

app = FastAPI(
    title="HR Workflow Designer API",
    description="Backend for the Tredence HR Workflow Designer case study",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Models ──────────────────────────────────────────────────────────────────

class AutomationAction(BaseModel):
    id: str
    label: str
    params: list[str]
    description: str


class WorkflowNodeInput(BaseModel):
    id: str
    type: str
    data: dict[str, Any]


class WorkflowEdgeInput(BaseModel):
    id: str
    source: str
    target: str


class SimulateRequest(BaseModel):
    nodes: list[WorkflowNodeInput]
    edges: list[WorkflowEdgeInput]


class ExecutionStep(BaseModel):
    node_id: str = Field(alias="nodeId")
    node_type: str = Field(alias="nodeType")
    node_title: str = Field(alias="nodeTitle")
    status: str
    message: str
    timestamp: str
    duration_ms: int = Field(alias="durationMs")

    model_config = {"populate_by_name": True}


class SimulateResponse(BaseModel):
    success: bool
    steps: list[ExecutionStep]
    total_duration_ms: int = Field(alias="totalDurationMs")
    error: Optional[str] = None

    model_config = {"populate_by_name": True}


# ─── Data ────────────────────────────────────────────────────────────────────

AUTOMATIONS: list[AutomationAction] = [
    AutomationAction(id="send_email", label="Send Email", params=["to", "subject", "body"], description="Send an automated email notification"),
    AutomationAction(id="generate_doc", label="Generate Document", params=["template", "recipient", "format"], description="Generate a document from a template"),
    AutomationAction(id="send_slack", label="Send Slack Message", params=["channel", "message"], description="Post a message to a Slack channel"),
    AutomationAction(id="create_ticket", label="Create JIRA Ticket", params=["project", "summary", "assignee"], description="Create a new ticket in JIRA"),
    AutomationAction(id="trigger_webhook", label="Trigger Webhook", params=["url", "method", "payload"], description="Send an HTTP request to an external service"),
    AutomationAction(id="update_hrms", label="Update HRMS Record", params=["employeeId", "field", "value"], description="Update an employee record in the HRMS system"),
]

NODE_STEP_MESSAGES: dict[str, str] = {
    "start": 'Workflow initiated: "{title}"',
    "task": 'Task "{title}" assigned to {assignee}',
    "approval": 'Approval requested from {approverRole} — threshold: {autoApproveThreshold}%',
    "automatedStep": "Executing action: {actionLabel}",
    "end": "Workflow completed. {endMessage}",
}


# ─── Graph utilities ──────────────────────────────────────────────────────────

def topological_sort(nodes: list[WorkflowNodeInput], edges: list[WorkflowEdgeInput]) -> list[str] | None:
    """Kahn's algorithm — returns None if cycle detected."""
    adj: dict[str, list[str]] = {n.id: [] for n in nodes}
    in_degree: dict[str, int] = {n.id: 0 for n in nodes}

    for e in edges:
        adj[e.source].append(e.target)
        in_degree[e.target] = in_degree.get(e.target, 0) + 1

    queue = deque(nid for nid, deg in in_degree.items() if deg == 0)
    result: list[str] = []

    while queue:
        nid = queue.popleft()
        result.append(nid)
        for neighbor in adj[nid]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return result if len(result) == len(nodes) else None


def build_step_message(node: WorkflowNodeInput) -> str:
    template = NODE_STEP_MESSAGES.get(node.type, f"Processing {node.type} node")
    try:
        return template.format(**{k: node.data.get(k, "") for k in ["title", "assignee", "approverRole", "autoApproveThreshold", "actionLabel", "endMessage"]})
    except (KeyError, ValueError):
        return f"Processing: {node.data.get('title', node.type)}"


# ─── Routes ──────────────────────────────────────────────────────────────────

@app.get("/api/automations", response_model=list[AutomationAction])
async def get_automations():
    """Return available automation actions for the Automated Step node."""
    await asyncio.sleep(0.1)  # Simulate realistic network latency
    return AUTOMATIONS


@app.post("/api/simulate", response_model=SimulateResponse)
async def simulate_workflow(body: SimulateRequest):
    """
    Accepts a workflow graph (nodes + edges) and returns a step-by-step
    execution result using topological sort (Kahn's algorithm).
    Detects cycles and returns structured error responses.
    """
    if not body.nodes:
        raise HTTPException(status_code=422, detail="Workflow has no nodes")

    await asyncio.sleep(0.3)  # Simulate backend processing

    order = topological_sort(body.nodes, body.edges)
    if order is None:
        return SimulateResponse(
            success=False,
            steps=[],
            totalDurationMs=0,
            error="Cycle detected in workflow graph — ensure edges flow in one direction",
        )

    node_map = {n.id: n for n in body.nodes}
    steps: list[ExecutionStep] = []
    elapsed = 0
    start_time = datetime.now()

    for node_id in order:
        node = node_map.get(node_id)
        if not node:
            continue

        duration_ms = random.randint(200, 900)
        elapsed += duration_ms
        ts = start_time.timestamp() * 1000 + elapsed

        NODE_LABELS = {"start": "Start", "task": "Task", "approval": "Approval", "automatedStep": "Automated Step", "end": "End"}
        node_title = node.data.get("title") or node.data.get("endMessage", "")[:20] or NODE_LABELS.get(node.type, node.type)
        steps.append(ExecutionStep(
            nodeId=node_id,
            nodeType=node.type,
            nodeTitle=node_title,
            status="success",
            message=build_step_message(node),
            timestamp=datetime.fromtimestamp(ts / 1000).isoformat(),
            durationMs=duration_ms,
        ))

    return SimulateResponse(
        success=True,
        steps=steps,
        totalDurationMs=elapsed,
    )


@app.get("/health")
async def health():
    return {"status": "ok", "service": "hr-workflow-designer-api"}
