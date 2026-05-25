import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { COLORS } from '../theme';
import { usePlans } from '../context/PlansContext';

export default function HomeScreen({ user, onOpenWeeklyPlan, onOpenCheckout, onBack }) {
  const { plans, loading, error } = usePlans();

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <HeaderBar
        title="Fuel your performance."
        action={{ icon: '🔔', onPress: () => {} }}
        onBack={onBack}
      />

      <Text style={styles.greeting}>Hello, {user?.name || 'there'} 👋</Text>
      <Text style={styles.description}>Precision nutrition tailored for your fitness goals. Freshly prepared, chef-curated.</Text>

      {loading && <ActivityIndicator color={COLORS.accent} style={{ marginVertical: 20 }} />}
      {!!error && <Text style={styles.dataStatusError}>{error}</Text>}

      {!loading && plans.map((plan) => (
        <View key={plan.id} style={styles.planCard}>
          <View style={styles.planMedia}>
            <View style={styles.planMediaPlaceholder} />
          </View>
          <View style={styles.planBody}>
            <Text style={styles.planTitle}>{plan.name}</Text>
            <Text style={styles.planMeta}>{plan.category}</Text>
            <Text style={styles.planSubtitle}>{plan.description}</Text>
          </View>
          <View style={styles.planFooter}>
            <Text style={styles.planPrice}>${plan.weekly_price}/wk</Text>
            <Pressable style={styles.planAction} onPress={() => onOpenCheckout(plan)}>
              <Text style={styles.planActionText}>Preorder</Text>
            </Pressable>
          </View>
        </View>
      ))}

      {!loading && plans.length === 0 && !error && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No active plans this week yet. Check back soon!</Text>
        </View>
      )}

      <Pressable style={styles.ctaButton} onPress={onOpenWeeklyPlan}>
        <Text style={styles.ctaLabel}>View This Week's Meals</Text>
        <Text style={styles.ctaArrow}>→</Text>
      </Pressable>
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
  dataStatusCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  dataStatusText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  dataStatusError: {
    color: '#b00020',
    fontSize: 12,
    marginTop: 6,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.brand,
    marginBottom: 8,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#eef1e7',
  },
  planCardActive: {
    borderColor: COLORS.accent,
  },
  planMedia: {
    backgroundColor: '#f5f9ef',
    height: 160,
    borderRadius: 22,
    marginBottom: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  planMediaPlaceholder: {
    width: '90%',
    height: '90%',
    backgroundColor: '#dfe7d1',
    borderRadius: 18,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#dbf2a5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  selectedBadgeText: {
    color: COLORS.brand,
    fontWeight: '700',
    fontSize: 11,
  },
  planBody: {
    marginBottom: 18,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.brand,
    marginBottom: 4,
  },
  planMeta: {
    color: COLORS.accent,
    fontWeight: '700',
    marginBottom: 10,
  },
  planSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  planFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.brand,
  },
  planAction: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  planActionPrimary: {
    backgroundColor: COLORS.brand,
    borderColor: COLORS.brand,
  },
  planActionText: {
    color: COLORS.brand,
    fontWeight: '700',
  },
  planActionTextPrimary: {
    color: '#ffffff',
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
  statsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
  },
  statsHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.brand,
    marginBottom: 18,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  macroLabel: {
    color: COLORS.muted,
    fontWeight: '700',
  },
  macroValue: {
    color: COLORS.brand,
    fontWeight: '700',
  },
  macroTrack: {
    height: 8,
    backgroundColor: '#ebf3dc',
    borderRadius: 999,
    marginBottom: 14,
    overflow: 'hidden',
  },
  macroFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 999,
  },
  ctaButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.brand,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  ctaLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  ctaArrow: {
    color: '#ffffff',
    fontSize: 18,
  },
});
