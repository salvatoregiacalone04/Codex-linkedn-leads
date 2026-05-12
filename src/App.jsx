import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CalendarClock,
  ChevronDown,
  Database,
  Filter,
  LayoutDashboard,
  Linkedin,
  MessageSquareText,
  Plus,
  Search,
  Send,
  Settings,
  Target,
  Users
} from 'lucide-react';
import { pipelineStages } from './data/mockData';
import { getDashboardData } from './services/outreachRepository';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Lead', icon: Users },
  { label: 'Campagne', icon: Target },
  { label: 'Messaggi', icon: MessageSquareText },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Impostazioni', icon: Settings }
];

const statusLabels = {
  new: 'Nuovo',
  connected: 'Connesso',
  messaged: 'Messaggiato',
  follow_up: 'Follow-up',
  meeting: 'Meeting'
};

export function App() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  const filteredLeads = useMemo(() => {
    if (!data) return [];

    return data.leads.filter((lead) => {
      const haystack = `${lead.name} ${lead.role} ${lead.company} ${lead.location}`.toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;

      return matchesQuery && matchesStatus;
    });
  }, [data, query, selectedStatus]);

  const metrics = useMemo(() => {
    if (!data) return [];

    const totalSent = data.campaigns.reduce((sum, campaign) => sum + campaign.sent, 0);
    const totalAccepted = data.campaigns.reduce((sum, campaign) => sum + campaign.accepted, 0);
    const totalReplies = data.campaigns.reduce((sum, campaign) => sum + campaign.replied, 0);
    const totalMeetings = data.campaigns.reduce((sum, campaign) => sum + campaign.meetings, 0);
    const acceptanceRate = Math.round((totalAccepted / totalSent) * 100);
    const replyRate = Math.round((totalReplies / totalAccepted) * 100);

    return [
      { label: 'Lead attivi', value: data.leads.length, delta: '+12 questa settimana', icon: Users },
      { label: 'Accettazione', value: `${acceptanceRate}%`, delta: `${totalAccepted}/${totalSent} inviti`, icon: Linkedin },
      { label: 'Risposte', value: `${replyRate}%`, delta: `${totalReplies} conversazioni`, icon: MessageSquareText },
      { label: 'Meeting', value: totalMeetings, delta: 'Pipeline qualificata', icon: CalendarClock }
    ];
  }, [data]);

  if (error) {
    return <Shell><div className="empty-state">Errore caricamento dati: {error}</div></Shell>;
  }

  if (!data) {
    return <Shell><div className="empty-state">Caricamento dashboard...</div></Shell>;
  }

  return (
    <Shell>
      <header className="topbar">
        <div>
          <p className="eyebrow">LinkedIn outreach</p>
          <h1>Pipeline commerciale</h1>
        </div>
        <div className="topbar-actions">
          <span className="data-source"><Database size={16} /> {data.source === 'mock' ? 'Dati demo' : 'Supabase'}</span>
          <button className="secondary-button"><Filter size={17} /> Segmenti</button>
          <button className="primary-button"><Plus size={18} /> Nuovo lead</button>
        </div>
      </header>

      <section className="metrics-grid">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <div className="metric-icon"><metric.icon size={19} /></div>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <span>{metric.delta}</span>
          </article>
        ))}
      </section>

      <section className="workspace-grid">
        <div className="main-column">
          <section className="panel pipeline-panel">
            <PanelHeader title="Pipeline" action="Vista Kanban" />
            <div className="pipeline-grid">
              {pipelineStages.map((stage) => {
                const stageLeads = data.leads.filter((lead) => lead.status === stage.id);
                return (
                  <div className="stage" key={stage.id}>
                    <div className="stage-header">
                      <span className={`status-dot ${stage.tone}`} />
                      <strong>{stage.label}</strong>
                      <small>{stageLeads.length}</small>
                    </div>
                    {stageLeads.map((lead) => (
                      <article className="lead-mini-card" key={lead.id}>
                        <div>
                          <strong>{lead.name}</strong>
                          <span>{lead.role}</span>
                        </div>
                        <small>{lead.fitScore}</small>
                      </article>
                    ))}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="panel">
            <div className="table-toolbar">
              <PanelHeader title="Lead qualificati" action={`${filteredLeads.length} risultati`} />
              <div className="toolbar-controls">
                <label className="search-box">
                  <Search size={17} />
                  <input
                    type="search"
                    placeholder="Cerca per nome, azienda, ruolo"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </label>
                <label className="select-box">
                  <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
                    <option value="all">Tutti gli stati</option>
                    {pipelineStages.map((stage) => (
                      <option value={stage.id} key={stage.id}>{stage.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} />
                </label>
              </div>
            </div>

            <div className="lead-table">
              <div className="lead-row lead-head">
                <span>Lead</span>
                <span>Azienda</span>
                <span>Stato</span>
                <span>Score</span>
                <span>Prossima azione</span>
              </div>
              {filteredLeads.map((lead) => (
                <div className="lead-row" key={lead.id}>
                  <div className="person-cell">
                    <span className="avatar">{initials(lead.name)}</span>
                    <div>
                      <strong>{lead.name}</strong>
                      <small>{lead.role}</small>
                    </div>
                  </div>
                  <div>
                    <strong>{lead.company}</strong>
                    <small>{lead.location}</small>
                  </div>
                  <span className={`badge ${lead.status}`}>{statusLabels[lead.status]}</span>
                  <span className="score">{lead.fitScore}</span>
                  <span className="next-action">{lead.nextAction}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="side-column">
          <section className="panel">
            <PanelHeader title="Task prioritari" action="Oggi" />
            <div className="task-list">
              {data.tasks.map((task) => (
                <article className="task-item" key={task.id}>
                  <span className={`priority ${task.priority.toLowerCase()}`} />
                  <div>
                    <strong>{task.title}</strong>
                    <small>{task.type} · {task.due}</small>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <PanelHeader title="Campagne" action="3 attive" />
            <div className="campaign-list">
              {data.campaigns.map((campaign) => (
                <article className="campaign-card" key={campaign.id}>
                  <div>
                    <strong>{campaign.name}</strong>
                    <small>{campaign.segment}</small>
                  </div>
                  <div className="campaign-stats">
                    <span>{campaign.accepted} acc.</span>
                    <span>{campaign.replied} risp.</span>
                    <span>{campaign.meetings} call</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="panel message-panel">
            <PanelHeader title="Template migliori" action="Conversione" />
            {data.messages.map((message) => (
              <article className="message-template" key={message.id}>
                <div>
                  <strong>{message.title}</strong>
                  <small>{message.channel}</small>
                </div>
                <span>{message.conversion}%</span>
                <p>{message.body}</p>
                <button className="icon-button" aria-label={`Usa ${message.title}`} title={`Usa ${message.title}`}>
                  <Send size={16} />
                </button>
              </article>
            ))}
          </section>
        </aside>
      </section>
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Linkedin size={22} /></div>
          <div>
            <strong>LeadFlow</strong>
            <span>Outreach CRM</span>
          </div>
        </div>
        <nav>
          {navItems.map((item) => (
            <button className={item.active ? 'nav-item active' : 'nav-item'} key={item.label}>
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}

function PanelHeader({ title, action }) {
  return (
    <div className="panel-header">
      <h2>{title}</h2>
      <span>{action}</span>
    </div>
  );
}

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
