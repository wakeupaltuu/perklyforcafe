# Firestore Usage & Cost Audit

Scope: all source files in this repository, excluding generated `dist/` and dependencies. This is a code audit, not a billing export. Where a collection size, browser cache result, authentication state, or listener lifetime is not knowable from the repository, this report uses variables rather than inventing a number.

## Count notation

| Symbol | Meaning |
| --- | --- |
| `M` | Documents in `cafes/{cafeSlug}/menu` at listener attachment |
| `R` | Documents in `cafes/{cafeSlug}/rewards` |
| `T` | Documents in `cafes/{cafeSlug}/tiers` |
| `C` | Documents in `cafes/{cafeSlug}/categories` at listener attachment |
| `U` | Subsequent matching document changes delivered while a listener is active |

Firestore bills an initial collection listener for each returned document and normally bills each delivered document change as a further read. The exact number of listener updates (`U`) cannot be determined from code alone.

## Reads

| File / function | Path / query | Trigger | Docs read | Type / repetition | Cache / merge / removal assessment |
| --- | --- | --- | --- | --- | --- |
| `api/manifest.ts` `handler` | `cafes/{slug}` | Browser/PWA requests `/api/manifest`, referenced by `index.html` | 1 per API cache miss | One-time Admin SDK read. Response has `max-age=300`; actual browser request/cache behavior is outside the code. | Cache is already instructed for five minutes. Could source static/common manifest metadata elsewhere, but this request is separate from the web client’s cache. |
| `src/context/TenantContext.tsx` `loadTenant` | `cafes/{cafeSlug}` | Every `TenantProvider` mount/app launch | 1 | One-time. Duplicated by the auth callback below for a signed-in user. | High-priority removal/merge: reuse this loaded cafe or a single promise/cache; do not read it again in `onAuthStateChanged`. |
| `src/context/TenantContext.tsx` `loadTenant` | all docs in `cafes/{cafeSlug}/rewards` | Every app launch, regardless of route | `R` | One-time. No screen re-fetch while provider remains mounted. | Cache/load on the Rewards route, or persist with a TTL. Cannot merge with the cafe-document lookup without denormalizing reward summaries into `cafes/{slug}`. |
| `src/context/TenantContext.tsx` `loadTenant` | all docs in `cafes/{cafeSlug}/tiers` | Every app launch, regardless of route | `T` | One-time. `tiers` are loaded but no component in this repository consumes `tiers`. | High-priority candidate for removal. Confirm no external/hidden runtime consumer before deleting; based on this codebase it is unused. |
| `src/context/TenantContext.tsx` `unsubscribeMenu` | all docs in `cafes/{cafeSlug}/menu` | Every `TenantProvider` mount, even before the Menu page is visited | initial `M`, then `U_menu` | Realtime listener for full app session. It stops only on provider unmount. | High-priority: change to `getDocs` on Menu/Home demand, cached query, unless live menu changes must immediately appear everywhere. Current design starts it on login, Login, Home, Scan, etc. |
| `src/context/TenantContext.tsx` auth callback | `cafes/{cafeSlug}` | Each authenticated auth-state event after mount | 1 | One-time per callback. It exists only to check `exists()`. | Duplicate of `loadTenant`’s cafe read in the same effect for ordinary signed-in launches. Reuse `cafe`/load result. |
| `src/context/TenantContext.tsx` auth callback | `users_{cafeSlug}/{uid}` | Each authenticated auth-state event | 1 | One-time existence check. Then the same document is subscribed below. | Merge/remove where safe: attach the profile listener and create only through an intentional registration flow/transaction or callable backend. Avoid a separate read if the listener is already required. |
| `src/context/TenantContext.tsx` profile `onSnapshot` | `users_{cafeSlug}/{uid}` | After authenticated auth callback | initial 1, then `U_profile` | Realtime listener for the app session; it is unsubscribed on logout/provider unmount. No visibility handler pauses it in a background tab. | Necessary only if immediate profile synchronization is required across tabs/devices. For this UI, a one-time `getDoc` plus local optimistic updates/refetch after check-in/redeem would reduce ongoing reads. |
| `src/pages/Menu.tsx` effect | all docs in `cafes/{cafeSlug}/categories` | Each visit/mount of Menu | initial `C`, then `U_categories` | Realtime listener. Stops on leaving the Menu route via effect cleanup. | A `getDocs` query, cached for the session/TTL, is usually sufficient because categories are admin-managed and seldom need live updates. |
| `src/pages/Login.tsx` `handleSubmit` (signup only) | `users_{cafeSlug || 'perkly'}/{uid}` | New email/password registration | 1 | One-time, but races/duplicates the identical existence/create flow in `TenantContext` after auth state changes. | Remove this duplicate creation path and make one authoritative user-provisioning path. If retained, use a transaction/server function to eliminate race conditions. |

