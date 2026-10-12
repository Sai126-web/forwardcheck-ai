import os
from typing import List, Dict, Any

def generate_plain_explanations(
    title: str,
    overall_verdict: str,
    claims: List[Dict[str, Any]],
    bait_score: int
) -> Dict[str, str]:
    """
    Generates plain-language investigative explanations in English, Hindi, and Marathi,
    plus a polite WhatsApp-ready factual rebuttal.
    """
    # Summary of key claim verdicts
    claim_summaries = []
    rebuttal_points = []
    
    for idx, c in enumerate(claims):
        v = c.get("verdict", "Cannot Confirm")
        txt = c.get("normalized_claim", "")
        rationale = c.get("verdict_rationale", "")
        claim_summaries.append(f"• Claim #{idx+1} ({v}): {txt} — {rationale}")
        
        if v == "False":
            rebuttal_points.append(f"❌ '{txt}' is FALSE according to verified records. {rationale}")
        elif v == "Outdated":
            rebuttal_points.append(f"⚠️ '{txt}' is OUTDATED. This refers to an older notice and is no longer valid.")
        elif v == "Partially Supported":
            rebuttal_points.append(f"⚖️ '{txt}' is PARTIALLY ACCURATE but missing critical context: {rationale}")
        elif v == "Verified":
            rebuttal_points.append(f"✅ '{txt}' has been confirmed by official sources.")

    claims_text_block = "\n".join(claim_summaries)
    rebuttal_points_block = "\n".join(rebuttal_points)

    # 1. English Explanation
    en_explanation = f"""Summary of Investigation:
The forwarded content titled "{title}" has been evaluated with an overall finding of [{overall_verdict}].
Our investigative decomposition evaluated {len(claims)} atomic claims against independent public records and fact-checking archives:

{claims_text_block}

Bait Index Rhetoric Analysis:
The message scored {bait_score}/100 on the Bait Index. This indicates the degree of urgency, forwarding pressure, or emotional appeals employed in the wording to accelerate unverified resharing. Note that the Bait Index measures psychological rhetoric, not factual veracity."""

    # 2. Hindi Explanation
    hi_verdict_map = {
        "Verified": "सत्यापित (Verified)",
        "False": "गलत / भ्रामक (False)",
        "Outdated": "पुराना / अप्रचलित (Outdated)",
        "Partially Supported": "आंशिक रूप से सही (Partially Supported)",
        "Cannot Confirm": "पुष्टि नहीं हो सकी (Cannot Confirm)"
    }
    hi_verdict = hi_verdict_map.get(overall_verdict, overall_verdict)
    
    hi_explanation = f"""जांच का निष्कर्ष:
फॉरवर्ड किए गए संदेश "{title}" की निष्पक्ष जांच की गई है। कुल निष्कर्ष: [{hi_verdict}]।
संदेश में किए गए {len(claims)} दावों का स्वतंत्र सरकारी रिकॉर्ड और फैक्ट-चेक स्रोतों से सत्यापन किया गया:

{claims_text_block}

बेट इंडेक्स (Bait Index) विश्लेषण:
इस संदेश को बेट इंडेक्स पर {bait_score}/100 का स्कोर मिला है। यह दिखाता है कि संदेश में तुरंत फॉरवर्ड करने या डर पैदा करने वाली भाषा का कितना उपयोग किया गया है।"""

    # 3. Marathi Explanation
    mr_verdict_map = {
        "Verified": "तपासणीत खरे (Verified)",
        "False": "खोटे / दिशाभूल करणारे (False)",
        "Outdated": "जुने / मुदत संपलेले (Outdated)",
        "Partially Supported": "अंशतः खरे (Partially Supported)",
        "Cannot Confirm": "खात्री करता येत नाही (Cannot Confirm)"
    }
    mr_verdict = mr_verdict_map.get(overall_verdict, overall_verdict)
    
    mr_explanation = f"""तपासणीचा निष्कर्ष:
फॉरवर्ड केलेल्या संदेशाची सखोल तपासणी केली असता, एकूण निष्कर्ष: [{mr_verdict}] आढळला आहे.
संदेशातील {len(claims)} तथ्यांची पडताळणी अधिकृत माहितीच्या आधारे करण्यात आली:

{claims_text_block}

बेट इंडेक्स (Bait Index):
या संदेशाला बेट इंडेक्सवर {bait_score}/100 गुण मिळाले आहेत. हे संदेशातील भीती, तातडी किंवा फॉरवर्ड करण्याचे भावनिक आवाहन मोजते."""

    # 4. Polite WhatsApp Rebuttal (deliberate copy-paste format)
    whatsapp_rebuttal = f"""🙏 नमस्ते! आपने जो संदेश फॉरवर्ड किया था, उसकी निष्पक्ष जांच (ForwardCheck AI) द्वारा की गई है:

📌 निष्कर्ष: *{overall_verdict.upper()}*

{rebuttal_points_block}

⚠️ कृपया बिना पुष्टि के संवेदनशील संदेश फॉरवर्ड न करें। पूरा सबूत और स्रोत यहां देखें:
🔗 ForwardCheck AI TruthGraph Verification Report"""

    return {
        "overall_conclusion": f"Investigation concluded with verdict [{overall_verdict}]. {len(claims)} atomic claims analyzed against corroborated evidence.",
        "plain_explanation_en": en_explanation,
        "plain_explanation_hi": hi_explanation,
        "plain_explanation_mr": mr_explanation,
        "whatsapp_rebuttal": whatsapp_rebuttal
    }
