import React, { useState } from 'react';
import {
  Bell,
  Bookmark,
  CheckCircle2,
  Filter,
  Home,
  LayoutList,
  Menu,
  MessageSquareText,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  TrendingUp,
  Users
} from 'lucide-react';

const metrics = [
  { label: 'Nuovi lead', value: '0', icon: Users, tone: 'blue' },
  { label: 'Qualificati', value: '0', icon: CheckCircle2, tone: 'green' },
  { label: 'Follow-up', value: '0', icon: MessageSquareText, tone: 'amber' },
  { label: 'Conversione', value: '0%', icon: TrendingUp, tone: 'red' }
];

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'search', label: 'Cerca', icon: Search },
  { id: 'pipeline', label: 'Pipeline', icon: LayoutList },
  { id: 'messages', label: 'Msg', icon: MessageSquareText },
  { id: 'settings', label: 'Altro', icon: Settings }
];

const stages = ['Da contattare', 'In conversazione', 'Opportunita'];

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [period, setPeriod] = useState('Oggi');

  return (
    <main className="mobile-shell" aria-label="Dashboard mobile LinkedIn leads">
      <header className="topbar">
        <button className="icon-button" type="button" aria-label="Apri menu">
          <Menu size={22} />
        </button>
        <div>
          <p className="eyebrow">LinkedIn leads</p>
          <h1>Dashboard di totò</h1>
        </div>
        <button className="icon-button alert" type="button" aria-label="Notifiche">
          <Bell size={21} />
        </button>
      </header>

      <section className="summary-panel" aria-label="Riepilogo pipeline">
        <div>
          <p>Pipeline attiva</p>
          <strong>0 lead</strong>
        </div>
        <button className="primary-action" type="button">
          <Plus size={18} />
          Nuova lista
        </button>
      </section>

      <section className="metric-grid" aria-label="Metriche principali">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <span className={`metric-icon ${metric.tone}`}>
              <metric.icon size={20} />
            </span>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="toolbar" aria-label="Controlli dashboard">
        <div className="segmented" role="tablist" aria-label="Periodo">
          {['Oggi', '7g', '30g'].map((item) => (
            <button
              className={period === item ? 'active' : ''}
              type="button"
              aria-selected={period === item}
              onClick={() => setPeriod(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
        <button className="icon-button compact" type="button" aria-label="Filtri">
          <Filter size={19} />
        </button>
      </section>

      <section className="content-area" aria-live="polite">
        {activeTab === 'home' && <HomePanel />}
        {activeTab === 'search' && <SearchPanel />}
        {activeTab === 'pipeline' && <PipelinePanel />}
        {activeTab === 'messages' && <MessagesPanel />}
        {activeTab === 'settings' && <SettingsPanel />}
      </section>

      <nav className="bottom-nav" aria-label="Navigazione principale">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab.id ? 'active' : ''}
            type="button"
            aria-label={tab.label}
            onClick={() => setActiveTab(tab.id)}
            key={tab.id}
          >
            <tab.icon size={21} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}

function HomePanel() {
  return (
    <article className="workspace-card">
      <PanelHeading title="Attivita" action="Vedi tutto" />
      <div className="empty-state">
        <div className="empty-visual">
          <LayoutList size={42} />
        </div>
        <h2>Nessun dato inserito</h2>
        <p>La dashboard e pronta per ricevere liste, metriche e attivita quando definirai i contenuti.</p>
      </div>
    </article>
  );
}

function SearchPanel() {
  return (
    <article className="workspace-card">
      <PanelHeading title="Ricerca" icon={<Bookmark size={19} />} />
      <label className="search-field">
        <Search size={19} />
        <input type="search" placeholder="Cerca lead o aziende" aria-label="Cerca lead o aziende" />
      </label>
      <div className="empty-list">Nessun criterio configurato.</div>
    </article>
  );
}

function PipelinePanel() {
  return (
    <article className="workspace-card">
      <PanelHeading title="Pipeline" icon={<SlidersHorizontal size={19} />} />
      <div className="stage-list">
        {stages.map((stage) => (
          <div className="stage-row" key={stage}>
            <span>{stage}</span>
            <strong>0</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function MessagesPanel() {
  return (
    <article className="workspace-card">
      <PanelHeading title="Messaggi" icon={<Plus size={19} />} />
      <div className="empty-list">Nessuna sequenza creata.</div>
    </article>
  );
}

function SettingsPanel() {
  return (
    <article className="workspace-card">
      <PanelHeading title="Impostazioni" />
      <label className="toggle-row">
        <span>Modalita revisione manuale</span>
        <input type="checkbox" defaultChecked />
      </label>
      <label className="toggle-row">
        <span>Notifiche follow-up</span>
        <input type="checkbox" />
      </label>
    </article>
  );
}

function PanelHeading({ title, action, icon }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {action ? <button type="button">{action}</button> : null}
      {icon ? (
        <button className="icon-button compact" type="button" aria-label={title}>
          {icon}
        </button>
      ) : null}
    </div>
  );
}
