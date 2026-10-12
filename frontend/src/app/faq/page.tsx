import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowLeft } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "What makes ForwardCheck AI different from general AI chatbots?",
      a: "General AI chatbots answer from unconstrained parameters and frequently hallucinate convincing falsehoods. ForwardCheck AI extracts discrete testable claims, retrieves verified external evidence from authoritative repositories, classifies evidence stances, and constructs an inspectable TruthGraph connecting each verdict directly to quoted excerpts."
    },
    {
      q: "What does the Bait Index score represent?",
      a: "The Bait Index (0 to 100) measures linguistic and psychological manipulation techniques such as artificial urgency, fake authority appeals, and emotional forwarding pressure. It is not a probability that the message is fake; rather, it highlights rhetorical tactics meant to bypass your skepticism."
    },
    {
      q: "Can I use ForwardCheck AI without creating an account?",
      a: "Yes. ForwardCheck AI supports guest mode out of the box. Your investigations and graphs are retained in your local guest session, and you can clear your session at any time from Settings."
    },
    {
      q: "How does the polite WhatsApp rebuttal feature work?",
      a: "When an investigation completes, our engine prepares a polite, factual, link-backed correction formatted for WhatsApp. The user reviews and deliberately copies this message to paste into their family or community groups. ForwardCheck AI never sends messages automatically."
    },
    {
      q: "What file formats are supported?",
      a: "You can submit pasted text, screenshots, image posters, audio voice notes, PDF documents, or public URLs. Each input is normalized and previewed before verification proceeds."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 text-xs text-[#94A3B8] leading-relaxed">
      <div className="border-b border-[#283548] pb-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#6665E8] hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-2xl font-bold text-[#F1F3F7]">Frequently Asked Questions</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Everything you need to know about evidence retrieval, TruthGraph, and verification.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-[#141B26] border border-[#283548] p-5 rounded-xl space-y-2">
            <h3 className="text-sm font-semibold text-[#F1F3F7]">{faq.q}</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
