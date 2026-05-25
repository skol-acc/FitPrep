import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { COLORS } from '../theme';
import { placeOrder } from '../services/ordersService';
import { supabase } from '../lib/supabaseClient';

const timeOptions = [
  { label: '6:00 AM', subtitle: 'Early Morning' },
  { label: '10:00 AM', subtitle: 'Standard Window' },
];

export default function CheckoutScreen({ plan, user, onBack, onConfirm }) {
  const [selectedTime, setSelectedTime] = useState('6:00 AM');
  const [paymentType, setPaymentType] = useState('online');
  const [loading, setLoading] = useState(false);
  const [proofAttached, setProofAttached] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      if (!userId || !plan?.id) {
        Alert.alert('Error', 'Could not place order. Please try again.');
        return;
      }
      const { error } = await placeOrder(userId, plan.id);
      if (error) {
        Alert.alert('Order Failed', error.message);
        return;
      }
      console.log('✅ [Orders] Order placed successfully for plan:', plan.name);
      onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <HeaderBar title="Checkout" onBack={onBack} action={{ icon: 'FitFood', onPress: () => {} }} />

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View style={styles.planBadge}><Text style={styles.planBadgeText}>Plan Selected</Text></View>
          <Text style={styles.summaryMeals}>14 Total Meals</Text>
        </View>
        <Text style={styles.summaryTitle}>{plan?.name || 'Selected Plan'}</Text>
        <View style={styles.recipeRow}>
          <View style={styles.recipeImage} />
          <View style={styles.recipeItems}>
            <Text style={styles.recipeText}>6x Lemon Herb Roasted Chicken</Text>
            <Text style={styles.recipeText}>4x Wild Caught Salmon & Asparagus</Text>
            <Text style={styles.recipeText}>4x Lean Beef & Sweet Potato Mash</Text>
          </View>
        </View>
        <View style={styles.planNote}>
          <Text style={styles.planNoteIcon}>i</Text>
          <Text style={styles.planNoteText}>Nutritional Focus: Low Carb / High Protein</Text>
          <Text style={styles.planEdit}>Edit Items</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Delivery Time</Text>
      <View style={styles.timeRow}>
        {timeOptions.map((option) => (
          <Pressable
            key={option.label}
            style={[styles.timeOption, selectedTime === option.label && styles.timeOptionActive]}
            onPress={() => setSelectedTime(option.label)}
          >
            <Text style={styles.timeIcon}>{option.label === '6:00 AM' ? '🌅' : '☀️'}</Text>
            <Text style={[styles.timeLabel, selectedTime === option.label && styles.timeLabelActive]}>{option.label}</Text>
            <Text style={styles.timeSubtitle}>{option.subtitle}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Payment</Text>
      <View style={styles.paymentRow}>
        <Pressable
          style={[styles.paymentOption, paymentType === 'cash' && styles.paymentOptionActive]}
          onPress={() => setPaymentType('cash')}
        >
          <Text style={[styles.paymentLabel, paymentType === 'cash' && styles.paymentLabelActive]}>Cash on Delivery</Text>
        </Pressable>
        <Pressable
          style={[styles.paymentOption, paymentType === 'online' && styles.paymentOptionActive]}
          onPress={() => setPaymentType('online')}
        >
          <Text style={[styles.paymentLabel, paymentType === 'online' && styles.paymentLabelActive]}>Online Payment</Text>
        </Pressable>
      </View>

      {paymentType === 'online' && (
        <View style={styles.onlineCard}>
          <View style={styles.qrPlaceholder}>
            <Text style={styles.qrLabel}>QR Code</Text>
          </View>
          <Pressable style={styles.attachButton} onPress={() => setProofAttached(true)}>
            <Text style={styles.attachText}>{proofAttached ? 'Proof Attached' : 'Attach Proof of Payment'}</Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.sectionTitle}>Shipping Address</Text>
      <View style={styles.addressCard}>
        <Text style={styles.addressTitle}>Home</Text>
        <Text style={styles.addressText}>482 Fitness Way, Apt 4B, Austin TX</Text>
      </View>

      <View style={styles.totalCard}>
        <View style={styles.totalRow}><Text style={styles.totalLabel}>Subtotal</Text><Text style={styles.totalValue}>${plan?.weekly_price?.toFixed(2) || '—'}</Text></View>
        <View style={styles.totalRow}><Text style={styles.totalLabel}>Delivery Fee</Text><Text style={[styles.totalValue, styles.freeLabel]}>FREE</Text></View>
        <View style={styles.divider} />
        <View style={styles.totalRow}><Text style={styles.totalTitle}>Total</Text><Text style={styles.totalTitle}>${plan?.weekly_price?.toFixed(2) || '—'}</Text></View>
      </View>

      <Pressable style={[styles.confirmButton, loading && { opacity: 0.6 }]} onPress={handleConfirm} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#ffffff" />
          : <Text style={styles.confirmLabel}>Confirm & Pay →</Text>
        }
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
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 20,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  planBadge: {
    backgroundColor: '#d6f18a',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  planBadgeText: {
    color: COLORS.brand,
    fontWeight: '700',
    fontSize: 11,
  },
  summaryMeals: {
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.brand,
    marginBottom: 18,
  },
  recipeRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  recipeImage: {
    width: 84,
    height: 84,
    backgroundColor: '#d6ebc1',
    borderRadius: 20,
    marginRight: 14,
  },
  recipeItems: {
    flex: 1,
    justifyContent: 'center',
  },
  recipeText: {
    color: COLORS.brand,
    fontSize: 13,
    marginBottom: 6,
  },
  planNote: {
    backgroundColor: '#f3f7e7',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  planNoteIcon: {
    width: 26,
    height: 26,
    borderRadius: 999,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#d6ebc1',
    marginRight: 10,
    color: COLORS.brand,
    fontWeight: '700',
  },
  planNoteText: {
    flex: 1,
    color: COLORS.textSecondary,
  },
  planEdit: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.brand,
    marginBottom: 14,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  timeOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    marginRight: 12,
  },
  timeOptionActive: {
    borderColor: COLORS.accent,
    backgroundColor: '#ecf7bf',
  },
  timeIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.brand,
    marginBottom: 4,
  },
  timeLabelActive: {
    color: COLORS.brand,
  },
  timeSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  paymentOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    marginRight: 12,
    alignItems: 'center',
  },
  paymentOptionActive: {
    borderColor: COLORS.accent,
    backgroundColor: '#ecf7bf',
  },
  paymentLabel: {
    color: COLORS.brand,
    fontWeight: '700',
    textAlign: 'center',
  },
  paymentLabelActive: {
    color: COLORS.brand,
  },
  onlineCard: {
    backgroundColor: '#f7f7f0',
    borderRadius: 24,
    padding: 18,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qrPlaceholder: {
    width: '100%',
    height: 140,
    borderRadius: 20,
    backgroundColor: '#e3e8d5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  qrLabel: {
    color: COLORS.brand,
    fontWeight: '800',
  },
  attachButton: {
    backgroundColor: COLORS.brand,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  attachText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  addressCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 22,
  },
  addressTitle: {
    color: COLORS.brand,
    fontWeight: '800',
    marginBottom: 8,
  },
  addressText: {
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  totalCard: {
    backgroundColor: '#f4f7ee',
    borderRadius: 26,
    padding: 20,
    marginBottom: 22,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  totalLabel: {
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  totalValue: {
    color: COLORS.brand,
    fontWeight: '700',
  },
  freeLabel: {
    color: COLORS.accent,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  totalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.brand,
  },
  confirmButton: {
    backgroundColor: COLORS.brand,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmLabel: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
});
