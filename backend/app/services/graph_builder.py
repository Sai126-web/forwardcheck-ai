from typing import List, Dict, Any, Tuple
from app.schemas.schemas import GraphNodeSchema, GraphEdgeSchema, TruthGraphResponse

def build_investigation_graph(
    investigation_id: str,
    original_title: str,
    claims: List[Dict[str, Any]],
    bait_summary: Dict[str, Any],
    overall_verdict: str
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Synthesizes a structured TruthGraph from validated investigation records.
    Hierarchical level layout:
    Level 0 (x=50): Original Forward Node
    Level 1 (x=350): Bait Analysis Node & Context Nodes
    Level 2 (x=680): Atomic Claim Nodes
    Level 3 (x=1050): Evidence & Source Nodes
    Level 4 (x=1420): Verdict Nodes
    """
    nodes = []
    edges = []

    # 1. Original Forward Node (Root)
    root_node_id = f"node-forward-{investigation_id[:8]}"
    nodes.append({
        "id": root_node_id,
        "node_type": "original_forward",
        "label": original_title[:50] + ("..." if len(original_title) > 50 else ""),
        "data": {
            "title": original_title,
            "type": "Original Forwarded Message",
            "overall_verdict": overall_verdict,
            "bait_score": bait_summary.get("total_score", 0),
        },
        "x_pos": 60.0,
        "y_pos": 220.0
    })

    # 2. Bait Analysis Node
    bait_score = bait_summary.get("total_score", 0)
    bait_node_id = f"node-bait-{investigation_id[:8]}"
    nodes.append({
        "id": bait_node_id,
        "node_type": "bait_analysis",
        "label": f"Bait Index: {bait_score}/100",
        "data": {
            "score": bait_score,
            "risk_level": bait_summary.get("risk_level", "Low"),
            "categories": [c.get("category_name") for c in bait_summary.get("categories", []) if c.get("score", 0) > 0],
            "type": "Rhetorical Manipulation Indicator"
        },
        "x_pos": 380.0,
        "y_pos": 60.0
    })
    edges.append({
        "id": f"edge-{investigation_id[:8]}-forward-bait",
        "source_node_id": root_node_id,
        "target_node_id": bait_node_id,
        "edge_type": "contains_bait_technique",
        "label": f"Rhetoric Score {bait_score}"
    })

    # 3. Claims, Evidence, Sources, and Verdicts
    y_claim_offset = 180.0
    y_step = 220.0

    for idx, claim in enumerate(claims):
        claim_id = str(claim.get("id") or f"claim-{idx}")
        claim_node_id = f"node-claim-{claim_id[:8]}-{idx}"
        claim_verdict = claim.get("verdict", "Cannot Confirm")
        
        # Claim Node
        claim_y = y_claim_offset + (idx * y_step)
        nodes.append({
            "id": claim_node_id,
            "node_type": "atomic_claim",
            "label": f"Claim #{idx + 1}: {claim.get('normalized_claim', '')[:45]}...",
            "data": {
                "claim_id": claim_id,
                "position": idx + 1,
                "normalized_claim": claim.get("normalized_claim", ""),
                "original_text": claim.get("original_text", ""),
                "entities": claim.get("entities", []),
                "verdict": claim_verdict,
                "category": claim.get("category", "factual")
            },
            "x_pos": 420.0,
            "y_pos": claim_y
        })

        # Edge from Forward to Claim
        edges.append({
            "id": f"edge-{investigation_id[:8]}-forward-claim-{idx}",
            "source_node_id": root_node_id,
            "target_node_id": claim_node_id,
            "edge_type": "contains_claim",
            "label": f"Claim #{idx+1}"
        })

        # Claim Verdict Node
        verdict_node_id = f"node-verdict-{claim_id[:8]}-{idx}"
        nodes.append({
            "id": verdict_node_id,
            "node_type": "verdict",
            "label": f"Verdict: {claim_verdict}",
            "data": {
                "verdict": claim_verdict,
                "rationale": claim.get("verdict_rationale", ""),
                "claim_id": claim_id
            },
            "x_pos": 1180.0,
            "y_pos": claim_y
        })

        # Evidence & Sources for this claim
        evidence_items = claim.get("evidence_items", [])
        if evidence_items:
            for ev_idx, ev in enumerate(evidence_items):
                raw_ev_id = ev.get("id")
                ev_id = str(raw_ev_id) if raw_ev_id else f"{claim_id[:8]}-{idx}-{ev_idx}"
                ev_node_id = f"node-evidence-{claim_id[:8]}-{idx}-{ev_idx}"
                stance = ev.get("stance", "supports")
                source = ev.get("source") or {}

                # Stance edge type mapping
                edge_type_map = {
                    "supports": "supported_by",
                    "contradicts": "contradicted_by",
                    "qualifies": "qualified_by",
                    "contextualizes": "extracted_from",
                    "insufficient": "has_unresolved_gap"
                }
                edge_type = edge_type_map.get(stance, "extracted_from")

                ev_y = claim_y - 40.0 + (ev_idx * 90.0)
                nodes.append({
                    "id": ev_node_id,
                    "node_type": "evidence",
                    "label": f"[{stance.upper()}] {source.get('publisher', 'Source')}",
                    "data": {
                        "excerpt": ev.get("excerpt", ""),
                        "stance": stance,
                        "relevance": ev.get("relevance_explanation", ""),
                        "url": source.get("url", ""),
                        "publisher": source.get("publisher", "Independent Source"),
                        "citation": ev.get("citation_number", ev_idx + 1)
                    },
                    "x_pos": 800.0,
                    "y_pos": ev_y
                })

                # Edge from Claim to Evidence
                edges.append({
                    "id": f"edge-{investigation_id[:8]}-claim-ev-{idx}-{ev_idx}",
                    "source_node_id": claim_node_id,
                    "target_node_id": ev_node_id,
                    "edge_type": edge_type,
                    "label": stance.capitalize()
                })

                # Edge from Evidence to Verdict
                edges.append({
                    "id": f"edge-{investigation_id[:8]}-ev-verdict-{idx}-{ev_idx}",
                    "source_node_id": ev_node_id,
                    "target_node_id": verdict_node_id,
                    "edge_type": "supported_by" if stance == "supports" else "contradicted_by",
                    "label": "Grounds"
                })
        else:
            # Direct edge if no evidence
            edges.append({
                "id": f"edge-{investigation_id[:8]}-claim-verdict-{idx}",
                "source_node_id": claim_node_id,
                "target_node_id": verdict_node_id,
                "edge_type": "has_unresolved_gap",
                "label": "No Records Found"
            })

    return nodes, edges
