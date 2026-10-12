from datetime import datetime
from app.models.models import (
    Investigation, Claim, Source, Evidence, BaitTag, GraphNode, GraphEdge, GeneratedReport
)
from app.services.bait_index import analyze_bait_index
from app.services.graph_builder import build_investigation_graph

SAMPLE_INVESTIGATIONS_DATA = [
    {
        "id": "sample-plastic-rice-2026",
        "title": "WHO Plastic Rice Contamination Alert",
        "input_type": "text",
        "execution_mode": "sample",
        "status": "completed",
        "overall_verdict": "False",
        "original_content": "URGENT WARNING FROM WHO: Plastic artificial rice is being sold across markets in India! Chemical polymers are mixed which cause instant stomach cancer within 24 hours. Supreme Court order has declared emergency food seizure. Forward this to everyone and all your family groups immediately before dinner tonight!",
        "claims": [
            {
                "position": 1,
                "original_text": "Plastic artificial rice is being sold across markets in India and contains chemical polymers.",
                "normalized_claim": "Artificial rice made of plastic polymers is being commercially sold in Indian markets.",
                "entities": ["WHO", "India"],
                "dates_quantities": {},
                "category": "factual",
                "verdict": "False",
                "verdict_rationale": "Food Safety and Standards Authority of India (FSSAI) and agricultural laboratories have repeatedly tested suspect samples and debunked the 'plastic rice' phenomenon as physically and economically unfeasible.",
                "evidence": [
                    {
                        "source": {
                            "url": "https://www.fssai.gov.in/upload/media/FSSAI_News_Plastic_Rice_Debunked.pdf",
                            "title": "FSSAI Factsheet on Infeasibility of Plastic Rice Rumors",
                            "publisher": "FSSAI Government of India",
                            "publication_date": "2024-05-10",
                            "reliability_tier": "primary_record"
                        },
                        "excerpt": "Plastic cannot be cooked into edible soft grains as plastic melts at cooking temperatures into a non-cohesive synthetic residue. Extensive tests by food inspectors across multiple states confirmed all submitted samples were natural rice.",
                        "stance": "contradicts",
                        "relevance_explanation": "Official government food laboratory analysis proving plastic grains cannot behave as cooked food."
                    },
                    {
                        "source": {
                            "url": "https://www.who.int/news-room/questions-and-answers/item/food-safety-myths",
                            "title": "World Health Organization: Fact vs Fiction in Food Safety",
                            "publisher": "World Health Organization (WHO)",
                            "publication_date": "2025-01-15",
                            "reliability_tier": "authoritative_factcheck"
                        },
                        "excerpt": "The World Health Organization has issued no warning or alert regarding 'plastic rice'. Hoaxes alleging WHO advisories on synthetic rice have circulated globally since 2011 and lack any empirical foundation.",
                        "stance": "contradicts",
                        "relevance_explanation": "Direct statement from WHO denying the issuance of any such warning."
                    }
                ]
            },
            {
                "position": 2,
                "original_text": "Supreme Court order has declared emergency food seizure.",
                "normalized_claim": "The Supreme Court of India ordered emergency nationwide seizures of rice stocks.",
                "entities": ["Supreme Court"],
                "dates_quantities": {},
                "category": "factual",
                "verdict": "False",
                "verdict_rationale": "No order, notice, or mention of plastic rice seizures exists in the Supreme Court case records or official gazettes.",
                "evidence": [
                    {
                        "source": {
                            "url": "https://main.sci.gov.in/judgments",
                            "title": "Supreme Court of India Official Orders Archive",
                            "publisher": "Supreme Court of India",
                            "publication_date": "2026-02-01",
                            "reliability_tier": "primary_record"
                        },
                        "excerpt": "Registry search reveals zero petitions, orders, or suo motu cognisance proceedings regarding 'plastic rice' seizures.",
                        "stance": "contradicts",
                        "relevance_explanation": "Absence of any judicial record corroborating the purported emergency ruling."
                    }
                ]
            }
        ]
    },
    {
        "id": "sample-lpg-deadline-2026",
        "title": "Government LPG Subsidy e-KYC Final Deadline",
        "input_type": "pdf",
        "execution_mode": "sample",
        "status": "completed",
        "overall_verdict": "Outdated",
        "original_content": "OFFICIAL NOTIFICATION: All domestic LPG cylinder connections must complete biometric e-KYC before 31st December or the subsidy will be canceled permanently and gas supply stopped from midnight tonight! Forward to all LPG users.",
        "claims": [
            {
                "position": 1,
                "original_text": "All domestic LPG cylinder connections must complete biometric e-KYC before 31st December or subsidy will be canceled permanently.",
                "normalized_claim": "LPG subsidy will be permanently terminated for customers failing to complete biometric e-KYC by 31st December.",
                "entities": ["Ministry of Petroleum and Natural Gas", "LPG"],
                "dates_quantities": {"dates": ["31st December"]},
                "category": "temporal",
                "verdict": "Outdated",
                "verdict_rationale": "While an initial advisory existed in late 2023, the Ministry of Petroleum explicitly clarified that no rigid deadline was set and subsidies would not be discontinued arbitrarily.",
                "evidence": [
                    {
                        "source": {
                            "url": "https://pib.gov.in/PressReleasePage.aspx?PRID=1991204",
                            "title": "PIB Clarification on Biometric e-KYC for Domestic LPG Customers",
                            "publisher": "Press Information Bureau (PIB)",
                            "publication_date": "2024-01-08",
                            "reliability_tier": "primary_record"
                        },
                        "excerpt": "Oil Marketing Companies (OMCs) clarify that there is no imminent deadline for LPG customers to complete biometric Aadhaar authentication. Gas delivery will not be halted for customers awaiting e-KYC verification.",
                        "stance": "qualifies",
                        "relevance_explanation": "Clarification from petroleum authorities debunking the strict cutoff deadline."
                    }
                ]
            }
        ]
    },
    {
        "id": "sample-rbi-scribbled-notes",
        "title": "RBI Rule on Currency Notes with Writing/Scribbling",
        "input_type": "url",
        "execution_mode": "sample",
        "status": "completed",
        "overall_verdict": "Partially Supported",
        "original_content": "Beware! As per new Reserve Bank of India rules, any banknote with writing or pen marks will become completely invalid from tomorrow. Banks will reject and confiscate these notes. Check your wallet now!",
        "claims": [
            {
                "position": 1,
                "original_text": "Any banknote with writing or pen marks will become completely invalid from tomorrow.",
                "normalized_claim": "Currency notes with writing on them cease to be legal tender as per RBI guidelines.",
                "entities": ["Reserve Bank of India", "RBI"],
                "dates_quantities": {},
                "category": "factual",
                "verdict": "Partially Supported",
                "verdict_rationale": "The RBI discourages writing on banknotes under its Clean Note Policy to prolong currency life, but scribbled notes remain 100% legal tender and can be exchanged or deposited at any bank branch.",
                "evidence": [
                    {
                        "source": {
                            "url": "https://rbi.org.in/scripts/FAQView.aspx?Id=136",
                            "title": "RBI FAQs on Clean Note Policy and Soiled Banknotes",
                            "publisher": "Reserve Bank of India",
                            "publication_date": "2024-11-20",
                            "reliability_tier": "primary_record"
                        },
                        "excerpt": "Under the Clean Note Policy, the public is requested not to write on currency notes. However, banknotes with scribbling remain valid legal tender and can be deposited at bank branches.",
                        "stance": "qualifies",
                        "relevance_explanation": "Primary bank policy confirms notes remain valid legal tender despite disincentivizing writing."
                    }
                ]
            }
        ]
    }
]

