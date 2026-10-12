import os
import re
import urllib.parse
from datetime import datetime
from typing import List, Dict, Any, Optional
import httpx

def generate_search_queries(claim_text: str, entities: List[str]) -> List[str]:
    """Generates 2-3 focused search queries for a claim."""
    queries = []
    # Query 1: Direct fact check query
    clean_text = re.sub(r"[^\w\s]", "", claim_text).strip()
    words = clean_text.split()[:8]
    queries.append(" ".join(words) + " fact check")

    # Query 2: Entity + core keywords
    if entities:
        top_entities = " ".join(entities[:2])
        queries.append(f"{top_entities} official statement news")

    # Query 3: Exact claim phrase
    queries.append(" ".join(words[:6]))
    return list(dict.fromkeys(queries))

async def fetch_duckduckgo_evidence(query: str) -> List[Dict[str, Any]]:
    """
    Fetches real search results via DuckDuckGo HTML / API without requiring an API key.
    Zero-secret reliable fallback for live search.
    """
    results = []
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    try:
        async with httpx.AsyncClient(timeout=6.0, follow_redirects=True) as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code == 200:
                html = resp.text
                # Extract links and snippets from duckduckgo html
                # Matches <a class="result__url" href="..."> or <a class="result__snippet" ...>
                snippets = re.findall(r'<a class="result__snippet[^>]*>(.*?)</a>', html, re.DOTALL)
                titles = re.findall(r'<a class="result__url[^>]*href="([^"]+)"[^>]*>(.*?)</a>', html, re.DOTALL)
                
                # Alternate pattern
                result_blocks = re.findall(r'<div class="result__body[^>]*>(.*?)</div>\s*</div>', html, re.DOTALL)
                for block in result_blocks[:4]:
                    link_match = re.search(r'<a class="result__url"[^>]*href="([^"]+)"', block)
                    title_match = re.search(r'<h2 class="result__title">.*?<a[^>]*>(.*?)</a>', block, re.DOTALL)
                    snippet_match = re.search(r'<a class="result__snippet"[^>]*>(.*?)</a>', block, re.DOTALL)
                    
                    raw_href = link_match.group(1) if link_match else ""
                    # DDG wraps URLs in /l/?uddg=...
                    real_url = raw_href
                    if "uddg=" in raw_href:
                        parsed = urllib.parse.parse_qs(urllib.parse.urlparse(raw_href).query)
                        if "uddg" in parsed:
                            real_url = parsed["uddg"][0]
                    
                    title = re.sub(r"<[^>]+>", "", title_match.group(1)).strip() if title_match else "Web Evidence Source"
                    snippet = re.sub(r"<[^>]+>", "", snippet_match.group(1)).strip() if snippet_match else ""
                    
                    if real_url and len(snippet) > 20:
                        domain = urllib.parse.urlparse(real_url).netloc
                        results.append({
                            "url": real_url,
                            "canonical_url": real_url,
                            "title": title or domain,
                            "publisher": domain.replace("www.", ""),
                            "excerpt": snippet,
                            "publication_date": datetime.utcnow().strftime("%Y-%m-%d"),
                            "retrieval_date": datetime.utcnow().strftime("%Y-%m-%d"),
                            "reliability_tier": "trusted_news" if any(k in domain for k in ["reuters", "pib", "bbc", "altnews", "boomlive", "hindustantimes", "thehindu", "who.int"]) else "general_web"
                        })
    except Exception:
        pass
    return results

async def fetch_tavily_evidence(query: str, api_key: str) -> List[Dict[str, Any]]:
    """Fetches evidence using Tavily Search API if configured."""
    results = []
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(
                "https://api.tavily.com/search",
                json={
                    "api_key": api_key,
                    "query": query,
                    "search_depth": "advanced",
                    "include_answer": True,
                    "max_results": 4
                }
            )
            if resp.status_code == 200:
                data = resp.json()
                for item in data.get("results", []):
                    url = item.get("url", "")
                    domain = urllib.parse.urlparse(url).netloc
                    results.append({
                        "url": url,
                        "canonical_url": url,
                        "title": item.get("title", domain),
                        "publisher": domain.replace("www.", ""),
                        "excerpt": item.get("content", ""),
                        "publication_date": item.get("published_date") or datetime.utcnow().strftime("%Y-%m-%d"),
                        "retrieval_date": datetime.utcnow().strftime("%Y-%m-%d"),
                        "reliability_tier": "authoritative_factcheck" if any(k in domain for k in ["factcheck", "pib", "snopes", "altnews", "boomlive"]) else "trusted_news"
                    })
    except Exception:
        pass
    return results

async def retrieve_evidence_for_claim(claim: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Retrieves and deduplicates evidence passages from configured providers or DuckDuckGo.
    """
    claim_text = claim.get("normalized_claim") or claim.get("original_text", "")
    entities = claim.get("entities", [])
    queries = generate_search_queries(claim_text, entities)
    
    tavily_key = os.getenv("TAVILY_API_KEY", "").strip()
    evidence_list: List[Dict[str, Any]] = []

    # Priority 1: Tavily if configured
    if tavily_key:
        for q in queries[:1]:
            ev = await fetch_tavily_evidence(q, tavily_key)
            evidence_list.extend(ev)

    # Priority 2: DuckDuckGo live search
    if not evidence_list:
        for q in queries[:2]:
            ev = await fetch_duckduckgo_evidence(q)
            evidence_list.extend(ev)
            if len(evidence_list) >= 2:
                break

    # Deduplicate by domain or canonical URL
    seen_urls = set()
    deduped = []
    for item in evidence_list:
        u = item["url"]
        if u not in seen_urls:
            seen_urls.add(u)
            deduped.append(item)

    return deduped[:4]
