import React, { useState } from 'react';
import {
  Bell,
  Bookmark,
  CheckCircle2,
  Clock,
  Filter,
  Home,
  LayoutList,
  Menu,
  MessageSquareText,
  Plus,
  Save,
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
  const [selectedTime, setSelectedTime] = useState(() => new Date(new Date().setHours(9, 0, 0, 0)));

  return (
    <main className="mobile-shell" aria-label="Dashboard mobile LinkedIn leads">
      <header className="topbar">
        <button className="icon-button" type="button" aria-label="Apri menu">
          <Menu size={22} />
        </button>
        <div>
          <p className="eyebrow">LinkedIn leads</p>
          <h1>Dashboard di Totò</h1>
        </div>
        <button className="icon-button alert" type="button" aria-label="Notifiche">
          <Bell size={21} />
        </button>
      </header>

      <TimePickerPanel date={selectedTime} setDate={setSelectedTime} />

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

function isValidHour(value) {
  return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value);
}

function isValidMinuteOrSecond(value) {
  return /^[0-5][0-9]$/.test(value);
}

function getValidNumber(value, { max, min = 0, loop = false }) {
  let numericValue = parseInt(value, 10);

  if (!Number.isNaN(numericValue)) {
    if (!loop) {
      if (numericValue > max) numericValue = max;
      if (numericValue < min) numericValue = min;
    } else {
      if (numericValue > max) numericValue = min;
      if (numericValue < min) numericValue = max;
    }
    return numericValue.toString().padStart(2, '0');
  }

  return '00';
}

function getValidHour(value) {
  if (isValidHour(value)) return value;
  return getValidNumber(value, { max: 23 });
}

function getValidMinuteOrSecond(value) {
  if (isValidMinuteOrSecond(value)) return value;
  return getValidNumber(value, { max: 59 });
}

function getValidArrowNumber(value, { min, max, step }) {
  let numericValue = parseInt(value, 10);
  if (!Number.isNaN(numericValue)) {
    numericValue += step;
    return getValidNumber(String(numericValue), { min, max, loop: true });
  }
  return '00';
}

function getDateByType(date, type) {
  switch (type) {
    case 'minutes':
      return getValidMinuteOrSecond(String(date.getMinutes()));
    case 'seconds':
      return getValidMinuteOrSecond(String(date.getSeconds()));
    case 'hours':
      return getValidHour(String(date.getHours()));
    default:
      return '00';
  }
}

function getArrowByType(value, step, type) {
  switch (type) {
    case 'minutes':
    case 'seconds':
      return getValidArrowNumber(value, { min: 0, max: 59, step });
    case 'hours':
      return getValidArrowNumber(value, { min: 0, max: 23, step });
    default:
      return '00';
  }
}

function setDateByType(date, value, type) {
  const nextDate = new Date(date);

  switch (type) {
    case 'minutes':
      nextDate.setMinutes(parseInt(getValidMinuteOrSecond(value), 10));
      return nextDate;
    case 'seconds':
      nextDate.setSeconds(parseInt(getValidMinuteOrSecond(value), 10));
      return nextDate;
    case 'hours':
      nextDate.setHours(parseInt(getValidHour(value), 10));
      return nextDate;
    default:
      return nextDate;
  }
}

function TimePickerPanel({ date, setDate }) {
  const hourRef = React.useRef(null);
  const minuteRef = React.useRef(null);

  return (
    <section className="time-picker-panel" aria-label="Selettore orario">
      <div className="time-picker-copy">
        <span className="time-picker-icon">
          <Clock size={16} />
        </span>
        <h2>Start outreach at:</h2>
      </div>
      <div className="time-picker-controls">
        <TimePickerInput
          label="Ore"
          picker="hours"
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
        <TimePickerInput
          label="Min"
          picker="minutes"
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
        />
      </div>
    </section>
  );
}

const TimePickerInput = React.forwardRef(function TimePickerInput(
  { label, picker, date, setDate, onLeftFocus, onRightFocus },
  ref
) {
  const [flag, setFlag] = useState(false);
  const [prevIntKey, setPrevIntKey] = useState('0');
  const calculatedValue = getDateByType(date, picker);

  React.useEffect(() => {
    if (!flag) return undefined;

    const timer = window.setTimeout(() => {
      setFlag(false);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [flag]);

  const calculateNewValue = (key) => {
    if (picker === 'hours' && flag && calculatedValue.slice(1, 2) === '1' && prevIntKey === '0') {
      return `0${key}`;
    }

    return !flag ? `0${key}` : calculatedValue.slice(1, 2) + key;
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Tab') return;

    event.preventDefault();

    if (event.key === 'ArrowRight') onRightFocus?.();
    if (event.key === 'ArrowLeft') onLeftFocus?.();

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      const step = event.key === 'ArrowUp' ? 1 : -1;
      const newValue = getArrowByType(calculatedValue, step, picker);
      setFlag(false);
      setDate(setDateByType(date, newValue, picker));
    }

    if (event.key >= '0' && event.key <= '9') {
      setPrevIntKey(event.key);
      const newValue = calculateNewValue(event.key);
      if (flag) onRightFocus?.();
      setFlag((prev) => !prev);
      setDate(setDateByType(date, newValue, picker));
    }
  };

  return (
    <label className="time-picker-field">
      <span>{label}</span>
      <input
        ref={ref}
        type="tel"
        inputMode="decimal"
        aria-label={label}
        value={calculatedValue}
        onChange={(event) => event.preventDefault()}
        onKeyDown={handleKeyDown}
      />
    </label>
  );
});

function HomePanel() {
  return (
    <article className="workspace-card icp-card">
      <header className="icp-heading">
        <h2>Definisci il tuo ICP</h2>
        <p>Define your ICP</p>
      </header>

      <form className="icp-form" onSubmit={(event) => event.preventDefault()}>
        <IcpField
          label="Ruolo target"
          hint="Target role / job title"
          placeholder="Founder, CEO, Marketing Manager..."
        />
        <IcpField label="Settore" hint="Industry" placeholder="SaaS, Real Estate, Consulting..." />
        <IcpSelect label="Dimensione azienda" hint="Company size" options={['1-10', '11-50', '51-200', '200+']} />
        <IcpField label="Località" hint="Location" placeholder="Italy, Europe, United States..." />
        <IcpSelect
          label="Livello di seniority"
          hint="Seniority level"
          options={['Founder', 'C-Level', 'Manager', 'Specialist']}
        />
        <IcpField label="Parole chiave" hint="Keywords" placeholder="B2B, growth, sales, automation..." />
        <IcpField
          label="Parole chiave da escludere"
          hint="Excluded keywords"
          placeholder="student, intern, recruiter..."
        />
        <IcpSelect
          label="Priorità qualità lead"
          hint="Lead quality priority"
          options={['Volume', 'Balanced', 'High quality only']}
        />

        <button className="icp-submit" type="submit" aria-label="Salva ICP">
          <Save size={18} />
          <span>
            Salva ICP
            <small>Save ICP</small>
          </span>
        </button>
      </form>
    </article>
  );
}

function IcpField({ label, hint, placeholder }) {
  return (
    <label className="icp-field">
      <span>{label}</span>
      <small>{hint}</small>
      <input type="text" placeholder={placeholder} />
    </label>
  );
}

function IcpSelect({ label, hint, options }) {
  return (
    <label className="icp-field">
      <span>{label}</span>
      <small>{hint}</small>
      <select defaultValue="">
        <option value="" disabled>
          Seleziona
        </option>
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
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