def seed_database(db):
    """Inserts sample investigations into the SQLite database if not present."""
    for s_data in SAMPLE_INVESTIGATIONS_DATA:
        existing = db.query(Investigation).filter(Investigation.id == s_data["id"]).first()
        if existing:
            continue

        # Bait Analysis
        bait_summary = analyze_bait_index(s_data["original_content"])

        inv = Investigation(
            id=s_data["id"],
            title=s_data["title"],
            original_content=s_data["original_content"],
            normalized_content=s_data["original_content"],
            input_type=s_data["input_type"],
            source_metadata={"seeded": True, "description": "Verified forensic demonstration dataset"},
            execution_mode="sample",
            status="completed",
            overall_verdict=s_data["overall_verdict"],
            bait_score=bait_summary.total_score,
            language="en"
        )
        db.add(inv)
        db.flush()

        # Seed Bait tags
        for t in bait_summary.tags:
            bt = BaitTag(
                investigation_id=inv.id,
                category=t.category,
                phrase=t.phrase,
                start_char=t.start_char,
                end_char=t.end_char,
                severity=t.severity,
                score_contribution=t.score_contribution,
                explanation=t.explanation
            )
            db.add(bt)

        # Claims & Evidence
        claims_for_graph = []
        for c_data in s_data["claims"]:
            c_obj = Claim(
                investigation_id=inv.id,
                position=c_data["position"],
                original_text=c_data["original_text"],
                normalized_claim=c_data["normalized_claim"],
                entities=c_data["entities"],
                dates_quantities=c_data["dates_quantities"],
                category=c_data["category"],
                verdict=c_data["verdict"],
                verdict_rationale=c_data["verdict_rationale"]
            )
            db.add(c_obj)
            db.flush()

            evidence_items_for_c = []
            for ev_idx, ev_data in enumerate(c_data.get("evidence", [])):
                src_data = ev_data["source"]
                # Create or find source
                src_obj = db.query(Source).filter(Source.url == src_data["url"]).first()
                if not src_obj:
                    src_obj = Source(
                        url=src_data["url"],
                        canonical_url=src_data["url"],
                        title=src_data["title"],
                        publisher=src_data["publisher"],
                        publication_date=src_data.get("publication_date"),
                        retrieval_date=datetime.utcnow().strftime("%Y-%m-%d"),
                        reliability_tier=src_data.get("reliability_tier", "high")
                    )
                    db.add(src_obj)
                    db.flush()

                ev_obj = Evidence(
                    claim_id=c_obj.id,
                    source_id=src_obj.id,
                    citation_number=ev_idx + 1,
                    excerpt=ev_data["excerpt"],
                    stance=ev_data["stance"],
                    relevance_explanation=ev_data["relevance_explanation"]
                )
                db.add(ev_obj)
                db.flush()
                evidence_items_for_c.append({
                    "id": ev_obj.id,
                    "stance": ev_data["stance"],
                    "excerpt": ev_data["excerpt"],
                    "relevance_explanation": ev_data["relevance_explanation"],
                    "citation_number": ev_idx + 1,
                    "source": {
                        "url": src_obj.url,
                        "title": src_obj.title,
                        "publisher": src_obj.publisher
                    }
                })

            claims_for_graph.append({
                "id": c_obj.id,
                "position": c_obj.position,
                "normalized_claim": c_obj.normalized_claim,
                "original_text": c_obj.original_text,
                "entities": c_obj.entities,
                "verdict": c_obj.verdict,
                "verdict_rationale": c_obj.verdict_rationale,
                "evidence_items": evidence_items_for_c
            })

        # Build Graph
        nodes, edges = build_investigation_graph(
            investigation_id=inv.id,
            original_title=inv.title,
            claims=claims_for_graph,
            bait_summary=bait_summary.model_dump(),
            overall_verdict=inv.overall_verdict
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

        # Report
        db.add(GeneratedReport(
            investigation_id=inv.id,
            overall_conclusion=f"Investigation concluded that claims in '{inv.title}' are [{inv.overall_verdict}].",
            plain_explanation_en=f"This message was classified as [{inv.overall_verdict}]. Multiple authoritative public records contradict the central allegations.",
            plain_explanation_hi=f"इस संदेश की जांच में निष्कर्ष [{inv.overall_verdict}] पाया गया है।",
            plain_explanation_mr=f"या संदेशाची सखोल तपासणी केली असता निष्कर्ष [{inv.overall_verdict}] आढळला आहे.",
            whatsapp_rebuttal=f"🙏 ForwardCheck AI Verification: The claims in '{inv.title}' are {inv.overall_verdict.upper()}. Please refrain from forwarding unverified messages.",
            image_context_findings="No reused or manipulated image context detected."
        ))

    db.commit()
