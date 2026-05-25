import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { COLORS } from '../theme';
import { usePlans } from '../context/PlansContext';

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WeeklyPlanScreen({ onBack, onPreorder }) {
  const { plans, meals, mealsLoading, selectedPlan, loadMealsForPlan } = usePlans();
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Auto-load meals for the first plan on mount
  useEffect(() => {
    if (plans && plans.length > 0 && !selectedPlan) {
      loadMealsForPlan(plans[0]);
    }
  }, [plans]);

  const plan = selectedPlan || plans?.[0];
  const daysWithMeals = [...new Set(meals.map((m) => m.day_of_week))]
    .sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));
  const dayMeals = meals.filter((m) => m.day_of_week === selectedDay);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <HeaderBar
        title={plan ? `${plan.name} — ${plan.category}` : 'Weekly Plan'}
        onBack={onBack}
      />

      {mealsLoading && <ActivityIndicator color={COLORS.accent} style={{ marginVertical: 24 }} />}

      {!mealsLoading && daysWithMeals.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysRow}>
          {daysWithMeals.map((day) => (
            <Pressable
              key={day}
              style={[styles.dayButton, selectedDay === day && styles.dayButtonActive]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[styles.dayLabel, selectedDay === day && styles.dayLabelActive]}>
                {day.slice(0, 3).toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {!mealsLoading && dayMeals.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No meals scheduled for {selectedDay} yet.</Text>
        </View>
      )}

      {dayMeals.map((meal) => (
        <View key={meal.id} style={styles.mealCard}>
          <View style={styles.mealImagePlaceholder} />
          <View style={styles.mealContent}>
            <Text style={styles.mealType}>{meal.day_of_week?.toUpperCase()}</Text>
            <Text style={styles.mealTitle}>{meal.meal_name}</Text>
            <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionText}>PROTEIN {meal.protein_g}g</Text>
              <Text style={styles.nutritionText}>CARBS {meal.carbs_g}g</Text>
              <Text style={styles.nutritionText}>FAT {meal.fats_g}g</Text>
            </View>
            <View style={styles.nutritionTrack}>
              <View style={[styles.nutritionFill, { width: `${Math.min(100, ((meal.protein_g || 0) / 50) * 100)}%` }]} />
            </View>
          </View>
        </View>
      ))}

      {plan && (
        <Pressable style={styles.preorderButton} onPress={() => onPreorder(plan)}>
          <Text style={styles.preorderLabel}>Preorder This Plan →</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  daysRow: {
    marginBottom: 22,
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 18,
  },
  emptyStateText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
  },
  sectionNavButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  sectionNavButtonActive: {
    backgroundColor: COLORS.brand,
  },
  sectionNavLabel: {
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  sectionNavLabelActive: {
    color: '#ffffff',
  },
  dayButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginRight: 12,
  },
  dayButtonActive: {
    backgroundColor: COLORS.brand,
  },
  dayLabel: {
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  dayLabelActive: {
    color: '#ffffff',
  },
  mealCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 26,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mealImagePlaceholder: {
    height: 140,
    backgroundColor: '#cde0c0',
  },
  mealContent: {
    padding: 18,
  },
  mealType: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.brand,
    marginBottom: 8,
  },
  mealCalories: {
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  nutritionText: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: '700',
  },
  nutritionTrack: {
    height: 8,
    backgroundColor: '#e8f2d6',
    borderRadius: 999,
    overflow: 'hidden',
  },
  nutritionFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
  },
  preorderButton: {
    backgroundColor: COLORS.brand,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  preorderLabel: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
});
