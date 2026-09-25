# PAUSE — Product Requirements (Preview)

> ⚠️ **OBBLIGATORIO PRIMA DI QUALSIASI INTERVENTO:** leggere e rispettare
> [`/app/memory/CONSTITUTION.md`](./CONSTITUTION.md) — la Costituzione tecnica permanente
> e vincolante di PAUSE (regola "minimum change", niente riscritture, niente rigenerazione
> di contenuti/asset, niente AI a runtime, identità visiva dark-navy/cyan/glass).
> Lingua dell'utente: **italiano**.

## Summary
App mobile Expo (React Native + FastAPI + MongoDB) che trasforma i momenti morti in
curiosità / mini-lezioni, con una "pausa" intenzionale tra le sessioni. Contenuti
pre-generati (storie, capitoli, copertine, audio TTS) distribuiti dal backend.

## Ripristino ambiente da GitHub PAUSE-5.18 (25 settembre 2026 — sessione corrente)
- Richiesta utente: «Questa è la mia app, estrapolala e dammi la preview pronta completa».
- Codice clonato da `github.com/micheleiannello7-cyber/PAUSE-5.18` e copiato in `/app`
  preservando i file di piattaforma (`.git`, `.emergent`, `.env` di frontend/backend).
- **Backend**: FastAPI su `:8001`, MongoDB locale, `requirements.txt` installato
  (con `--extra-index-url` per `emergentintegrations`; aggiunti i pacchetti mancanti
  `emoji`, `elevenlabs`, `fal_client`, ecc.). Seed automatico all'avvio: **430 contenuti**,
  12 categorie. Health `/api/health` = ok.
- **Frontend**: Expo SDK 57. Eseguito `yarn install` (le vector-icons
  `@react-native-vector-icons/*` mancavano nei node_modules del template → bundling
  fallito finché non installate). Metro su `:3000`, preview attiva.
- **Env**: `backend/.env` esteso con `EMERGENT_LLM_KEY` (Universal Key, gratuita) e
  `ENFORCE_LIMIT="false"`. URL/porte nei `.env` NON modificati. Stripe/ElevenLabs
  volutamente non configurati (integrazioni idle).
- **Copertine**: sync all'avvio verso l'Object Storage gestito. La prima sync locale
  era abortita da un 500 transitorio dell'Object Storage sotto carico → aggiunta
  resilienza per-file in `backend/covers_sync.py` (retry ×3 + continue, nessuna
  generazione AI, nessun costo). Resync finale: **58 caricate, 265 già presenti,
  16 senza storia (ritirate), 0 fallite**. Le storie senza copertina generata usano il
  fallback hero Unsplash già previsto.

## Verifica preview (sessione corrente)
- `/api/health` = ok, `/api/categories` e `/api/stories` restituiscono dati.
- Frontend caricato a 390×844: intro cinematica (logo PAUSE, CTA "Start your pause")
  → onboarding "What do you want to read?" (card glass Curiosità / Mini lezioni)
  navigabile. Nessun errore di bundling dopo `yarn install`.

## Architettura
- `backend/server.py`: API `/api/*`, seed idempotente all'avvio, sync asset in background
  (copertine locali + importate, artwork categorie, cache media, adozione audio TTS legacy).
- `backend/storage.py`: helper Object Storage gestito (richiede `EMERGENT_LLM_KEY`).
- `frontend/app/*`: expo-router (intro, onboarding, tabs, browse, playlist, premium,
  stats, deep-dive, ecc.). Tema in `frontend/src/theme.ts`, i18n in `frontend/src/i18n.tsx`.

## File protetti (mai modificare)
`frontend/metro.config.js`, campo `main` di `package.json`, URL/porte nei `.env`
(`EXPO_PACKAGER_PROXY_URL`, `EXPO_PACKAGER_HOSTNAME`, `EXPO_PUBLIC_BACKEND_URL`, `MONGO_URL`),
`frontend/eas.json` (gestito da Emergent).

## Backlog / note
- Integrazioni a pagamento (Stripe, ElevenLabs) restano disattivate finché non richieste.
- Nessuna rigenerazione AI di contenuti/copertine/audio senza richiesta esplicita.

## Categorie 3D da riferimento — 25 settembre 2026
- Richiesta esplicita: rigenerare icone categorie fedeli all'allegato, incluse tessere
  dark arrotondate, font e luce inferiore accesa solo alla selezione. Conferma:
  «Si procedi, sii fedele all allegato». Con `all` tutte le luci sono accese.
- Pubblicata famiglia `reference-3d-v6`: 12 categorie reali + cristallo `all`.
  Beuta, Saturno, chip cyan, germoglio, zampa, busto classico, loto/Psicologia,
  testa con cervello/Corpo umano, libro, monete/Economia, tavolozza/Arte, montagna.
  Nessuna categoria aggiunta/rinominata; quelle dell'allegato non presenti ignorate.
- 13 WebP 480px (circa 334KB complessivi) salvati in Object Storage gestito;
  manifest `backend/category_art_manifest.json`. Vecchio manifest conservato in
  `backend/category_art/previous-glossy-3d-v5.json`; vecchi oggetti non cancellati.
  Sorgenti/crop/import report: `backend/category_art/reference-3d-v4/` (nome cartella
  di lavorazione; versione pubblicata v6). Script offline `import_reference_categories.py`.
  Nessuna AI a runtime, né modifiche a storie, copertine, audio, dati degli utenti.
- `CategoryGrid` condiviso da onboarding ed Explore: artwork grande, bordi SVG,
  Manrope Medium (approssimazione del font del riferimento, non identificabile con
  certezza dalla sola immagine), conteggi dinamici preservati, luce SVG/Animated 180ms.
  2 colonne su schermi piccoli, 3 standard, 4 tablet. `category-tile-effects.tsx`
  condiviso anche dalle tessere Home (qui la luce rappresenta il focus del mazzo).
- Palette dedicata in `src/theme.ts`, costante nei temi chiaro/scuro per rispettare
  il riferimento. `CategoryArtwork` ha variante `reference`; cache revision v6 anche
  per i badge. Logica/persistenza filtri invariata: all resta esclusivo.
- Self-test: 12 categorie API con versione v6; preview 390×844 IT/EN; caricamento
  icone, Scienza singola, 13 luci con Qualsiasi e passaggio Qualsiasi→Arte PASS.
  Lint file modificati PASS; nessun errore TypeScript nei file modificati.
- Verifica finale `test_reports/iteration_7.json`: backend 17/17 PASS (13 immagini,
  categorie e cutout badge); onboarding, salvataggio, selezioni, Home, intro storia,
  IT/EN 320/390/430, temi chiaro/scuro, assenza overflow/ID duplicati PASS.
  Test esclusivamente in preview browser; nessun dispositivo nativo disponibile.
  Driver animazione luci nativo iOS/Android, JS web per evitare warning di fallback.
- P0: nessun blocco nel perimetro richiesto.
- P1: validazione visiva dell'utente su dispositivo iOS/Android.
- P2: eventuali ritocchi delle singole icone solo su richiesta.
