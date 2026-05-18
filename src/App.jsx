import React, { useState } from 'react';
import {
  Activity,
  Bell,
  BarChart3,
  Calendar,
  Check,
  ChevronDown,
  ClipboardList,
  Clock,
  Home,
  LayoutList,
  Menu,
  MessageSquareText,
  Play,
  Plus,
  Save,
  Settings,
  SlidersHorizontal,
} from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'search', label: 'Attività', icon: ClipboardList },
  { id: 'pipeline', label: 'Pipeline', icon: LayoutList },
  { id: 'messages', label: 'Msg', icon: MessageSquareText },
  { id: 'settings', label: 'Impostazioni', icon: Settings }
];

const stages = [
  'Da invitare',
  'Invito inviato',
  'Accettati',
  'Follow-up inviato',
  'In conversazione',
  'Opportunità'
];

const acrTrendData = [
  { week: 'S1', value: 18 },
  { week: 'S2', value: 24 },
  { week: 'S3', value: 21 },
  { week: 'S4', value: 32 }
];

const businessDays = [
  { id: 'monday', label: 'Monday', shortLabel: 'Mon' },
  { id: 'tuesday', label: 'Tuesday', shortLabel: 'Tue' },
  { id: 'wednesday', label: 'Wednesday', shortLabel: 'Wed' },
  { id: 'thursday', label: 'Thursday', shortLabel: 'Thu' },
  { id: 'friday', label: 'Friday', shortLabel: 'Fri' },
  { id: 'saturday', label: 'Saturday', shortLabel: 'Sat' },
  { id: 'sunday', label: 'Sunday', shortLabel: 'Sun' }
];

const defaultBusinessDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

const linkedinAccountFields = [
  { id: 'status', label: 'Stato account', detail: 'Non collegato / Collegato' },
  { id: 'profileName', label: 'Nome profilo LinkedIn', detail: 'Profilo usato dall automazione' },
  { id: 'profileUrl', label: 'URL profilo LinkedIn', detail: 'Link pubblico del profilo' },
  { id: 'connect', label: 'Collega LinkedIn', detail: 'Pulsante principale' },
  { id: 'disconnect', label: 'Disconnetti', detail: 'Pulsante secondario' }
];

const defaultLinkedinAccountFields = ['status', 'profileName', 'profileUrl'];

