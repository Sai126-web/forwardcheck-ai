import pytest
from fastapi.testclient import TestClient
from app.main import app

def test_health_check_endpoint():
    with TestClient(app) as client:
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "providers" in data

def test_sample_investigations_seeded():
    with TestClient(app) as client:
        response = client.get("/api/investigations")
        assert response.status_code == 200
        items = response.json()
        assert len(items) >= 3
        sample_ids = [item["id"] for item in items]
        assert "sample-plastic-rice-2026" in sample_ids

def test_investigation_detail_and_graph():
    with TestClient(app) as client:
        response = client.get("/api/investigations/sample-plastic-rice-2026")
        assert response.status_code == 200
        data = response.json()
        assert data["overall_verdict"] == "False"
        assert len(data["claims"]) >= 1
        assert data["bait_score"] > 0

        # TruthGraph endpoint
        graph_resp = client.get("/api/investigations/sample-plastic-rice-2026/graph")
        assert graph_resp.status_code == 200
        graph_data = graph_resp.json()
        assert len(graph_data["nodes"]) > 0
        assert len(graph_data["edges"]) > 0

def test_evidence_library_endpoint():
    with TestClient(app) as client:
        response = client.get("/api/evidence")
        assert response.status_code == 200
        ev_list = response.json()
        assert len(ev_list) >= 1
        assert "excerpt" in ev_list[0]
        assert "source" in ev_list[0]

def test_extraction_preview():
    with TestClient(app) as client:
        payload = {
            "content": "Alert! Supreme Court ordered all schools to close by 5 PM today. Forward to all parents immediately!",
            "input_type": "text"
        }
        response = client.post("/api/investigations/extract", json=payload)
        assert response.status_code == 200
        res = response.json()
        assert len(res["detected_claims"]) >= 1
