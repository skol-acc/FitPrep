import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { fetchPublishedPlans } from '../services/plansService';
import { mockPublishedPlans, mockPlanMeals } from '../mock/mockData';

const PlansContext = createContext(null);

const initialState = {
  plans: [],
  meals: [],
  selectedPlan: null,
  loading: true,
  mealsLoading: false,
  error: '',
  source: 'mock',
};

function plansReducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: '' };
    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: false,
        plans: Array.isArray(action.plans) ? action.plans : [],
        source: action.source || 'mock',
      };
    case 'SELECT_PLAN':
      return { ...state, selectedPlan: action.plan, meals: [], mealsLoading: true };
    case 'LOAD_MEALS_SUCCESS':
      return { ...state, mealsLoading: false, meals: Array.isArray(action.meals) ? action.meals : [] };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.message || 'Failed to load plans' };
    default:
      return state;
  }
}

export function PlansProvider({ children }) {
  const [state, dispatch] = useReducer(plansReducer, initialState);

  const loadPlans = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    const { data, error, source } = await fetchPublishedPlans();

    if (error) {
      dispatch({ type: 'LOAD_ERROR', message: error.message });
      return;
    }

    dispatch({ type: 'LOAD_SUCCESS', plans: data, source });
    console.log(`[PlansContext] Loaded ${data?.length || 0} plans from: ${source}`);
  }, []);

  // Re-fetch plans whenever auth state changes (i.e. after login).
  // This prevents the race where loadPlans() fires before the user is
  // authenticated and RLS blocks the query, returning 0 rows.
  useEffect(() => {
    const { supabase, isSupabaseConfigured } = require('../lib/supabaseClient');

    if (!isSupabaseConfigured) {
      // No Supabase — load mock data immediately
      loadPlans();
      return;
    }

    // Fire once for any already-active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log('[PlansContext] Session found on mount — loading plans.');
        loadPlans();
      } else {
        // No session yet; mark loading done so UI doesn't spin forever
        dispatch({ type: 'LOAD_SUCCESS', plans: [], source: 'supabase' });
      }
    });

    // Re-fetch on every subsequent sign-in / sign-out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        console.log('[PlansContext] SIGNED_IN — reloading plans.');
        loadPlans();
      }
      if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOAD_SUCCESS', plans: [], source: 'supabase' });
      }
    });

    return () => subscription?.unsubscribe();
  }, [loadPlans]);

  const loadMealsForPlan = useCallback(async (plan) => {
    dispatch({ type: 'SELECT_PLAN', plan });
    const { data, error } = await fetchMealsForPlan(plan.id);
    if (error) {
      dispatch({ type: 'LOAD_ERROR', message: error.message });
      return;
    }
    dispatch({ type: 'LOAD_MEALS_SUCCESS', meals: data });
  }, []);

  const value = useMemo(() => ({
    ...state,
    loadPlans,
    loadMealsForPlan,
  }), [state, loadPlans, loadMealsForPlan]);

  return (
    <PlansContext.Provider value={value}>
      {children}
    </PlansContext.Provider>
  );
}

export function usePlans() {
  const context = useContext(PlansContext);
  if (!context) {
    throw new Error('usePlans must be used within PlansProvider');
  }
  return context;
}
