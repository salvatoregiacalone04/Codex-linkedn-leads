# LinkedIn Outreach Dashboard

Dashboard per gestire lead, campagne, task, template messaggi e pipeline di outreach LinkedIn.

## Stack

- React + Vite
- Supabase come backend
- Fallback mock quando `.env` non contiene le chiavi Supabase

## Avvio

```bash
npm install
npm run dev
```

Su Windows PowerShell, se `npm` e bloccato dalla policy script, usa:

```bash
npm.cmd install
npm.cmd run dev
```

## Backend Supabase

1. Crea un progetto Supabase.
2. Apri lo SQL editor ed esegui `supabase/schema.sql`.
3. Copia `.env.example` in `.env`.
4. Inserisci:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Lo schema crea tabelle, trigger `updated_at`, policy RLS per la dashboard locale e dati seed per partire subito. Quando le variabili Supabase sono presenti, la dashboard legge e salva su Supabase; altrimenti usa `src/data/mockData.js`.
