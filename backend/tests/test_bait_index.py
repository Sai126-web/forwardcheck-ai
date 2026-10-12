import pytest
from app.services.bait_index import analyze_bait_index

def test_bait_index_counterexample_urgent_warning():
    """
    Test counterexample: A legitimate urgent alert may score high on urgency
    because it uses urgent words, demonstrating it measures rhetoric, not falsehood.
    """
    text = "URGENT WARNING: Flash floods reported in area. Evacuate immediately within 24 hours. Red alert declared."
    res = analyze_bait_index(text)
    assert res.total_score > 0
    urgency_cat = next(c for c in res.categories if c.category == "artificial_urgency")
    assert urgency_cat.score > 0
    assert res.is_heuristic_indicator is True
    assert "not a measure of factual accuracy" in res.disclaimer

def test_bait_index_counterexample_calm_falsehood():
    """
    Test counterexample: A calm, polite pseudoscience message scores very low on the Bait Index
    despite being factually false.
    """
    text = "Drinking warm water with lemon every morning dissolves kidney stones naturally over three weeks."
    res = analyze_bait_index(text)
    # No urgent or sensational forward markers
    assert res.total_score <= 10
    assert res.risk_level == "Low"

def test_bait_index_forwarding_pressure_and_authority():
    """
    Test high bait index with multiple manipulative dimensions.
    """
    text = "WHO announced high alert! Supreme Court order issued. Forward this to everyone and all your family groups immediately or phone will be blocked! Poisonous virus spreading."
    res = analyze_bait_index(text)
    assert res.total_score >= 40
    assert any(c.score > 0 for c in res.categories if c.category == "authority_appeals")
    assert any(c.score > 0 for c in res.categories if c.category == "forwarding_pressure")
    assert any(c.score > 0 for c in res.categories if c.category == "scarcity_fear")

def test_bait_index_caps_at_20_per_category_and_100_total():
    """
    Test that no category exceeds 20 points, and the total score never exceeds 100.
    """
    repetitive_text = "urgent immediately act now breaking news alert critical notice before tonight deadline today hurry " * 5
    res = analyze_bait_index(repetitive_text)
    urgency_cat = next(c for c in res.categories if c.category == "artificial_urgency")
    assert urgency_cat.score == 20
    assert res.total_score <= 100