No other `getDoc`, `getDocs`, query execution, or Firestore read API is present in the repository.

## Writes

| File / function | Collection/document | Trigger and frequency | Necessary? | Batch/delay/duplicate assessment |
| --- | --- | --- | --- | --- |
| `src/context/TenantContext.tsx` auth callback | `users_{cafeSlug}/{uid}` | First authenticated encounter when the user document does not exist; at most once per user/cafe in the successful non-racing case | Needed to initialize a profile, but client-side provisioning is not the only design. | Duplicates `Login.handleSubmit`’s new-user provisioning. Do not batch with unrelated check-ins; create once in one authoritative flow. |
| `src/pages/Login.tsx` `handleSubmit` signup | `users_{cafeSlug || 'perkly'}/{uid}` | New email/password signup if read says missing | Intended once | Duplicate of the provider provisioning write and may race it; current code can perform two same-document set operations. | Remove/consolidate. A transaction/callable backend is appropriate if existence must be atomically checked. |
| `src/pages/Scan.tsx` `onScanSuccess` | `users_{cafeSlug}/{uid}` | Each accepted QR check-in | 1 document write | Functionally needed for points, visits, check-in history and visit history. | One `updateDoc` already atomically changes all fields, so batching does not reduce writes. It should not be deferred to close: closing can lose the loyalty event. Duplicate/abuse prevention is client-controlled only; stale `profile` can permit concurrent/double sessions. Use a transaction or trusted server function for exactly-once daily check-in. |
| `src/pages/Scan.tsx` `handleManualCheckIn` | `users_{cafeSlug}/{uid}` | Every manual-test check-in | 1 document write | Not necessary in production unless intentionally supported. | Same implementation as QR success. This is a production cost and fraud path; remove or guard to development/admin use. |
| `src/pages/Rewards.tsx` `handleRedeem` | `users_{cafeSlug}/{uid}` | Each reward redemption | 1 document write | Needed if redemption is a user-document-only feature. | One atomic update already combines point subtraction and earned reward. Do not delay; use a transaction/server function to ensure balance is sufficient and prevent concurrent double redemptions. |
| `src/hooks/useBrowsingTracker.ts` `flush` | `users_{cafeSlug}/{uid}` | `visibilitychange` to hidden or `pagehide`, after one or more menu-detail views | At most 1 write per flush, regardless of number of distinct viewed items since the previous flush | Optional analytics/personalization; not required for core loyalty features. | Good aggregation within one flush, but it can still write on every background/foreground cycle. Delay/throttle (e.g., daily or explicit session end), use local storage/analytics, or omit it. It does not run merely from opening Menu; a detail page must remain open for 2 seconds first. |

`arrayUnion` and multiple `increment` fields inside a single `updateDoc` still constitute one document write for the target user document. There is no `writeBatch` or `runTransaction` in use.

## Deletes

There are no Firestore delete calls (`deleteDoc`, Admin `.delete()`, batched deletes, or recursive deletes) in the repository. `sw.js` deletes browser Cache Storage entries only; those are not Firestore document deletes.

