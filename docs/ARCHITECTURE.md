# Architecture Overview

## High-Level Diagram

```
[Browser]
   |  (WebSocket)
[Fly.io Node.js WS Server] <-> [Redis (Upstash)]
   |  (REST)
[Supabase DB]
```

## Flow
1. User opens editor (React app)
2. Yjs (Y.Doc) syncs via WebSocket to backend
3. Backend relays updates to all clients in the same doc room
4. Presence (cursors, avatars) syncs via Yjs awareness
5. Every 30s, backend snapshots doc state to Supabase
6. On restart, backend loads latest snapshot from Supabase
7. Redis pub-sub keeps multiple backend nodes in sync

## Components
- **Frontend:** React, Yjs, CodeMirror, custom UI
- **Backend:** Node.js, y-websocket, Redis pub-sub, Supabase persistence
- **Persistence:** Supabase (Postgres)
- **Scaling:** Redis (Upstash) for multi-node sync

---

See `/docs/UIUX.md` for design details. 