# Decentrawood AI Chatbot — Project Roadmap & Spec

## 1. End Goal (one paragraph)

A production-grade conversational AI assistant embedded in the Decentrawood Web3 platform that (a) answers any question about Decentrawood/DEOD/Web3 accurately using the platform's own content, (b) auto-navigates the user inside the app **only** when the answer lives on the `decentrawood.com` domain itself, (c) hands out a clickable link — without navigating away — for anything on a subdomain, partner platform, exchange, or social channel, and (d) politely declines and redirects to support for anything outside the Decentrawood/Web3 domain. It should feel instant (cached), remember context within a session, and degrade gracefully when any external service (LLM, vector DB, Mongo, Redis) is slow or down.

---

## 2. Core Architecture

```
User (Next.js frontend)
        │
        ▼
FastAPI app.py  ──►  ChatOrchestrator (per-request pipeline)
        │
        ├── ConversationManager      (in-memory pronoun/topic resolution)
        ├── CacheService (Redis)      → short-circuits repeat/near-repeat queries
        ├── DomainService             → in-scope vs out-of-scope classification
        ├── IntentService             → page/action intent detection
        ├── RouteRetriever (Qdrant: decentrawood_routes)  → navigation candidates
        ├── RagService     (Qdrant: decentrawood_docs)    → answer content
        ├── NavigationDecision        → should_navigate / suggested_route logic
        ├── ResponseService (LLM)     → final answer generation
        ├── WebSearchService          → live price/news fallback
        └── HistoryService (MongoDB)  → session + chat history persistence
```

Two independent vector collections, built from two independent JSON pipelines — this separation is the single most important architectural decision in the project:

| Collection | Source | Answers |
|---|---|---|
| `decentrawood_routes` | `routes.json` → `routes_enriched.json` | "Where do I find X?" (navigation) |
| `decentrawood_docs` | `documents.json` → `chunks.json` | "What is X / how does X work?" (content) |

---

## 3. Data Layer — Knowledge Base Requirements

### 3.1 `routes.json` (raw) → `routes_enriched.json` (build output)
One entry per navigable destination. Required fields per route:

| Field | Purpose |
|---|---|
| `route_id` | stable snake_case key |
| `title` | display label |
| `url` | full absolute URL |
| `route` | relative path (only meaningful for `type: internal`) |
| `domain` | bare domain |
| `type` | `internal` \| `external_subdomain` \| `external_platform` \| `external_exchange` \| `external_dex` \| `social` — **this field alone drives the navigate-vs-link decision** |
| `description` | 1–2 sentence, used in the nav embedding |
| `aliases` | every phrasing a real user would type |
| `example_queries` | boosts semantic recall, especially for generic phrasing |
| `source_document_id` | link back to the matching `documents.json` entry, if any |
| `needs_review` | flag routes with no matching document/content for manual QA |

### 3.2 `documents.json` (full page content, build-time only) → `chunks.json` (embedded, runtime)
- `documents.json` = one record per scraped/authored page (title, category, keywords, summary, full `content`). **Not loaded at runtime** — it exists so `route_loader.py` can auto-derive rich `description`/`aliases`/`example_queries` for routes, and so chunks can be traced back to a source page and re-chunked later.
- `chunks.json` = the actual retrieval unit. Each chunk: `chunk_id`, `document_id`, `title`, `section`, `domain`, `category`, `url`, `keywords`, `content`. This is what gets embedded into `decentrawood_docs` and is what the model actually reads to answer.

### 3.3 Coverage checklist (must exist before go-live)
- [ ] All internal decentrawood.com pages (home, about, DAO, tokenomics, trade, metaverse, social zone, community, blog, news, privacy)
- [ ] All subdomains (gaming, culture, glamour, TuneHub/music, staking) — route **and** content
- [ ] All DEOD AI sub-pages (home, about, create-agent, KYA, use-agent, marketplace, technology, contact, login)
- [ ] All exchanges/DEX where DEOD trades
- [ ] Social channels (Twitter, Discord, Telegram, Instagram, Facebook)
- [ ] Granular item-level content where it exists (individual games, culture landmarks, glamour venues) — improves answer specificity even though these aren't separately routable

---

## 4. Navigation Intelligence — Rules of the Road

This is the behavior that most differentiates this bot from a generic RAG chatbot, so it deserves its own explicit spec:

1. **In-scope query, answer found on decentrawood.com itself** → answer + `should_navigate: true` + auto-redirect.
2. **In-scope query, answer lives on a subdomain / partner platform / exchange / social link** → answer + clickable URL in the response text (`suggested_route`) + `should_navigate: false`. Never auto-redirect off the primary domain.
3. **Out-of-scope query** (nothing to do with Decentrawood/Web3) → fixed fallback message + contact email. No navigation data of any kind, even if a route happened to match — decision and navigation payload must never contradict the reply text.
4. **Compound/blocklisted phrases** (e.g. "DEOD AI", "DEOD staking") must never accidentally match a bare-keyword route (e.g. "DEOD" → `/trade`) — a phrase-level blocklist runs before the keyword/alias scan.
5. **Ambiguous navigation** (top candidates too close in score, or a cluster of near-duplicate types like several exchanges) → prefer an internal aggregator route if one exists in the candidate set; otherwise answer-only and surface the top few as `related_routes`.
6. **Cache and history must store the *decision*, not just the answer text** — a cached response replayed later must re-apply the same navigate/link-only rule, not just replay stale text.