## Realtime listeners

| Listener | Starts | Stops | Background behavior | Reads generated / recommendation |
| --- | --- | --- | --- | --- |
| Tenant menu listener (`TenantContext`) on `cafes/{slug}/menu` | Provider mount | Provider cleanup (usually browser app unmount) | Yes: no code pauses it when the tab is hidden. | `M + U_menu`. Replace with on-demand `getDocs` + cache unless immediate global menu updates are an explicit product requirement. |
| User profile listener (`TenantContext`) on `users_{slug}/{uid}` | Authenticated auth-state callback | Logout or provider cleanup | Yes: no hidden-tab pause. | `1 + U_profile`. In this code, each successful user-document update can cause one profile listener read while connected. Retain only if multi-device immediacy is needed. |
| Menu category listener (`Menu`) on `cafes/{slug}/categories` | Menu route mount | Menu route unmount | Only while Menu is mounted. | `C + U_categories`. Prefer one-time cached fetch because categories are not user-generated/live UI data. |

All three unsubscribes are correctly returned/retained for their React effect lifetimes. The cost issue is scope and duration, not a missing cleanup on navigation for Categories.

## Navigation/session analysis

The app-wide provider loads before routing/auth protection, so the baseline applies even when the visitor is sent to Login. Counts below are incremental after the app launch unless noted.

| Screen/action | Reads | Writes | Deletes | Code evidence / note |
| --- | ---: | ---: | ---: | --- |
| App launch, existing authenticated user | `4 + M + R + T`, plus manifest read if `/api/manifest` is requested | 0 | 0 | Cafe loaded twice (2); rewards `R`; tiers `T`; menu listener `M`; user existence read (1); profile listener initial (1). The numeric fixed portion is 4. Manifest adds 1 Admin read per cache miss. |
| Login screen / unauthenticated launch | `1 + M + R + T`, plus optional manifest read | 0 | 0 | `loadTenant` and global menu listener run before the route redirects; no auth callback user/cafe reads without a user. |
| Login, existing user | No new read directly in `Login.tsx`; after auth callback: `3` | 0 | 0 | Auth callback reads cafe, user doc, then initial profile snapshot. |
| Signup | At least the provider auth-callback `3`; Login adds 1 user read; exact duplicated provisioning writes are timing-dependent | 1–2 | 0 | Both components check/create the same user document concurrently. |
| Home | 0 incremental | 0 | 0 | Uses context data only. |
| Loyalty card / Pass | 0 incremental | 0 | 0 | Uses profile/cafe context only. |
| Rewards page | 0 incremental | 0 | 0 | Rewards were already fetched globally at launch. |
| Offers page | 0 identifiable | 0 | 0 | No Offers route/component/Firestore path exists in this repository. The Locations UI has a non-functional “Today's Offer” button. |
| Menu page | `C + U_categories while open` | 0 | 0 | Adds category listener; menu data was already being listened to globally. |
| Open Menu item for at least 2 seconds | 0 immediate | 0 until flush | 0 | Adds a local tracking event only. |
| QR scan / manual test successful visit | 0 direct; ordinarily `+1` profile-listener delivery after write while connected | 1 | 0 | The profile read is listener-dependent, so it is not a separate `getDoc`. |
| Visit success screen | 0 incremental | 0 | 0 | It is a local state rendered by `Scan`. |
| Profile | 0 incremental | 0 | 0 | Renders existing profile context. |
| Redeem reward | 0 direct; ordinarily `+1` profile-listener delivery while connected | 1 | 0 | One atomic user-document update. |
| App close/background | 0 determinable | 0, or 1 browsing-preference flush if qualifying detail views exist | 0 | `pagehide`/hidden may call `flush`; browser delivery and whether prior tracking happened cannot be known from code. |

## Daily active-user estimate (the exact requested path)

