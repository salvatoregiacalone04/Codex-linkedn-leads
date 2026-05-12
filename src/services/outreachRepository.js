import { campaigns, leads, messages, tasks } from '../data/mockData';
import { hasSupabaseConfig, supabase } from '../lib/supabaseClient';

export async function getDashboardData() {
  if (!hasSupabaseConfig) {
    return {
      source: 'mock',
      leads,
      campaigns,
      tasks,
      messages
    };
  }

  const [leadsResult, campaignsResult, tasksResult, messagesResult] = await Promise.all([
    supabase.from('leads').select('*').order('last_touch', { ascending: false }),
    supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
    supabase.from('tasks').select('*').order('due_date', { ascending: true }),
    supabase.from('message_templates').select('*').order('created_at', { ascending: false })
  ]);

  const error = leadsResult.error || campaignsResult.error || tasksResult.error || messagesResult.error;

  if (error) {
    throw error;
  }

  return {
    source: 'supabase',
    leads: leadsResult.data.map(mapLead),
    campaigns: campaignsResult.data,
    tasks: tasksResult.data.map(mapTask),
    messages: messagesResult.data.map(mapMessage)
  };
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