---

## 5. Feature Roadmap

### Phase 0 — Foundation
- [ ] FastAPI app skeleton, config, logging, `.env` management
- [ ] MongoDB connection (sessions + chat history) — JWT-based session tokens
- [ ] Redis connection (response cache + live-data cache)
- [ ] Qdrant connection, two collections created

### Phase 1 — Knowledge Base Pipeline
- [ ] `routes.json` authored/reviewed manually (source of truth for what's navigable)
- [ ] `documents.json` scraped/authored per page
- [ ] `route_loader.py` → generates `routes_enriched.json`
- [ ] Chunking pipeline → `chunks.json`
- [ ] `route_embedder.py` → indexes `decentrawood_routes`
- [ ] `store_index.py` (RAG indexer) → indexes `decentrawood_docs`

### Phase 2 — Core Answering
- [ ] `DomainService`: greeting detection, in-scope/out-of-scope classification (keyword fast-path + LLM fallback)
- [ ] `RagService`: similarity search + score threshold + context assembly
- [ ] `ResponseService`: LLM answer generation grounded in retrieved context, with a strict "Tier 4" out-of-scope instruction baked into the system prompt as a second line of defense
- [ ] Out-of-scope safety net: if the LLM itself decides a query is out of scope, any navigation computed earlier must be discarded

### Phase 3 — Navigation Intelligence
- [ ] `IntentService`: regex/pattern page-intent detection + LLM intent fallback + compound-phrase blocklist
- [ ] `RouteRetriever`: semantic route search against `decentrawood_routes`
- [ ] `NavigationDecision`: answer-score + nav-score matrix → `ANSWER` / `BOTH` decision, cluster-aware primary selection, `type == internal` gate for auto-navigate, `suggested_route` for everything else
- [ ] `NavigationService`: keyword/alias/fuzzy fallback when semantic search is unavailable

### Phase 4 — Conversation Quality
- [ ] `ConversationManager`: pronoun and topic-carry resolution across turns ("what about its price?" → resolves "its" to the last-discussed entity)
- [ ] `HistoryService`: persist every turn with intent/decision/navigation attached, not just text
- [ ] Multi-turn context window trimmed sensibly into the LLM prompt

### Phase 5 — Live Data
- [ ] `WebSearchService`: price/news queries detected and routed to live search instead of stale RAG content
- [ ] Short-TTL live-data cache (separate from the main response cache) to avoid hammering search on hot queries like DEOD price
- [ ] Graceful timeout/error fallback messages instead of hanging requests

### Phase 6 — Performance & Reliability
- [ ] Parallelize independent pipeline stages (intent detection, route search, RAG retrieval) via `asyncio.gather`
- [ ] Response caching keyed on normalized query, storing decision + navigation + sources together
- [ ] `FLUSHALL`-on-deploy discipline whenever navigation logic changes (stale cached decisions are worse than a cache miss)
- [ ] Stage-level timing logs for latency debugging

### Phase 7 — Testing & Ops
- [ ] Unit tests: intent detection, domain classification, navigation decision matrix (internal vs external, blocked compounds, ambiguous clusters)
- [ ] Regression test set of real user phrasings mapped to expected route/decision
- [ ] Local nav-testing URL rewrite toggle (`LOCAL_NAV_TESTING` config flag) so navigation can be validated against a staging frontend without touching production URLs
- [ ] Source/decision tracing per request for debugging ("why did it navigate/not navigate here?")

### Phase 8 — Frontend Integration (Next.js)
- [ ] Render `navigate_to` as an actual route push when `should_navigate: true`
- [ ] Render `suggested_route` / `related_routes` as clickable chips/links, not auto-redirects
- [ ] Voice-input navigation suppression (don't auto-navigate on voice-originated queries without explicit confirmation)
- [ ] Session token persistence across page loads

---

## 6. Tech Stack Summary

| Layer | Choice |
|---|---|
| API framework | FastAPI (async) |
| LLM | OpenAI-compatible chat completions |
| Vector DB | Qdrant (local or hosted), two collections |
| Embeddings | `all-MiniLM-L6-v2` (384-dim) |
| Session/chat history | MongoDB |
| Response/live-data cache | Redis |
| Auth | JWT session tokens |
| Frontend | Next.js |

---

## 7. Definition of Done (MVP)

A query is considered fully handled correctly if, for every test case:
1. The **decision type** (`ANSWER` / `BOTH`) matches expectation.
2. `should_navigate` is `true` only when the resolved route's `type == internal`.
3. When `should_navigate` is `false` but a relevant destination exists, the response text contains a clickable URL for it.
4. Out-of-scope queries never carry navigation data alongside the refusal message.
5. Repeated queries hit cache and still respect all of the above.