Assumptions explicitly supplied by the request: one app open; views Rewards, Offers, and Menu; scans one QR and earns points; closes app. This code has no Offers page, and it does not say the user opens a menu-item detail, so the browsing tracker does not write.

For an **existing authenticated user**, with no admin data changes while the app is open:

* Client baseline reads: `4 + M + R + T`.
* Menu screen reads: `C`.
* QR check-in causes one user-document write and, while the profile listener is connected, normally one additional profile-listener document read.
* Server manifest reads: add `0 or 1`, because whether the browser requests/caches the manifest cannot be established from application code.

Therefore the code-supported daily estimate is:

| Metric | Exact formula / boundary |
| --- | --- |
| Reads/day | `5 + M + R + T + C + U`, where the fixed `5` includes the initial profile snapshot and one expected profile update after QR check-in; add `0–1` for the manifest API read. `U` is any other menu/profile/category listener change while active. |
| Writes/day | `1` (successful QR check-in) |
| Deletes/day | `0` |

The formula cannot be turned into a single numeric count without the live values of `M`, `R`, `T`, `C`, browser cache behavior, and listener updates. It would violate the requested “do not guess” constraint to fabricate those inputs.

If “opens menu” includes opening a menu-item detail for two seconds or more, add one browsing-preference write on subsequent `hidden`/`pagehide` flush, and normally add another profile-listener read when that write is observed.

## Cost optimizations

| Priority | Change | Why it saves | Estimated reduction | UX effect |
| --- | --- | --- | --- | --- |
| High | Remove the authenticated auth callback’s second `getDoc(cafes/{slug})`; share `loadTenant`’s result. | It is a duplicate existence test of the same cafe document during ordinary signed-in startup. | 1 read per authenticated app launch. | None if shared load errors/not-found state are handled. |
| High | Stop loading `tiers` globally; it is unused in this repository. | Eliminates a query unrelated to any rendered feature. | `T` reads per launch. | None in current code; confirm no external consumer. |
| High | Fetch rewards only when Rewards is visited, cache by cafe/TTL (TanStack Query is suitable), or persist a versioned summary in the cafe doc. | Rewards are currently read on every launch even when the user never views them. | `R` reads on launches that do not visit Rewards. | First Rewards visit may show a short loading state unless prefetching. |
| High | Replace the global menu `onSnapshot` with on-demand cached `getDocs`; subscribe only on menu-related screens if live change propagation is truly required. | The full menu is read and kept live on every app session. | Avoids `M + U_menu` for sessions not requiring menu/live updates. | Menus may update on refresh/TTL instead of instantly. |
| High | Consolidate user-document provisioning into one path, preferably a server/callable function or a transaction. | Login and Provider separately read/create the same document and can race. | Signup removes 1 user read and prevents up to 1 duplicate write; exact current race outcome is nondeterministic. | None; improves correctness. |
| High | Validate check-in and reward redemption in transactions or trusted server code with an idempotency key/date. | Client-side stale profile data can allow duplicate or concurrent actions; failed/retried writes are expensive and undermine loyalty integrity. | Prevents duplicate/retry writes; cannot quantify from code. | Small latency/security tradeoff, better correctness. |
| Medium | Replace Categories `onSnapshot` with cached `getDocs` on Menu mount. | Admin-maintained categories rarely need realtime delivery. | Avoids `U_categories`; session cache avoids repeated `C` reads on revisits. | Category changes appear after TTL/refresh. |
| Medium | Use a one-time profile read plus optimistic local state/refetch after owned writes, if cross-device live updates are not required. | The user profile listener persists for the full app session and receives every profile change. | Avoids `U_profile`; owned scan/redeem/tracker writes also no longer trigger listener reads. | Cross-device profile updates are not immediate. |
| Medium | Throttle/delay browsing-preference flushes; store a daily/session aggregate locally and flush once, or use an analytics product. | The hook aggregates one flush well, but flushes on every hide/pagehide cycle. | Up to one or more user writes and profile listener reads per foreground/background cycle. | Recommendations update less immediately; core functionality unaffected. |
| Medium | Keep Firestore offline persistence/local cache deliberately configured and design query invalidation/TTL around it. | Can serve repeat navigation/restarts from local data and reduce network/read exposure depending on SDK cache state and listener reconnection. | Cannot promise a billed-read number from this code alone. | Faster offline/repeat experience; requires cache/version management. |
| Low | Use TanStack Query for one-time cafe/rewards/tiers/categories/menu fetches and dedupe concurrent consumers. | It provides request deduplication, stale-time control, and route-level prefetch. | Removes duplicate in-memory fetches/revisits; it does not by itself eliminate a Firestore listener’s initial reads. | None to positive with sensible stale times. |
| Low | Denormalize a small, versioned reward/menu summary into `cafes/{slug}` only if Home needs it. | A single cafe-document read can replace multiple collection reads for small static metadata. | Potentially `R + T` query reads per launch, but full item lists still require their docs. | Larger cafe document and more admin write fan-out; use only for bounded data. |

