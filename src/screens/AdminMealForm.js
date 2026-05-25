import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { COLORS } from '../theme';
import { usePlans } from '../context/PlansContext';
import { addMealToPlan } from '../services/mealsService';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AdminMealForm({ onBack }) {
  const { plans } = usePlans();
  const [selectedPlanId, setSelectedPlanId] = useState(plans?.[0]?.id || null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [mealName, setMealName] = useState('');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!mealName.trim()) {
      Alert.alert('Validation', 'Please enter a meal name.');
      return;
    }
    if (!selectedPlanId) {
      Alert.alert('Validation', 'No active plan found to add a meal to.');
      return;
    }

    setLoading(true);
    const { error } = await addMealToPlan(selectedPlanId, {
      day_of_week: selectedDay,
      meal_name: mealName.trim(),
      description: description.trim(),
      calories: parseInt(calories, 10) || 0,
      protein_g: parseInt(protein, 10) || 0,
      carbs_g: parseInt(carbs, 10) || 0,
      fats_g: parseInt(fats, 10) || 0,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    console.log('✅ [Meals] Meal added to plan successfully.');
    Alert.alert('Success', `"${mealName}" added to ${selectedDay}!`, [
      { text: 'Add Another', onPress: () => { setMealName(''); setDescription(''); setCalories(''); setProtein(''); setCarbs(''); setFats(''); } },
      { text: 'Done', onPress: onBack },
    ]);
  };

  const activePlan = plans?.find((p) => p.id === selectedPlanId);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <HeaderBar title="Add Meal" onBack={onBack} />

      <View style={styles.heroCard}>
        <Text style={styles.heroCategory}>{activePlan?.category?.toUpperCase() || 'PLAN'}</Text>
        <Text style={styles.heroTitle}>{activePlan?.name || 'Select a Plan'}</Text>
        <Text style={styles.heroSub}>Adding meal for: {selectedDay}</Text>
      </View>

      {plans && plans.length > 1 && (
        <>
          <Text style={styles.fieldLabel}>Plan</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {plans.map((plan) => (
              <Pressable
                key={plan.id}
                style={[styles.chip, selectedPlanId === plan.id && styles.chipActive]}
                onPress={() => setSelectedPlanId(plan.id)}
              >
                <Text style={[styles.chipText, selectedPlanId === plan.id && styles.chipTextActive]}>
                  {plan.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </>
      )}

      <Text style={styles.fieldLabel}>Day of Week</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {DAYS.map((day) => (
          <Pressable
            key={day}
            style={[styles.chip, selectedDay === day && styles.chipActive]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[styles.chipText, selectedDay === day && styles.chipTextActive]}>
              {day.slice(0, 3)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.fieldLabel}>Meal Name</Text>
      <TextInput
        style={styles.input}
        value={mealName}
        onChangeText={setMealName}
        placeholder="e.g., Grilled Chicken Salad"
        placeholderTextColor="#9aa298"
      />

      <Text style={styles.fieldLabel}>Description</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Briefly describe ingredients and benefits..."
        multiline
        numberOfLines={3}
        placeholderTextColor="#9aa298"
      />

      <View style={styles.macroRow}>
        <View style={styles.macroField}>
          <Text style={styles.fieldLabel}>Calories</Text>
          <TextInput style={styles.input} value={calories} onChangeText={setCalories} keyboardType="numeric" placeholder="0" placeholderTextColor="#9aa298" />
        </View>
        <View style={styles.macroField}>
          <Text style={styles.fieldLabel}>Protein (g)</Text>
          <TextInput style={styles.input} value={protein} onChangeText={setProtein} keyboardType="numeric" placeholder="0" placeholderTextColor="#9aa298" />
        </View>
      </View>

      <View style={styles.macroRow}>
        <View style={styles.macroField}>
          <Text style={styles.fieldLabel}>Carbs (g)</Text>
          <TextInput style={styles.input} value={carbs} onChangeText={setCarbs} keyboardType="numeric" placeholder="0" placeholderTextColor="#9aa298" />
        </View>
        <View style={styles.macroField}>
          <Text style={styles.fieldLabel}>Fats (g)</Text>
          <TextInput style={styles.input} value={fats} onChangeText={setFats} keyboardType="numeric" placeholder="0" placeholderTextColor="#9aa298" />
        </View>
      </View>

      <Pressable style={[styles.saveButton, loading && { opacity: 0.6 }]} onPress={handleSave} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.saveText}>Save Meal →</Text>
        }
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 120 },
  heroCard: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  heroCategory: { color: COLORS.accent, fontSize: 12, fontWeight: '700', marginBottom: 4 },
  heroTitle: { color: COLORS.brand, fontSize: 22, fontWeight: '900', marginBottom: 4 },
  heroSub: { color: COLORS.textSecondary, fontSize: 13 },
  fieldLabel: { color: COLORS.brand, fontWeight: '700', marginBottom: 8, marginTop: 12 },
  chipRow: { marginBottom: 4 },
  chip: { backgroundColor: COLORS.surface, borderRadius: 16, paddingVertical: 10, paddingHorizontal: 18, marginRight: 10, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  chipText: { color: COLORS.textSecondary, fontWeight: '700' },
  chipTextActive: { color: '#ffffff' },
  input: { backgroundColor: '#eef1e7', borderRadius: 16, padding: 16, color: COLORS.brand },
  textarea: { minHeight: 90, textAlignVertical: 'top' },
  macroRow: { flexDirection: 'row', gap: 12 },
  macroField: { flex: 1 },
  saveButton: { backgroundColor: COLORS.brand, paddingVertical: 16, borderRadius: 20, alignItems: 'center', marginTop: 20 },
  saveText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
