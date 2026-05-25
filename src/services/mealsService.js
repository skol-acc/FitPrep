import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * Adds a new meal to an existing weekly plan in the database.
 */
export async function addMealToPlan(planId, mealData) {
  if (!isSupabaseConfigured) {
    console.log('[Meals] Supabase not configured — mock meal saved.');
    return { data: { id: `MOCK-${Date.now()}`, plan_id: planId, ...mealData }, error: null };
  }

  const { data, error } = await supabase
    .from('weekly_plan_meals')
    .insert({ plan_id: planId, ...mealData })
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Error pushing meal:', error.message);
  } else {
    console.log(`[Supabase] Successfully pushed meal "${mealData.meal_name}" to Supabase`);
  }

  return { data, error };
}
