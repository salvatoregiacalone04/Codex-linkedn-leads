export const pipelineStages = [
  { id: 'new', label: 'Nuovi lead', tone: 'neutral' },
  { id: 'connected', label: 'Connessi', tone: 'blue' },
  { id: 'messaged', label: 'Messaggiati', tone: 'green' },
  { id: 'follow_up', label: 'Follow-up', tone: 'amber' },
  { id: 'meeting', label: 'Meeting', tone: 'violet' }
];

export const leads = [
  {
    id: 'lead-001',
    name: 'Giulia Marino',
    role: 'Head of Sales',
    company: 'Northstar CRM',
    location: 'Milano',
    profileUrl: 'linkedin.com/in/giuliamarino',
    status: 'follow_up',
    fitScore: 91,
    source: 'Sales Navigator',
    owner: 'Massi',
    lastTouch: '2026-05-10',
    nextAction: 'Inviare caso studio SaaS',
    notes: 'Ha risposto positivamente al problema pipeline outbound.'
  },
  {
    id: 'lead-002',
    name: 'Lorenzo Costa',
    role: 'Founder',
    company: 'Hireloop',
    location: 'Torino',
    profileUrl: 'linkedin.com/in/lorenzocosta',
    status: 'connected',
    fitScore: 84,
    source: 'CSV import',
    owner: 'Massi',
    lastTouch: '2026-05-09',
    nextAction: 'Mandare primo messaggio',
    notes: 'Startup HR tech in fase di crescita.'
  },
  {
    id: 'lead-003',
    name: 'Sara Bianchi',
    role: 'Marketing Director',
    company: 'Atlas Cloud',
    location: 'Roma',
    profileUrl: 'linkedin.com/in/sarabianchi',
    status: 'messaged',
    fitScore: 76,
    source: 'Manuale',
    owner: 'Massi',
    lastTouch: '2026-05-08',
    nextAction: 'Aspettare risposta 48h',
    notes: 'Interesse su automazione nurturing.'
  },
  {
    id: 'lead-004',
    name: 'Marco Rinaldi',
    role: 'CEO',
    company: 'Finwise',
    location: 'Bologna',
    profileUrl: 'linkedin.com/in/marcorinaldi',
    status: 'meeting',
    fitScore: 95,
    source: 'Referral',
    owner: 'Massi',
    lastTouch: '2026-05-11',
    nextAction: 'Preparare agenda call',
    notes: 'Call fissata per discutere outbound B2B.'
  },
  {
    id: 'lead-005',
    name: 'Elena Ferri',
    role: 'Operations Manager',
    company: 'Logixware',
    location: 'Verona',
    profileUrl: 'linkedin.com/in/elenaferri',
    status: 'new',
    fitScore: 69,
    source: 'Sales Navigator',
    owner: 'Massi',
    lastTouch: '2026-05-07',
    nextAction: 'Validare ICP',
    notes: 'Azienda compatibile, ruolo da qualificare.'
  }
];

export const campaigns = [
  {
    id: 'camp-001',
    name: 'SaaS Sales Leaders IT',
    segment: 'Head of Sales, VP Sales',
    sent: 118,
    accepted: 46,
    replied: 19,
    meetings: 7,
    status: 'Attiva'
  },
  {
    id: 'camp-002',
    name: 'Founder HR Tech',
    segment: 'Founder, CEO',
    sent: 74,
    accepted: 31,
    replied: 11,
    meetings: 4,
    status: 'In test'
  },
  {
    id: 'camp-003',
    name: 'Marketing Automation',
    segment: 'Marketing Director',
    sent: 92,
    accepted: 29,
    replied: 8,
    meetings: 2,
    status: 'Pausa'
  }
];

export const tasks = [
  { id: 'task-001', title: 'Follow-up a Giulia Marino', due: 'Oggi', priority: 'Alta', type: 'Follow-up' },
  { id: 'task-002', title: 'Preparare agenda call Finwise', due: 'Domani', priority: 'Alta', type: 'Meeting' },
  { id: 'task-003', title: 'Rivedere template connessione', due: '16 Mag', priority: 'Media', type: 'Template' },
  { id: 'task-004', title: 'Importare 50 lead HR Tech', due: '17 Mag', priority: 'Bassa', type: 'Import' }
];

export const messages = [
  {
    id: 'msg-001',
    title: 'Connessione ICP SaaS',
    channel: 'Richiesta collegamento',
    conversion: 39,
    body: 'Ciao {{nome}}, ho visto il lavoro che state facendo in {{azienda}}. Mi occupo di pipeline outbound per team B2B e mi farebbe piacere connetterci.'
  },
  {
    id: 'msg-002',
    title: 'Primo messaggio valore',
    channel: 'Messaggio dopo accettazione',
    conversion: 21,
    body: 'Grazie per il collegamento. Sto mappando come team simili al vostro gestiscono prospecting e follow-up LinkedIn. Ha senso scambiarci due idee?'
  }
];
