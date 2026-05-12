# LinkedIn Outreach Dashboard

Dashboard frontend per gestire lead, campagne, task, template messaggi e pipeline di outreach LinkedIn.

## Stack

- React + Vite
- Supabase client già predisposto
- Dati mock usati finché `.env` non contiene le chiavi Supabase

## Avvio

```bash
npm install
npm run dev
```

Su Windows PowerShell, se `npm` è bloccato dalla policy script, usa:

```bash
npm.cmd install
npm.cmd run dev
```

## Supabase

1. Crea un progetto Supabase.
2. Esegui `supabase/schema.sql` nello SQL editor.
3. Copia `.env.example` in `.env`.
4. Inserisci:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Quando queste variabili sono presenti, la dashboard prova a leggere dalle tabelle Supabase. In caso contrario usa i dati demo in `src/data/mockData.js`.
