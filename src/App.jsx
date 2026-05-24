import React, { useEffect, useMemo, useState } from 'react';
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
import { pipelineStages } from './data/mockData';
import {
  getDashboardData,
  updateAutomationSettings,
  updateIcpProfile,
  updateMessageTemplate
} from './services/outreachRepository';

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

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedTime, setSelectedTime] = useState(() => new Date(new Date().setHours(9, 0, 0, 0)));
  const [selectedBusinessDays, setSelectedBusinessDays] = useState(defaultBusinessDays);
  const [automationSettings, setAutomationSettings] = useState(null);
  const [automationSaveState, setAutomationSaveState] = useState('');
  const [icpProfile, setIcpProfile] = useState(null);
  const [icpSaveState, setIcpSaveState] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [loadState, setLoadState] = useState({ loading: true, error: '' });

  useEffect(() => {
    let isMounted = true;

    getDashboardData()
      .then((data) => {
        if (!isMounted) return;
        setDashboardData(data);
        if (data.automationSettings) {
          setAutomationSettings(data.automationSettings);
          setSelectedTime(getDateFromAutomationSettings(data.automationSettings));
          setSelectedBusinessDays(getValidBusinessDays(data.automationSettings.businessDays));
        }
        if (data.icpProfile) {
          setIcpProfile(data.icpProfile);
        }
        setLoadState({ loading: false, error: '' });
      })
      .catch((error) => {
        if (!isMounted) return;
        setLoadState({ loading: false, error: error.message });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const saveAutomationSettings = async (nextSettings) => {
    if (!nextSettings?.id) return;

    setAutomationSaveState('Salvataggio...');

    try {
      const savedSettings = await updateAutomationSettings(nextSettings.id, nextSettings);
      setAutomationSettings(savedSettings);
      setAutomationSaveState('Salvato');
    } catch (error) {
      setAutomationSaveState(`Errore salvataggio: ${error.message}`);
    }
  };

  const updateAutomationFromDate = (nextDate) => {
    setSelectedTime(nextDate);
    setAutomationSettings((currentSettings) => {
      const nextSettings = {
        ...getFallbackAutomationSettings(currentSettings, nextDate, selectedBusinessDays),
        startDate: getDateInputValue(nextDate),
        startTime: getTimeInputValue(nextDate)
      };

      void saveAutomationSettings(nextSettings);
      return nextSettings;
    });
  };

  const updateAutomationBusinessDays = (nextBusinessDays) => {
    setSelectedBusinessDays(nextBusinessDays);
    setAutomationSettings((currentSettings) => {
      const nextSettings = {
        ...getFallbackAutomationSettings(currentSettings, selectedTime, nextBusinessDays),
        businessDays: nextBusinessDays
      };

      void saveAutomationSettings(nextSettings);
      return nextSettings;
    });
  };

  const updateIcpField = (field, value) => {
    setIcpProfile((currentProfile) => ({
      ...getFallbackIcpProfile(currentProfile),
      [field]: value
    }));
  };

  const saveIcpProfile = async () => {
    const nextProfile = getFallbackIcpProfile(icpProfile);

    setIcpSaveState('Salvataggio...');

    try {
      const savedProfile = await updateIcpProfile(nextProfile.id, nextProfile);
      setIcpProfile(savedProfile);
      setIcpSaveState('ICP salvato');
    } catch (error) {
      setIcpSaveState(`Errore salvataggio: ${error.message}`);
    }
  };

  const saveLinkedInAccount = async (account) => {
    const nextSettings = {
      ...getFallbackAutomationSettings(automationSettings, selectedTime, selectedBusinessDays),
      linkedinProfileName: account.linkedinProfileName,
      linkedinProfileUrl: account.linkedinProfileUrl,
      linkedinConnectionStatus: account.linkedinConnectionStatus,
      linkedinConnectedAt: account.linkedinConnectedAt
    };

    const savedSettings = await updateAutomationSettings(nextSettings.id, nextSettings);
    setAutomationSettings(savedSettings);
    return savedSettings;
  };

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

      {loadState.error && <p className="data-status">Backend non disponibile: {loadState.error}</p>}
      {loadState.loading && <p className="data-status">Caricamento dati...</p>}

      <section className="content-area" aria-live="polite">
        {activeTab === 'home' && (
          <HomePanel
            date={selectedTime}
            setDate={updateAutomationFromDate}
            selectedBusinessDays={selectedBusinessDays}
            setSelectedBusinessDays={updateAutomationBusinessDays}
            saveState={automationSaveState}
            icpProfile={getFallbackIcpProfile(icpProfile)}
            setIcpField={updateIcpField}
            saveIcpProfile={saveIcpProfile}
            icpSaveState={icpSaveState}
          />
        )}
        {activeTab === 'search' && <SearchPanel />}
        {activeTab === 'pipeline' && <PipelinePanel leads={dashboardData?.leads || []} />}
        {activeTab === 'messages' && <MessagesPanel messages={dashboardData?.messages || []} />}
        {activeTab === 'settings' && (
          <SettingsPanel
            automationSettings={getFallbackAutomationSettings(automationSettings, selectedTime, selectedBusinessDays)}
            saveLinkedInAccount={saveLinkedInAccount}
          />
        )}
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

function getValidBusinessDays(selectedDays) {
  const validDayIds = businessDays.map((day) => day.id);
  const safeDays = selectedDays?.filter((day) => validDayIds.includes(day)) || [];
  return safeDays.length > 0 ? safeDays : defaultBusinessDays;
}

function getFallbackIcpProfile(profile) {
  return {
    id: profile?.id,
    name: profile?.name || 'Default ICP',
    targetRole: profile?.targetRole || '',
    industry: profile?.industry || '',
    companySize: profile?.companySize || '',
    location: profile?.location || '',
    seniority: profile?.seniority || '',
    keywords: profile?.keywords || '',
    excludedKeywords: profile?.excludedKeywords || '',
    qualityPriority: profile?.qualityPriority || ''
  };
}

function getFallbackAutomationSettings(settings, date, selectedDays) {
  return {
    id: settings?.id,
    startDate: getDateInputValue(date),
    startTime: getTimeInputValue(date),
    businessDays: selectedDays,
    linkedinProfileName: settings?.linkedinProfileName || '',
    linkedinProfileUrl: settings?.linkedinProfileUrl || '',
    linkedinConnectionStatus: settings?.linkedinConnectionStatus || 'disconnected',
    linkedinConnectedAt: settings?.linkedinConnectedAt || null,
    weeklyConnectionLimit: settings?.weeklyConnectionLimit || 250,
    enabled: settings?.enabled || false
  };
}

function getDateFromAutomationSettings(settings) {
  const [hours = '09', minutes = '00'] = (settings.startTime || '09:00').split(':');
  const date = settings.startDate ? new Date(`${settings.startDate}T00:00:00`) : new Date();

  date.setHours(parseInt(getValidHour(hours), 10), parseInt(getValidMinuteOrSecond(minutes), 10), 0, 0);
  return date;
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

function getTimeInputValue(date) {
  return `${getValidHour(String(date.getHours()))}:${getValidMinuteOrSecond(String(date.getMinutes()))}`;
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

function TimePickerPanel({ date, setDate, selectedBusinessDays, setSelectedBusinessDays, saveState }) {
  const hourRef = React.useRef(null);
  const minuteRef = React.useRef(null);
  const [isBusinessDaysOpen, setIsBusinessDaysOpen] = useState(false);

  const toggleBusinessDay = (dayId) => {
    const nextBusinessDays = selectedBusinessDays.includes(dayId)
      ? selectedBusinessDays.filter((currentDay) => currentDay !== dayId)
      : [...selectedBusinessDays, dayId];

    setSelectedBusinessDays(nextBusinessDays);
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
      {saveState && <p className="data-status">{saveState}</p>}
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

function HomePanel({
  date,
  setDate,
  selectedBusinessDays,
  setSelectedBusinessDays,
  saveState,
  icpProfile,
  setIcpField,
  saveIcpProfile,
  icpSaveState
}) {
  return (
    <div className="home-stack">
      <TimePickerPanel
        date={date}
        setDate={setDate}
        selectedBusinessDays={selectedBusinessDays}
        setSelectedBusinessDays={setSelectedBusinessDays}
        saveState={saveState}
      />

      <details className="icp-card">
      <summary className="icp-summary">
        <span>
          <strong>Definisci il tuo ICP</strong>
          <small>Apri il menu e compila il profilo cliente ideale</small>
        </span>
        <ChevronDown size={20} aria-hidden="true" />
      </summary>
      <form
        className="icp-form"
        onSubmit={(event) => {
          event.preventDefault();
          void saveIcpProfile();
        }}
      >
        <IcpField
          label="Ruolo target"
          hint="Target role / job title"
          placeholder="Founder, CEO, Marketing Manager..."
          value={icpProfile.targetRole}
          onChange={(value) => setIcpField('targetRole', value)}
        />
        <IcpField
          label="Settore"
          hint="Industry"
          placeholder="SaaS, Real Estate, Consulting..."
          value={icpProfile.industry}
          onChange={(value) => setIcpField('industry', value)}
        />
        <IcpSelect
          label="Dimensione azienda"
          hint="Company size"
          options={['1-10', '11-50', '51-200', '200+']}
          value={icpProfile.companySize}
          onChange={(value) => setIcpField('companySize', value)}
        />
        <IcpField
          label="Localita"
          hint="Location"
          placeholder="Italy, Europe, United States..."
          value={icpProfile.location}
          onChange={(value) => setIcpField('location', value)}
        />
        <IcpSelect
          label="Livello di seniority"
          hint="Seniority level"
          options={['Founder', 'C-Level', 'Manager', 'Specialist']}
          value={icpProfile.seniority}
          onChange={(value) => setIcpField('seniority', value)}
        />
        <IcpField
          label="Parole chiave"
          hint="Keywords"
          placeholder="B2B, growth, sales, automation..."
          value={icpProfile.keywords}
          onChange={(value) => setIcpField('keywords', value)}
        />
        <IcpField
          label="Parole chiave da escludere"
          hint="Excluded keywords"
          placeholder="student, intern, recruiter..."
          value={icpProfile.excludedKeywords}
          onChange={(value) => setIcpField('excludedKeywords', value)}
        />
        <IcpSelect
          label="Priorita qualita lead"
          hint="Lead quality priority"
          options={['Volume', 'Balanced', 'High quality only']}
          value={icpProfile.qualityPriority}
          onChange={(value) => setIcpField('qualityPriority', value)}
        />

        <button className="icp-submit" type="submit" aria-label="Salva ICP">
          <Save size={18} />
          <span>
            Salva ICP
            <small>Save ICP</small>
          </span>
        </button>
        {icpSaveState && <p className="data-status">{icpSaveState}</p>}
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

function IcpField({ label, hint, placeholder, type = 'text', multiline = false, value, onChange }) {
  return (
    <label className="icp-field">
      <span>{label}</span>
      <small>{hint}</small>
      {multiline ? (
        <textarea
          placeholder={placeholder}
          rows={4}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          min={type === 'number' ? '0' : undefined}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
        />
      )}
    </label>
  );
}

function IcpSelect({ label, hint, options, value, onChange }) {
  return (
    <label className="icp-field">
      <span>{label}</span>
      <small>{hint}</small>
      <select value={value ?? ''} onChange={(event) => onChange?.(event.target.value)}>
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

function PipelinePanel({ leads }) {
  const stageCounts = useMemo(() => (
    pipelineStages.map((stage) => ({
      ...stage,
      count: leads.filter((lead) => lead.status === stage.id).length
    }))
  ), [leads]);

  return (
    <article className="workspace-card pipeline-card">
      <PanelHeading title="Stato dei lead" icon={<SlidersHorizontal size={19} />} />
      <div className="stage-list">
        {stageCounts.map((stage) => (
          <div className="stage-row" key={stage.id}>
            <span>{stage.label}</span>
            <strong>{stage.count}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function MessagesPanel({ messages }) {
  const [localMessages, setLocalMessages] = useState(messages);
  const [saveState, setSaveState] = useState('');

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  const updateLocalMessage = (id, body) => {
    setLocalMessages((currentMessages) => (
      currentMessages.map((message) => (
        message.id === id ? { ...message, body } : message
      ))
    ));
  };

  const saveMessages = async () => {
    setSaveState('Salvataggio...');

    try {
      await Promise.all(localMessages.map((message) => updateMessageTemplate(message.id, message)));
      setSaveState('Messaggi salvati');
    } catch (error) {
      setSaveState(`Errore salvataggio: ${error.message}`);
    }
  };

  if (localMessages.length > 0) {
    return (
      <article className="workspace-card messages-card">
        <header className="messages-header">
          <div>
            <h2>Messaggi automation</h2>
            <p>Configura i testi che l'automazione usera nei tuoi outreach LinkedIn</p>
          </div>
          <span>
            <MessageSquareText size={18} />
          </span>
        </header>

        <div className="message-template-list">
          {localMessages.map((message) => (
            <MessageTemplateCard
              key={message.id}
              title={message.title}
              subtitle={message.channel}
              value={message.body}
              count={`${message.body.length} / 600`}
              onChange={(body) => updateLocalMessage(message.id, body)}
            />
          ))}
        </div>

        <button className="messages-save" type="button" aria-label="Salva messaggi" onClick={saveMessages}>
          <Save size={18} />
          Salva messaggi
        </button>
        {saveState && <p className="data-status">{saveState}</p>}
      </article>
    );
  }

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

function MessageTemplateCard({ title, subtitle, placeholder, value, count, onChange }) {
  return (
    <section className="message-template-card" aria-label={title}>
      <header>
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </header>
      <textarea
        placeholder={placeholder}
        value={value}
        rows={4}
        onChange={(event) => onChange?.(event.target.value)}
      />
      <div className="message-template-meta">
        <span>{count}</span>
        <small>Usa {'{{nome}}'} per personalizzare il messaggio</small>
      </div>
    </section>
  );
}

function SettingsPanel({ automationSettings, saveLinkedInAccount }) {
  const [linkedinAccount, setLinkedinAccount] = useState({
    linkedinProfileName: automationSettings.linkedinProfileName,
    linkedinProfileUrl: automationSettings.linkedinProfileUrl,
    linkedinConnectionStatus: automationSettings.linkedinConnectionStatus,
    linkedinConnectedAt: automationSettings.linkedinConnectedAt
  });
  const [linkedinSaveState, setLinkedinSaveState] = useState('');

  useEffect(() => {
    setLinkedinAccount({
      linkedinProfileName: automationSettings.linkedinProfileName,
      linkedinProfileUrl: automationSettings.linkedinProfileUrl,
      linkedinConnectionStatus: automationSettings.linkedinConnectionStatus,
      linkedinConnectedAt: automationSettings.linkedinConnectedAt
    });
  }, [automationSettings]);

  const updateLinkedInField = (field, value) => {
    setLinkedinAccount((currentAccount) => ({
      ...currentAccount,
      [field]: value
    }));
  };

  const connectLinkedIn = async () => {
    if (!linkedinAccount.linkedinProfileName.trim() || !linkedinAccount.linkedinProfileUrl.trim()) {
      setLinkedinSaveState('Inserisci nome profilo e URL LinkedIn.');
      return;
    }

    setLinkedinSaveState('Collegamento...');

    try {
      const savedSettings = await saveLinkedInAccount({
        ...linkedinAccount,
        linkedinConnectionStatus: 'connected',
        linkedinConnectedAt: new Date().toISOString()
      });
      setLinkedinAccount({
        linkedinProfileName: savedSettings.linkedinProfileName,
        linkedinProfileUrl: savedSettings.linkedinProfileUrl,
        linkedinConnectionStatus: savedSettings.linkedinConnectionStatus,
        linkedinConnectedAt: savedSettings.linkedinConnectedAt
      });
      setLinkedinSaveState('Account LinkedIn collegato');
    } catch (error) {
      setLinkedinSaveState(`Errore collegamento: ${error.message}`);
    }
  };

  const disconnectLinkedIn = async () => {
    setLinkedinSaveState('Disconnessione...');

    try {
      const savedSettings = await saveLinkedInAccount({
        ...linkedinAccount,
        linkedinConnectionStatus: 'disconnected',
        linkedinConnectedAt: null
      });
      setLinkedinAccount({
        linkedinProfileName: savedSettings.linkedinProfileName,
        linkedinProfileUrl: savedSettings.linkedinProfileUrl,
        linkedinConnectionStatus: savedSettings.linkedinConnectionStatus,
        linkedinConnectedAt: savedSettings.linkedinConnectedAt
      });
      setLinkedinSaveState('Account LinkedIn disconnesso');
    } catch (error) {
      setLinkedinSaveState(`Errore disconnessione: ${error.message}`);
    }
  };

  const isLinkedInConnected = linkedinAccount.linkedinConnectionStatus === 'connected';

  return (
    <article className="workspace-card settings-workspace">
      <details className="settings-card linkedin-account-card">
        <summary className="settings-card-summary">
          <div>
            <h3>Account LinkedIn</h3>
            <p>Gestisci il profilo LinkedIn usato per inviare richieste e follow-up.</p>
          </div>
          <ChevronDown size={20} aria-hidden="true" />
        </summary>

        <div className="linkedin-account-content">
          <div className="linkedin-account-status">
            <span>Stato account</span>
            <strong>{isLinkedInConnected ? 'Collegato' : 'Non collegato'}</strong>
          </div>

          <label className="linkedin-account-field">
            <span>Nome profilo LinkedIn</span>
            <input
              type="text"
              placeholder="Es. Toto Rossi"
              value={linkedinAccount.linkedinProfileName}
              onChange={(event) => updateLinkedInField('linkedinProfileName', event.target.value)}
            />
          </label>

          <label className="linkedin-account-field">
            <span>URL profilo LinkedIn</span>
            <input
              type="url"
              placeholder="https://www.linkedin.com/in/username"
              value={linkedinAccount.linkedinProfileUrl}
              onChange={(event) => updateLinkedInField('linkedinProfileUrl', event.target.value)}
            />
          </label>

          <div className="linkedin-account-actions">
            <button className="linkedin-connect" type="button" onClick={connectLinkedIn}>Collega LinkedIn</button>
            <button className="linkedin-disconnect" type="button" onClick={disconnectLinkedIn}>Disconnetti</button>
          </div>
          {linkedinSaveState && <p className="data-status">{linkedinSaveState}</p>}
        </div>
      </details>

      <details className="settings-card outreach-preferences-card">
        <summary className="settings-card-summary compact">
          <div>
            <h3>Preferenze outreach</h3>
            <p>Configura i limiti e il comportamento dell'automazione durante l'outreach.</p>
          </div>
          <ChevronDown size={20} aria-hidden="true" />
        </summary>

        <div className="settings-card-content">
          <label className="linkedin-account-field">
            <span>Richieste massime al giorno</span>
            <input type="number" inputMode="numeric" placeholder="Es. 30" />
          </label>

          <label className="linkedin-account-field">
            <span>Messaggi massimi al giorno</span>
            <input type="number" inputMode="numeric" placeholder="Es. 50" />
          </label>

          <label className="linkedin-account-field">
            <span>Ritardo medio tra le azioni</span>
            <select defaultValue="1-3 min">
              <option>30-60 sec</option>
              <option>1-3 min</option>
              <option>3-5 min</option>
              <option>5-10 min</option>
            </select>
          </label>

          <label className="linkedin-account-field">
            <span>Modalita automazione</span>
            <select defaultValue="Prudente">
              <option>Prudente</option>
              <option>Standard</option>
              <option>Spinta</option>
            </select>
            <small>
              La modalita prudente riduce il numero di azioni giornaliere per mantenere un comportamento piu naturale.
            </small>
          </label>

          <label className="settings-toggle-row">
            <span>Pausa automatica se un lead risponde</span>
            <input type="checkbox" defaultChecked />
          </label>
        </div>
      </details>

      <details className="settings-card icp-targeting-card">
        <summary className="settings-card-summary compact">
          <div>
            <h3>ICP e targeting</h3>
            <p>Configura le preferenze globali per filtrare i lead durante l'outreach.</p>
          </div>
          <ChevronDown size={20} aria-hidden="true" />
        </summary>

        <div className="settings-card-content">
          <label className="linkedin-account-field">
            <span>Settore target</span>
            <input type="text" placeholder="Es. SaaS, consulenza, e-commerce" />
          </label>

          <label className="linkedin-account-field">
            <span>Ruolo target</span>
            <input type="text" placeholder="Es. Founder, CEO, Marketing Manager" />
          </label>

          <label className="linkedin-account-field">
            <span>Area geografica</span>
            <input type="text" placeholder="Es. Italia, Europa, Stati Uniti" />
          </label>

          <label className="linkedin-account-field">
            <span>Dimensione azienda</span>
            <select defaultValue="Qualsiasi">
              <option>Qualsiasi</option>
              <option>1-10 dipendenti</option>
              <option>11-50 dipendenti</option>
              <option>51-200 dipendenti</option>
              <option>201+ dipendenti</option>
            </select>
          </label>

          <section className="settings-subsection" aria-label="Esclusioni">
            <h4>Esclusioni</h4>
            <label className="settings-toggle-row premium-toggle">
              <span>Escludi profili gia contattati</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="settings-toggle-row premium-toggle">
              <span>Escludi lead senza foto profilo</span>
              <input type="checkbox" />
            </label>
            <label className="settings-toggle-row premium-toggle">
              <span>Escludi profili senza descrizione chiara</span>
              <input type="checkbox" />
            </label>
          </section>
        </div>
      </details>

      <details className="settings-card message-personalization-card">
        <summary className="settings-card-summary compact">
          <div>
            <h3>Messaggi e personalizzazione</h3>
            <p>Configura lingua, tono e regole di personalizzazione dei messaggi.</p>
          </div>
          <ChevronDown size={20} aria-hidden="true" />
        </summary>

        <div className="settings-card-content">
          <label className="linkedin-account-field">
            <span>Lingua messaggi</span>
            <select defaultValue="Italiano">
              <option>Italiano</option>
              <option>Inglese</option>
            </select>
          </label>

          <label className="linkedin-account-field">
            <span>Tono messaggi</span>
            <select defaultValue="Professionale">
              <option>Professionale</option>
              <option>Amichevole</option>
              <option>Diretto</option>
            </select>
          </label>

          <label className="settings-toggle-row premium-toggle">
            <span>Usa nome del lead</span>
            <input type="checkbox" defaultChecked />
          </label>

          <label className="settings-toggle-row premium-toggle">
            <span>Usa azienda del lead</span>
            <input type="checkbox" defaultChecked />
          </label>

          <label className="settings-toggle-row premium-toggle">
            <span>Usa ruolo del lead</span>
            <input type="checkbox" />
          </label>

          <label className="linkedin-account-field">
            <span>Lunghezza messaggio</span>
            <select defaultValue="Normale">
              <option>Breve</option>
              <option>Normale</option>
              <option>Dettagliata</option>
            </select>
          </label>

          <p>Queste preferenze influenzano il modo in cui i messaggi vengono personalizzati.</p>
        </div>
      </details>

      <details className="settings-card notifications-card">
        <summary className="settings-card-summary compact">
          <div>
            <h3>Notifiche</h3>
            <p>Gestisci gli avvisi legati a connessioni, risposte e performance ACR.</p>
          </div>
          <ChevronDown size={20} aria-hidden="true" />
        </summary>

        <div className="settings-card-content">
          <label className="settings-toggle-row premium-toggle">
            <span>Notifica quando una connessione viene accettata</span>
            <input type="checkbox" defaultChecked />
          </label>

          <label className="settings-toggle-row premium-toggle">
            <span>Notifica quando un lead risponde</span>
            <input type="checkbox" defaultChecked />
          </label>

          <label className="settings-toggle-row premium-toggle">
            <span>Report settimanale ACR</span>
            <input type="checkbox" />
          </label>

          <div className="settings-notification-threshold">
            <label className="settings-toggle-row premium-toggle">
              <span>Avviso se ACR scende sotto una certa soglia</span>
              <input type="checkbox" />
            </label>
            <label className="linkedin-account-field">
              <span>Soglia ACR</span>
              <input type="number" inputMode="numeric" placeholder="Es. 20%" />
            </label>
          </div>

          <label className="settings-toggle-row premium-toggle">
            <span>Avviso se l'automazione è ferma</span>
            <input type="checkbox" />
          </label>

          <p>Le notifiche aiutano a monitorare l'andamento dell'automazione senza controllare manualmente la dashboard.</p>
        </div>
      </details>

      <details className="settings-card data-reset-card">
        <summary className="settings-card-summary compact">
          <div>
            <h3>Dati e reset</h3>
            <p>Gestisci esportazioni, cronologia e dati demo della dashboard.</p>
          </div>
          <ChevronDown size={20} aria-hidden="true" />
        </summary>

        <div className="settings-card-content">
          <div className="settings-action-row">
            <div>
              <strong>Esporta lead</strong>
              <p>Esporta lead in un file Excel/CSV</p>
            </div>
            <button className="settings-action-button primary" type="button">Esporta lead</button>
          </div>

          <div className="settings-action-row">
            <div>
              <strong>Esporta attivita</strong>
              <p>Scarica lo storico delle attivita dell'automazione.</p>
            </div>
            <button className="settings-action-button primary" type="button">Esporta attivita</button>
          </div>

          <div className="settings-action-row">
            <div>
              <strong>Cancella cronologia automazione</strong>
              <p>Rimuove lo storico delle azioni eseguite dall'automazione.</p>
            </div>
            <button className="settings-action-button danger-soft" type="button">Cancella cronologia</button>
          </div>

          <div className="settings-action-row warning">
            <div>
              <strong>Reset dati demo</strong>
              <p>Questa azione serve solo per ripristinare i dati dimostrativi della dashboard.</p>
            </div>
            <button className="settings-action-button danger" type="button">Reset dati demo</button>
          </div>
        </div>
      </details>

      <details className="settings-card appearance-card">
        <summary className="settings-card-summary compact">
          <div>
            <h3>Aspetto</h3>
            <p>Personalizza tema, animazioni e preferenze visive della dashboard.</p>
          </div>
          <ChevronDown size={20} aria-hidden="true" />
        </summary>

        <div className="settings-card-content">
          <label className="linkedin-account-field">
            <span>Tema dashboard</span>
            <select defaultValue="Scuro">
              <option>Scuro</option>
              <option>Chiaro</option>
            </select>
          </label>

          <label className="settings-toggle-row premium-toggle">
            <span>
              Layout compatto
              <small>Riduce spaziature e dimensioni delle sezioni.</small>
            </span>
            <input type="checkbox" defaultChecked />
          </label>

          <label className="settings-toggle-row premium-toggle">
            <span>
              Effetti animati
              <small>Attiva o disattiva glow, transizioni e micro-animazioni.</small>
            </span>
            <input type="checkbox" defaultChecked />
          </label>

          <label className="settings-toggle-row premium-toggle">
            <span>
              Riduci animazioni
              <small>Limita le animazioni per una navigazione piu semplice.</small>
            </span>
            <input type="checkbox" />
          </label>

          <label className="linkedin-account-field">
            <span>Lingua dashboard</span>
            <select defaultValue="Italiano">
              <option>Italiano</option>
              <option>Inglese</option>
            </select>
          </label>
        </div>
      </details>
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
