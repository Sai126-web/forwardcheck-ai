import {
  InvestigationDetail,
  InvestigationSummary,
  ExtractionResponse,
  TruthGraphData,
  Job,
  Evidence,
  BaitIndexSummary
} from "./types";

const API_BASE = "/api";

export async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let errorDetail = "API Request Failed";
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errorDetail;
    } catch {
      errorDetail = `HTTP ${response.status} ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  getHealth: () => fetchApi<{ status: string; providers: Record<string, any>; mode: string }>("/health"),

  listInvestigations: (params?: { q?: string; verdict?: string; mode?: string; guest_session_id?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set("q", params.q);
    if (params?.verdict) searchParams.set("verdict", params.verdict);
    if (params?.mode) searchParams.set("mode", params.mode);
    if (params?.guest_session_id) searchParams.set("guest_session_id", params.guest_session_id);
    const qs = searchParams.toString();
    return fetchApi<InvestigationSummary[]>(`/investigations${qs ? `?${qs}` : ""}`);
  },

  getInvestigation: (id: string) => fetchApi<InvestigationDetail>(`/investigations/${id}`),

  createInvestigation: (data: {
    title?: string;
    original_content: string;
    input_type?: string;
    language?: string;
    source_metadata?: Record<string, any>;
    guest_session_id?: string;
    reviewed_claims?: Array<{ position: number; original_text: string; normalized_claim: string }>;
  }) =>
    fetchApi<InvestigationDetail>("/investigations", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  renameInvestigation: (id: string, title: string) =>
    fetchApi<InvestigationSummary>(`/investigations/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    }),

  deleteInvestigation: (id: string) =>
    fetchApi<{ message: string; id: string }>(`/investigations/${id}`, {
      method: "DELETE",
    }),

  extractContent: (data: { content?: string; input_type?: string; url?: string; metadata?: Record<string, any> }) =>
    fetchApi<ExtractionResponse>("/investigations/extract", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  uploadMultimodalFile: async (file: File, inputType: string): Promise<ExtractionResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("input_type", inputType);

    const res = await fetch(`${API_BASE}/investigations/upload-multimodal`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Upload failed" }));
      throw new Error(err.detail || "Upload error");
    }
    return res.json();
  },

  getGraph: (id: string) => fetchApi<TruthGraphData>(`/investigations/${id}/graph`),

  updateGraphPositions: (id: string, positions: Record<string, { x: number; y: number }>) =>
    fetchApi<{ status: string }>(`/investigations/${id}/graph/positions`, {
      method: "POST",
      body: JSON.stringify({ positions }),
    }),

  getJob: (id: string) => fetchApi<Job>(`/investigations/${id}/job`),

  retryInvestigation: (id: string) =>
    fetchApi<Job>(`/investigations/${id}/retry`, {
      method: "POST",
    }),

  listEvidence: (params?: { q?: string; stance?: string; tier?: string; investigation_id?: string }) => {
    const sp = new URLSearchParams();
    if (params?.q) sp.set("q", params.q);
    if (params?.stance) sp.set("stance", params.stance);
    if (params?.tier) sp.set("tier", params.tier);
    if (params?.investigation_id) sp.set("investigation_id", params.investigation_id);
    const qs = sp.toString();
    return fetchApi<Evidence[]>(`/evidence${qs ? `?${qs}` : ""}`);
  },

  analyzeBait: (text: string) =>
    fetchApi<BaitIndexSummary>("/bait/analyze", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  createShareLink: (id: string) =>
    fetchApi<{ share_url: string; token: string; expires_at: string }>(`/investigations/${id}/share`, {
      method: "POST",
      body: JSON.stringify({ expires_in_hours: 168 }),
    }),
};
