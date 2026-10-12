# ForwardCheck AI — Privacy & Data Retention Policy

## 1. Zero Surveillance Commitment
ForwardCheck AI does not conduct automated surveillance, background chat harvesting, or mass web crawling of private communications.
- Verification is strictly user-initiated.
- The Manifest V3 Chrome extension only extracts text when the user clicks the extension action or requests selection extraction.
- No integration reads private WhatsApp, Telegram, or Signal databases.

## 2. Ephemeral Storage & Retention Controls
- Guest sessions are retained on the client and in the local database until explicitly cleared.
- Users can clear their session and cached dossiers at any time via `/settings`.
- Deletion operations cascade across all related database records (claims, evidence links, bait tags, graphs, and reports).

## 3. Deliberate Sharing
- Share links (`/investigations/{id}?share={token}`) are strictly opt-in and utilize 128-bit unguessable tokens.
- Share links can be expired or deleted by removing the parent investigation.
