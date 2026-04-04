import { supabaseAdmin } from './supabaseAdmin';

export async function logBalanceEvent(eventName, payload) {
  try {
    await supabaseAdmin.from('analytics_events').insert({
      event_name: eventName,
      payload,
    });
  } catch (err) {
    console.error('BALANCE TELEMETRY ERROR:', err);
  }
}
