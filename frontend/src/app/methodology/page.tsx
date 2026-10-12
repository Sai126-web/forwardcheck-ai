import React from "react";
import Link from "next/link";
import { ShieldCheck, Target, Network, Flame, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { VerdictBadge } from "@/components/VerdictBadge";

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div className="border-b border-[#283548] pb-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#6665E8] hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-2xl font-bold text-[#F1F3F7]">Investigation Methodology & Principles</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Our forensic standard for evidence-grounded verification, atomic decomposition, and rhetorical analysis.
        </p>
      </div>

      <div className="space-y-6 text-xs text-[#94A3B8] leading-relaxed">
        {/* Core Philosophy */}
        <section className="bg-[#141B26] border border-[#283548] p-6 rounded-xl space-y-3">
          <h2 className="text-sm font-bold text-[#F1F3F7] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#6665E8]" />
            1. The Forensic Evidence Principle
          </h2>
          <p>
            Traditional automated fact-checking systems frequently make one of two critical mistakes: they return an unexplained binary &ldquo;True/False&rdquo; verdict, or they invent an arbitrary numerical confidence score (e.g. &ldquo;84.2% True&rdquo;). Both approaches obscure the actual basis of evaluation.
          </p>
          <p>
            ForwardCheck AI is built on the principle that <strong>evidence must be inspectable</strong>. Every assertion is broken down into atomic factual propositions and matched against primary government records, official laboratory filings, and authoritative fact-checking databases. If a claim cannot be substantiated, we report that evidence is missing rather than guessing.
          </p>
        </section>

        {/* 5 Canonical Verdicts */}
        <section className="bg-[#141B26] border border-[#283548] p-6 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-[#F1F3F7] flex items-center gap-2">
            <Target className="w-4 h-4 text-[#35AA9E]" />
            2. Strict Categorical Verdict Definitions
          </h2>
          <p>
            We strictly enforce exactly five verdict classifications:
          </p>
          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3 bg-[#0B0F17] p-3 rounded-lg border border-[#283548]">
              <VerdictBadge verdict="Verified" className="shrink-0" />
              <p>The claim is corroborated by primary public documents, official gazettes, or verified reporting from credible institutions.</p>
            </div>
            <div className="flex items-start gap-3 bg-[#0B0F17] p-3 rounded-lg border border-[#283548]">
              <VerdictBadge verdict="False" className="shrink-0" />
              <p>The claim is directly contradicted by reliable evidence, official scientific consensus, or verified government refutations.</p>
            </div>
            <div className="flex items-start gap-3 bg-[#0B0F17] p-3 rounded-lg border border-[#283548]">
              <VerdictBadge verdict="Outdated" className="shrink-0" />
              <p>The information originated from a legitimate past event, order, or notice, but the deadline has passed or the policy has expired.</p>
            </div>
            <div className="flex items-start gap-3 bg-[#0B0F17] p-3 rounded-lg border border-[#283548]">
              <VerdictBadge verdict="Partially Supported" className="shrink-0" />
              <p>The message contains a kernel of truth mixed with misleading omissions, exaggerated numbers, or altered regional applicability.</p>
            </div>
            <div className="flex items-start gap-3 bg-[#0B0F17] p-3 rounded-lg border border-[#283548]">
              <VerdictBadge verdict="Cannot Confirm" className="shrink-0" />
              <p>Public records are inconclusive or missing. Critical principle: <em>Absence of evidence does not prove a claim false</em>.</p>
            </div>
          </div>
        </section>

        {/* Bait Index Rubric */}
        <section className="bg-[#141B26] border border-[#283548] p-6 rounded-xl space-y-3">
          <h2 className="text-sm font-bold text-[#F1F3F7] flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#9670D7]" />
            3. Deterministic Bait Index™ Scoring
          </h2>
          <p>
            The Bait Index is an explainable heuristic metric measuring manipulative language, distinct from factual accuracy. It analyzes 5 dimensions (0 to 20 points each, capped at 100):
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Artificial Urgency</strong>: Time constraints (&ldquo;before tonight&rdquo;, &ldquo;immediately&rdquo;) pressuring reaction.</li>
            <li><strong>Authority Appeals</strong>: Vague or fabricated references to WHO, NASA, PM, or Supreme Court.</li>
            <li><strong>Forwarding Pressure</strong>: Explicit instructions (&ldquo;forward to 10 groups&rdquo;, &ldquo;don&apos;t break this chain&rdquo;).</li>
            <li><strong>Emotional Pressure</strong>: Guilt, outrage, or moral coercion (&ldquo;if you care about your family&rdquo;).</li>
            <li><strong>Scarcity or Fear</strong>: Stoking physical panic or financial disaster (&ldquo;poisonous&rdquo;, &ldquo;all accounts frozen&rdquo;).</li>
          </ul>
          <p className="bg-[#0B0F17] p-3 rounded-lg border border-[#283548] text-[11px]">
            <strong>Important Counterexamples:</strong> A legitimate disaster warning from civil authorities may score high on urgency while being 100% true. Conversely, a pseudoscientific claim written politely will score low on the Bait Index while being completely false.
          </p>
        </section>
      </div>
    </div>
  );
}