export function App() {
  const [activeTab, setActiveTab] = useState('home');
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

      <section className="content-area" aria-live="polite">
        {activeTab === 'home' && <HomePanel date={selectedTime} setDate={setSelectedTime} />}
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

function getDateInputValue(date) {
  const year = date.getFullYear();
  const month = getValidMinuteOrSecond(String(date.getMonth() + 1));
  const day = getValidMinuteOrSecond(String(date.getDate()));

  return `${year}-${month}-${day}`;
}

function setDateByCalendarValue(date, value) {
  if (!value) return date;

  const [year, month, day] = value.split('-').map(Number);
  const nextDate = new Date(date);
  nextDate.setFullYear(year, month - 1, day);
  return nextDate;
}

function getBusinessDaysSummary(selectedDays) {
  if (selectedDays.length === 0) return 'No days';
  if (selectedDays.length === businessDays.length) return 'Every day';
  if (defaultBusinessDays.every((day) => selectedDays.includes(day)) && selectedDays.length === 5) return 'Mon-Fri';

  return businessDays
    .filter((day) => selectedDays.includes(day.id))
    .map((day) => day.shortLabel)
    .join(', ');
}

function TimePickerPanel({ date, setDate }) {
  const hourRef = React.useRef(null);
  const minuteRef = React.useRef(null);
  const [selectedBusinessDays, setSelectedBusinessDays] = useState(defaultBusinessDays);
  const [isBusinessDaysOpen, setIsBusinessDaysOpen] = useState(false);

  const toggleBusinessDay = (dayId) => {
    setSelectedBusinessDays((currentDays) => (
      currentDays.includes(dayId)
        ? currentDays.filter((currentDay) => currentDay !== dayId)
        : [...currentDays, dayId]
    ));
  };

  return (
    <section className="time-picker-panel" aria-label="Selettore orario">
      <header className="automation-header">
        <div>
          <h2>LinkedIn Outreach</h2>
          <p>
            Status: <span>Ready</span>
          </p>
        </div>
        <div className="automation-icon-group" aria-hidden="true">
          <span className="time-picker-icon">
            <Calendar size={16} />
          </span>
          <span className="time-picker-icon">
            <Clock size={16} />
          </span>
        </div>
      </header>

      <label className="automation-date-row">
        <span className="automation-time-label">Start date</span>
        <span className="date-picker-control">
          <span className="date-picker-trigger">
            <span className="date-picker-value">{getDateInputValue(date)}</span>
            <input
              type="date"
              aria-label="Data di partenza automazione"
              value={getDateInputValue(date)}
              onChange={(event) => setDate(setDateByCalendarValue(date, event.target.value))}
            />
          </span>
        </span>
      </label>

      <div className="automation-time-row">
        <span className="automation-time-label">Start outreach at</span>
        <div className="time-picker-controls">
          <TimePickerInput
            label="Ore"
            picker="hours"
            date={date}
            setDate={setDate}
            ref={hourRef}
            onRightFocus={() => minuteRef.current?.focus()}
          />
          <span className="time-picker-divider" aria-hidden="true">
            :
          </span>
          <TimePickerInput
            label="Min"
            picker="minutes"
            date={date}
            setDate={setDate}
            ref={minuteRef}
            onLeftFocus={() => hourRef.current?.focus()}
          />
        </div>
      </div>

      <div className="business-days-field">
        <div className="automation-date-row business-days-row">
          <span className="automation-time-label">Business days</span>
          <span className="business-days-control">
            <button
              className="business-days-trigger"
              type="button"
              aria-expanded={isBusinessDaysOpen}
              aria-controls="business-days-menu"
              onClick={() => setIsBusinessDaysOpen((isOpen) => !isOpen)}
            >
              <span>{getBusinessDaysSummary(selectedBusinessDays)}</span>
            </button>
          </span>
        </div>

        {isBusinessDaysOpen && (
          <div className="business-days-menu" id="business-days-menu" role="listbox" aria-multiselectable="true">
            {businessDays.map((day) => {
              const isSelected = selectedBusinessDays.includes(day.id);

              return (
                <button
                  className={isSelected ? 'selected' : ''}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => toggleBusinessDay(day.id)}
                  key={day.id}
                >
                  <span>{day.label}</span>
                  {isSelected && <Check size={15} aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <button className="automation-start" type="button">
        <Play size={17} fill="currentColor" />
        Start automation
      </button>
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

function HomePanel({ date, setDate }) {
  return (
    <div className="home-stack">
      <TimePickerPanel date={date} setDate={setDate} />

      <details className="icp-card">
      <summary className="icp-summary">
        <span>
          <strong>Definisci il tuo ICP</strong>
          <small>Apri il menu e compila il profilo cliente ideale</small>
        </span>
        <ChevronDown size={20} aria-hidden="true" />
      </summary>
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
      </details>

    </div>
  );
}

function ManualActivityAccordion() {
  return (
    <details className="icp-card manual-activity-card">
      <summary className="icp-summary">
        <span>
          <strong>Attività manuale</strong>
          <small>Segnala cosa hai fatto fuori dall'automazione</small>
        </span>
        <ChevronDown size={20} aria-hidden="true" />
      </summary>
      <form className="icp-form" onSubmit={(event) => event.preventDefault()}>
        <IcpField
          label="Connessioni inviate manualmente oggi"
          hint="Manual connections sent today"
          placeholder="Es. 25"
          type="number"
        />
        <IcpField
          label="Connessioni inviate manualmente questa settimana"
          hint="Manual connections sent this week"
          placeholder="Es. 120"
          type="number"
        />
        <IcpField
          label="Note attività manuale"
          hint="Manual activity notes"
          placeholder="Es. Ho inviato connessioni a founder SaaS italiani"
          multiline
        />

        <button className="icp-submit" type="submit" aria-label="Aggiorna attività">
          <Activity size={18} />
          <span>
            Aggiorna attività
            <small>Update activity</small>
          </span>
        </button>
      </form>
    </details>
  );
}

function WeeklyPerformanceCard() {
  return (
    <article className="weekly-performance-card" aria-label="Performance settimanale">
      <header className="weekly-performance-header">
        <span>
          <BarChart3 size={18} />
        </span>
        <h2>Performance settimanale</h2>
      </header>
      <div className="acr-metric">
        <div>
          <span>ACR</span>
          <strong>0%</strong>
        </div>
        <p>Accepted Connection Rate</p>
      </div>
      <small>Percentuale di connessioni accettate questa settimana</small>
      {/* ACR = connessioni accettate / connessioni inviate × 100 */}
    </article>
  );
}

function AcrTrendChart() {
  const chartWidth = 320;
  const chartHeight = 126;
  const points = acrTrendData.map((item, index) => {
    const x = 24 + index * 88;
    const y = 104 - item.value * 2.35;
    return { ...item, x, y };
  });
  const linePoints = points.map((point) => `${point.x},${point.y}`).join(' ');
  const areaPoints = `${linePoints} ${points[points.length - 1].x},110 ${points[0].x},110`;
  const currentAcr = acrTrendData[acrTrendData.length - 1].value;

  return (
    <article className="acr-trend-card" aria-label="Andamento ACR settimanale">
      <header className="acr-trend-header">
        <div>
          <h2>Andamento ACR</h2>
          <p>Accepted Connection Rate settimanale</p>
        </div>
        <span>ACR attuale: {currentAcr}%</span>
      </header>

      <p className="acr-trend-copy">
        Mostra quante connessioni vengono accettate rispetto alle 250 richieste settimanali.
      </p>

      <div className="acr-chart-wrap">
        <svg className="acr-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Trend settimanale ACR da 18% a 32%">
          <defs>
            <linearGradient id="acrLineGradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="58%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="acrAreaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[20, 40].map((tick) => (
            <g className="acr-chart-grid" key={tick}>
              <line x1="22" x2="296" y1={104 - tick * 2.35} y2={104 - tick * 2.35} />
              <text x="0" y={108 - tick * 2.35}>{tick}%</text>
            </g>
          ))}
          <polygon className="acr-chart-area" points={areaPoints} />
          <polyline className="acr-chart-line" points={linePoints} />
          {points.map((point, index) => (
            <g className={index === points.length - 1 ? 'acr-chart-point current' : 'acr-chart-point'} key={point.week}>
              <circle cx={point.x} cy={point.y} r={index === points.length - 1 ? 5 : 4} />
              <text x={point.x} y="123">{point.week}</text>
              {index === points.length - 1 ? <text className="acr-chart-value" x={point.x - 8} y={point.y - 11}>{point.value}%</text> : null}
            </g>
          ))}
        </svg>
      </div>

      <div className="acr-trend-footer">
        <span>
          <strong>80</strong>
          Connessioni accettate
        </span>
        <span>
          <strong>250</strong>
          Richieste settimanali
        </span>
      </div>
      {/* ACR% = connessioni accettate / 250 × 100 */}
    </article>
  );
}

function IcpField({ label, hint, placeholder, type = 'text', multiline = false }) {
  return (
    <label className="icp-field">
      <span>{label}</span>
      <small>{hint}</small>
      {multiline ? (
        <textarea placeholder={placeholder} rows={4} />
      ) : (
        <input type={type} placeholder={placeholder} min={type === 'number' ? '0' : undefined} />
      )}
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
    <div className="home-stack">
      <ManualActivityAccordion />
      <WeeklyPerformanceCard />
      <AcrTrendChart />
    </div>
  );
}

function PipelinePanel() {
  return (
    <article className="workspace-card pipeline-card">
      <PanelHeading title="Stato dei lead" icon={<SlidersHorizontal size={19} />} />
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
    <article className="workspace-card messages-card">
      <header className="messages-header">
        <div>
          <h2>Messaggi automation</h2>
          <p>Configura i testi che l'automazione userà nei tuoi outreach LinkedIn</p>
        </div>
        <span>
          <MessageSquareText size={18} />
        </span>
      </header>

      <div className="message-template-list">
        <MessageTemplateCard
          title="Messaggio di connessione"
          subtitle="Connection request message"
          placeholder="Ciao {{nome}}, ho visto il tuo profilo e penso possa esserci una buona sinergia. Ti va di connetterci?"
          count="0 / 300"
        />
        <MessageTemplateCard
          title="Follow-up dopo accettazione"
          subtitle="Follow-up after acceptance"
          placeholder="Ciao {{nome}}, grazie per aver accettato la connessione. Ti scrivo perché..."
          count="0 / 600"
        />
      </div>

      <button className="messages-save" type="button" aria-label="Salva messaggi">
        <Save size={18} />
        Salva messaggi
      </button>
    </article>
  );
}

function MessageTemplateCard({ title, subtitle, placeholder, count }) {
  return (
    <section className="message-template-card" aria-label={title}>
      <header>
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </header>
      <textarea placeholder={placeholder} rows={5} />
      <div className="message-template-meta">
        <span>{count}</span>
        <small>Usa {'{{nome}}'} per personalizzare il messaggio</small>
      </div>
    </section>
  );
}

function SettingsPanel() {
  const [selectedAccountFields, setSelectedAccountFields] = useState(defaultLinkedinAccountFields);
  const [isAccountFieldsOpen, setIsAccountFieldsOpen] = useState(false);

  const toggleAccountField = (fieldId) => {
    setSelectedAccountFields((currentFields) => (
      currentFields.includes(fieldId)
        ? currentFields.filter((currentField) => currentField !== fieldId)
        : [...currentFields, fieldId]
    ));
  };

  const accountFieldsSummary = selectedAccountFields.length === 0
    ? 'Nessun campo'
    : `${selectedAccountFields.length} variabili selezionate`;

  return (
    <article className="workspace-card">
      <PanelHeading title="Impostazioni" />
      <section className="settings-card" aria-label="Account LinkedIn">
        <header>
          <div>
            <h3>Account LinkedIn</h3>
            <p>Gestisci il profilo LinkedIn usato per inviare richieste e follow-up.</p>
          </div>
        </header>

        <div className="settings-select-field">
          <span>Variabili account</span>
          <button
            className="settings-select-trigger"
            type="button"
            aria-expanded={isAccountFieldsOpen}
            aria-controls="linkedin-account-fields-menu"
            onClick={() => setIsAccountFieldsOpen((isOpen) => !isOpen)}
          >
            <span>{accountFieldsSummary}</span>
            <ChevronDown size={16} aria-hidden="true" />
          </button>
        </div>

        {isAccountFieldsOpen && (
          <div
            className="settings-select-menu"
            id="linkedin-account-fields-menu"
            role="listbox"
            aria-multiselectable="true"
          >
            {linkedinAccountFields.map((field) => {
              const isSelected = selectedAccountFields.includes(field.id);

              return (
                <button
                  className={isSelected ? 'selected' : ''}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => toggleAccountField(field.id)}
                  key={field.id}
                >
                  <span>
                    <strong>{field.label}</strong>
                    <small>{field.detail}</small>
                  </span>
                  {isSelected && <Check size={15} aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        )}
      </section>
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
