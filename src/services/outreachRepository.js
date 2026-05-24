import { automationSettings, campaigns, leads, messages, tasks } from '../data/mockData';
import { hasSupabaseConfig, supabase } from '../lib/supabaseClient';

export async function getDashboardData() {
  if (!hasSupabaseConfig) {
    return {
      source: 'mock',
      leads,
      campaigns,
      tasks,
      messages,
      automationSettings
    };
  }

  const [leadsResult, campaignsResult, tasksResult, messagesResult, automationSettingsResult] = await Promise.all([
    supabase.from('leads').select('*').order('last_touch', { ascending: false }),
    supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
    supabase.from('tasks').select('*').order('due_date', { ascending: true }),
    supabase.from('message_templates').select('*').order('created_at', { ascending: false }),
    supabase.from('automation_settings').select('*').order('created_at', { ascending: true }).limit(1).maybeSingle()
  ]);

  const error = leadsResult.error
    || campaignsResult.error
    || tasksResult.error
    || messagesResult.error
    || automationSettingsResult.error;

  if (error) {
    throw error;
  }

  return {
    source: 'supabase',
    leads: leadsResult.data.map(mapLead),
    campaigns: campaignsResult.data,
    tasks: tasksResult.data.map(mapTask),
    messages: messagesResult.data.map(mapMessage),
    automationSettings: automationSettingsResult.data
      ? mapAutomationSettings(automationSettingsResult.data)
      : automationSettings
  };
}

export async function updateMessageTemplate(id, message) {
  if (!hasSupabaseConfig) {
    return message;
  }

  const { data, error } = await supabase
    .from('message_templates')
    .update({
      title: message.title,
      channel: message.channel,
      conversion: message.conversion,
      body: message.body
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return mapMessage(data);
}

export async function createLead(lead) {
  assertSupabaseConfig();

  const { data, error } = await supabase
    .from('leads')
    .insert(toLeadRow(lead))
    .select()
    .single();

  if (error) throw error;
  return mapLead(data);
}

export async function updateLead(id, lead) {
  assertSupabaseConfig();

  const { data, error } = await supabase
    .from('leads')
    .update(toLeadRow(lead))
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapLead(data);
}

export async function deleteLead(id) {
  assertSupabaseConfig();

  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) throw error;
}

export async function createTask(task) {
  assertSupabaseConfig();

  const { data, error } = await supabase
    .from('tasks')
    .insert(toTaskRow(task))
    .select()
    .single();

  if (error) throw error;
  return mapTask(data);
}

export async function updateTask(id, task) {
  assertSupabaseConfig();

  const { data, error } = await supabase
    .from('tasks')
    .update(toTaskRow(task))
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapTask(data);
}

export async function deleteTask(id) {
  assertSupabaseConfig();

  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
}

export async function updateAutomationSettings(id, settings) {
  if (!hasSupabaseConfig) {
    return { ...settings, id };
  }

  const { data, error } = await supabase
    .from('automation_settings')
    .update({
      start_date: settings.startDate,
      start_time: settings.startTime,
      business_days: settings.businessDays,
      linkedin_profile_url: settings.linkedinProfileUrl,
      weekly_connection_limit: settings.weeklyConnectionLimit,
      enabled: settings.enabled
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapAutomationSettings(data);
}

function mapLead(lead) {
  return {
    id: lead.id,
    name: lead.name,
    role: lead.role,
    company: lead.company,
    location: lead.location,
    profileUrl: lead.profile_url,
    status: lead.status,
    fitScore: lead.fit_score,
    source: lead.source,
    owner: lead.owner,
    lastTouch: lead.last_touch,
    nextAction: lead.next_action,
    notes: lead.notes
  };
}

function mapTask(task) {
  return {
    id: task.id,
    title: task.title,
    due: task.due_label || task.due_date,
    priority: task.priority,
    type: task.type,
    completed: task.completed
  };
}

function mapMessage(message) {
  return {
    id: message.id,
    title: message.title,
    channel: message.channel,
    conversion: message.conversion,
    body: message.body
  };
}

function mapAutomationSettings(settings) {
  return {
    id: settings.id,
    startDate: settings.start_date,
    startTime: settings.start_time?.slice(0, 5) || '09:00',
    businessDays: settings.business_days || [],
    linkedinProfileUrl: settings.linkedin_profile_url || '',
    weeklyConnectionLimit: settings.weekly_connection_limit,
    enabled: settings.enabled
  };
}

function toLeadRow(lead) {
  return {
    name: lead.name,
    role: lead.role,
    company: lead.company,
    location: lead.location,
    profile_url: lead.profileUrl,
    status: lead.status,
    fit_score: lead.fitScore,
    source: lead.source,
    owner: lead.owner,
    last_touch: lead.lastTouch,
    next_action: lead.nextAction,
    notes: lead.notes
  };
}

function toTaskRow(task) {
  return {
    title: task.title,
    due_date: task.dueDate,
    due_label: task.due,
    priority: task.priority,
    type: task.type,
    completed: task.completed,
    lead_id: task.leadId
  };
}

function assertSupabaseConfig() {
  if (!hasSupabaseConfig) {
    throw new Error('Configura VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY per usare il backend Supabase.');
  }
}
