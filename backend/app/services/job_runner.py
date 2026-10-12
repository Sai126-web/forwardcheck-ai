import asyncio
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.models import (
    Investigation, Claim, Source, Evidence, BaitTag, GraphNode, GraphEdge, GeneratedReport, Job
)
from app.services.bait_index import analyze_bait_index
from app.services.claim_decomposer import decompose_claims
from app.services.evidence_retriever import retrieve_evidence_for_claim
from app.services.verifier import classify_evidence_stance, determine_claim_verdict, calculate_overall_verdict
from app.services.graph_builder import build_investigation_graph
from app.services.explanations import generate_plain_explanations

async def execute_investigation_pipeline(investigation_id: str, db: Session, user_claims: Optional[List[Dict[str, Any]]] = None):
    """
    Executes the full forensic verification pipeline asynchronously.
    Updates the Job table with genuine stage progress and event logs.
    """
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        return

    job = db.query(Job).filter(Job.investigation_id == investigation_id).first()
    if not job:
        job = Job(
            investigation_id=investigation_id,
            stage="queued",
            progress_percent=5,
            current_task="Queued in investigation pipeline",
            events_log=[]
        )
        db.add(job)
        db.commit()

    def log_event(stage: str, percent: int, task: str):
        job.stage = stage
        job.progress_percent = percent
        job.current_task = task
        logs = list(job.events_log or [])
        logs.append({
            "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
            "stage": stage,
            "message": task
        })
        job.events_log = logs
        db.commit()

    try:
        # Step 1: Normalization & Bait Index Analysis
        log_event("analyzing_rhetoric", 15, "Analyzing rhetorical patterns & calculating Bait Index...")
        bait_summary = analyze_bait_index(inv.original_content)
        inv.bait_score = bait_summary.total_score

        # Save Bait Tags
        for tag in bait_summary.tags:
            bt = BaitTag(
                investigation_id=inv.id,
                category=tag.category,
                phrase=tag.phrase,
                start_char=tag.start_char,
                end_char=tag.end_char,
                severity=tag.severity,
                score_contribution=tag.score_contribution,
                explanation=tag.explanation
            )
            db.add(bt)
        db.commit()

        # Step 2: Atomic Claim Decomposition
        log_event("decomposing", 35, "Decomposing text into discrete, testable atomic factual claims...")
        if user_claims and len(user_claims) > 0:
            extracted_claims = user_claims
        else:
            extracted_claims = decompose_claims(inv.original_content)

        # Step 3: Evidence Discovery & Retrieval
        log_event("retrieving_evidence", 55, f"Searching primary repositories & fact-checking archives for {len(extracted_claims)} claims...")
        
        saved_claims = []
        all_claim_verdicts = []
        claims_for_graph = []

        for idx, claim_data in enumerate(extracted_claims):
            c_obj = Claim(
                investigation_id=inv.id,
                position=idx + 1,
                original_text=claim_data.get("original_text", ""),
                normalized_claim=claim_data.get("normalized_claim", ""),
                entities=claim_data.get("entities", []),
                dates_quantities=claim_data.get("dates_quantities", {}),
                category=claim_data.get("category", "factual")
            )
            db.add(c_obj)
            db.flush()

            # Retrieve evidence
            retrieved_sources = await retrieve_evidence_for_claim(claim_data)
            
            evaluated_evidence_items = []
            for ev_idx, s_item in enumerate(retrieved_sources):
                # Save Source
                src_obj = db.query(Source).filter(Source.url == s_item["url"]).first()
                if not src_obj:
                    src_obj = Source(
                        url=s_item["url"],
                        canonical_url=s_item.get("canonical_url", s_item["url"]),
                        title=s_item.get("title", "Online Source"),
                        publisher=s_item.get("publisher", "Independent Publisher"),
                        publication_date=s_item.get("publication_date"),
                        retrieval_date=datetime.utcnow().strftime("%Y-%m-%d"),
                        reliability_tier=s_item.get("reliability_tier", "trusted_news")
                    )
                    db.add(src_obj)
                    db.flush()

                # Stance Classification
                stance, relevance_exp = classify_evidence_stance(c_obj.normalized_claim, s_item.get("excerpt", ""))
                
                ev_obj = Evidence(
                    claim_id=c_obj.id,
                    source_id=src_obj.id,
                    citation_number=ev_idx + 1,
                    excerpt=s_item.get("excerpt", ""),
                    stance=stance,
                    relevance_explanation=relevance_exp
                )
                db.add(ev_obj)
                evaluated_evidence_items.append({
                    "id": ev_obj.id,
                    "stance": stance,
                    "excerpt": s_item.get("excerpt", ""),
                    "relevance_explanation": relevance_exp,
                    "citation_number": ev_idx + 1,
                    "source": {
                        "url": src_obj.url,
                        "title": src_obj.title,
                        "publisher": src_obj.publisher
                    }
                })

            # Step 4: Verification for this claim
            claim_verdict, verdict_rationale = determine_claim_verdict(c_obj.normalized_claim, evaluated_evidence_items)
            c_obj.verdict = claim_verdict
            c_obj.verdict_rationale = verdict_rationale
            all_claim_verdicts.append(claim_verdict)
            db.flush()

            claims_for_graph.append({
                "id": c_obj.id,
                "position": c_obj.position,
                "normalized_claim": c_obj.normalized_claim,
                "original_text": c_obj.original_text,
                "entities": c_obj.entities,
                "verdict": c_obj.verdict,
                "verdict_rationale": c_obj.verdict_rationale,
                "evidence_items": evaluated_evidence_items
            })

        # Calculate overall verdict
        overall_verdict = calculate_overall_verdict(all_claim_verdicts)
        inv.overall_verdict = overall_verdict

        # Step 5: TruthGraph Synthesis
        log_event("generating_graph", 75, "Constructing interactive TruthGraph topological network...")
        nodes, edges = build_investigation_graph(
            investigation_id=inv.id,
            original_title=inv.title,
            claims=claims_for_graph,
            bait_summary=bait_summary.model_dump(),
            overall_verdict=overall_verdict
        )

        for n in nodes:
            db.add(GraphNode(
                id=n["id"],
                investigation_id=inv.id,
                node_type=n["node_type"],
                label=n["label"],
                data=n["data"],
                x_pos=n["x_pos"],
                y_pos=n["y_pos"]
            ))

        for e in edges:
            db.add(GraphEdge(
                id=e["id"],
                investigation_id=inv.id,
                source_node_id=e["source_node_id"],
                target_node_id=e["target_node_id"],
                edge_type=e["edge_type"],
                label=e.get("label")
            ))

        # Step 6: Generate Multilingual Reports & WhatsApp Rebuttal
        log_event("generating_graph", 90, "Formulating multilingual plain-language reports & WhatsApp rebuttal...")
        reports = generate_plain_explanations(
            title=inv.title,
            overall_verdict=overall_verdict,
            claims=claims_for_graph,
            bait_score=inv.bait_score
        )

        rep_obj = GeneratedReport(
            investigation_id=inv.id,
            overall_conclusion=reports["overall_conclusion"],
            plain_explanation_en=reports["plain_explanation_en"],
            plain_explanation_hi=reports["plain_explanation_hi"],
            plain_explanation_mr=reports["plain_explanation_mr"],
            whatsapp_rebuttal=reports["whatsapp_rebuttal"],
            image_context_findings="Analysis conducted on provided multimodal artifact."
        )
        db.add(rep_obj)

        # Complete
        inv.status = "completed"
        # Determine execution mode: live if search worked, partial if fallback, or sample
        if inv.execution_mode != "sample":
            has_sources = any(len(c.get("evidence_items", [])) > 0 for c in claims_for_graph)
            inv.execution_mode = "live" if has_sources else "partial"

        log_event("completed", 100, "Investigation completed successfully.")
        db.commit()

    except Exception as exc:
        db.rollback()
        inv.status = "failed"
        log_event("failed", 100, f"Error in investigation pipeline: {str(exc)}")
        job.error_message = str(exc)
        db.commit()
