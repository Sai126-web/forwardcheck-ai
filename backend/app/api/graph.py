from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.models import Investigation, GraphNode, GraphEdge
from app.schemas.schemas import TruthGraphResponse, GraphNodeSchema, GraphEdgeSchema
from pydantic import BaseModel

router = APIRouter(prefix="/investigations/{investigation_id}/graph", tags=["TruthGraph"])

class NodePositionsUpdate(BaseModel):
    positions: Dict[str, Dict[str, float]]  # {node_id: {x: 100, y: 200}}

@router.get("", response_model=TruthGraphResponse)
def get_investigation_graph(investigation_id: str, db: Session = Depends(get_db)):
    """
    Returns stored TruthGraph nodes, edges, and summary metrics for an investigation.
    """
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found.")

    nodes = db.query(GraphNode).filter(GraphNode.investigation_id == investigation_id).all()
    edges = db.query(GraphEdge).filter(GraphEdge.investigation_id == investigation_id).all()

    summary = {
        "title": inv.title,
        "overall_verdict": inv.overall_verdict,
        "bait_score": inv.bait_score,
        "nodes_count": len(nodes),
        "edges_count": len(edges),
        "execution_mode": inv.execution_mode
    }

    return TruthGraphResponse(
        investigation_id=investigation_id,
        nodes=[GraphNodeSchema.model_validate(n) for n in nodes],
        edges=[GraphEdgeSchema.model_validate(e) for e in edges],
        summary=summary
    )

@router.post("/positions")
def update_node_positions(
    investigation_id: str,
    payload: NodePositionsUpdate,
    db: Session = Depends(get_db)
):
    """
    Persists user layout preferences and customized node coordinates.
    """
    for node_id, pos in payload.positions.items():
        node = db.query(GraphNode).filter(
            GraphNode.investigation_id == investigation_id,
            GraphNode.id == node_id
        ).first()
        if node:
            node.x_pos = pos.get("x", node.x_pos)
            node.y_pos = pos.get("y", node.y_pos)
    db.commit()
    return {"status": "positions_saved"}
