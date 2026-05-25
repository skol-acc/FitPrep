import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { mockPublishedPlans, mockPlanMeals } from '../mock/mockData';

export async function fetchPublishedPlans() {
  console.log('[Plans] isSupabaseConfigured:', isSupabaseConfigured);
  if (!isSupabaseConfigured) {
    console.log('[Plans] Supabase not configured — falling back to mock data.');
    return { data: mockPublishedPlans, error: null, source: 'mock' };
  }

  console.log('[Plans] Querying published_weekly_plans from Supabase...');
  const { data, error } = await supabase
    .from('published_weekly_plans')
    .select('*')
    .eq('is_published', true)
    .order('week_start_date', { ascending: false });

  if (error) {
    console.error('[Plans] Supabase error:', JSON.stringify(error));
  } else {
    console.log(`[Plans] Raw response — ${data?.length ?? 'null'} rows:`, JSON.stringify(data?.slice(0, 2)));
  }

  return { data: data || [], error, source: 'supabase' };
}

export async function fetchMealsForPlan(planId) {
  if (!isSupabaseConfigured) {
    const data = mockPlanMeals.filter((meal) => meal.plan_id === planId);
    return { data, error: null, source: 'mock' };
  }

  const { data, error } = await supabase
    .from('weekly_plan_meals')
    .select('*')
    .eq('plan_id', planId)
    .order('day_of_week', { ascending: true });

  if (error) {
    console.error('[Supabase] Error fetching meals:', error.message);
  } else {
    console.log(`[Supabase] Successfully fetched ${data?.length || 0} meals for plan: ${planId}`);
  }

  return { data: data || [], error, source: 'supabase' };
}