Memoization in `Home`/`Menu` cannot itself reduce Firestore billing here: the queries/listeners are in effects with stable dependencies, not in render. Its value is rendering performance only. Similarly, batching Scan/Rewards fields would not reduce writes because each action already updates one document once.

## Final summary

| Screen / Action | Reads | Writes | Deletes | Can Be Optimized? | Recommendation |
| --- | ---: | ---: | ---: | --- | --- |
| App launch (signed in) | `4 + M + R + T` (+ optional manifest) | 0 | 0 | Yes | Remove duplicate cafe read; defer unused tiers/rewards/menu. |
| Home | 0 | 0 | 0 | N/A | Uses loaded context. |
| Loyalty Pass | 0 | 0 | 0 | N/A | Uses loaded context. |
| Rewards | 0 incremental | 0 | 0 | Yes | Route-load/cache rewards instead of startup load. |
| Offers | 0 | 0 | 0 | N/A | No feature/data path exists. |
| Menu | `C + U_categories` | 0 | 0 | Yes | Cache one-time category query; make menu on-demand. |
| QR/visit success | normally `+1` listener delivery | 1 | 0 | Yes | Trusted idempotent write; remove manual-test path in production. |
| Profile | 0 incremental | 0 | 0 | Yes | Consider non-realtime profile if live sync is unnecessary. |
| Redeem | normally `+1` listener delivery | 1 | 0 | Yes | Transaction/server validation. |
| App close | 0 known | 0–1 tracker flush | 0 | Yes | Throttle/defer optional preference analytics. |

### Monthly usage

Let `D = 5 + M + R + T + C + U` be the code-supported client read total for the specified daily path, excluding the uncertain `0–1` manifest API read. Let `W = 1` and deletes `= 0`.

Using a stated 30-day month:

| Daily active users | Reads/month | Writes/month | Deletes/month |
| ---: | ---: | ---: | ---: |
| 100 | `3,000 × D` | 3,000 | 0 |
| 1,000 | `30,000 × D` | 30,000 | 0 |
| 10,000 | `300,000 × D` | 300,000 | 0 |
| 100,000 | `3,000,000 × D` | 3,000,000 | 0 |

Add `0–30 × DAU` manifest document reads per month depending on browser/API caching, and add any unbounded listener changes `U` plus optional browsing-tracker writes.

### Conclusions

1. The architecture is functional but not cost-efficient: it globally loads/listens to data before it is needed and has duplicated startup/user-provisioning reads.
2. The largest identifiable cost drivers are the global full-menu listener (`M + U_menu`), unconditional rewards (`R`) and tiers (`T`) reads, and the persistent profile listener (`U_profile`). Their absolute cost needs live collection sizes/change rates.
3. Fix first: eliminate the duplicate cafe read, stop the unused tiers query, make menu/rewards route-driven and cached, then consolidate user creation and secure check-in/redemption.
