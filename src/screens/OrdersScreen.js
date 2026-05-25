import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { COLORS } from '../theme';
import { fetchMyOrders } from '../services/ordersService';

export default function OrdersScreen({ onOpenReview, onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await fetchMyOrders();
      if (!error) setOrders(data || []);
      setLoading(false);
    })();
  }, []);

  const formatDate = (isoStr) => {
    if (!isoStr) return '';
    return new Date(isoStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <HeaderBar title="My Orders" action={{ icon: '⚙️', onPress: () => {} }} onBack={onBack} />

      {loading && <ActivityIndicator color={COLORS.accent} style={{ marginVertical: 24 }} />}

      {!loading && orders.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No orders yet</Text>
          <Text style={styles.emptyStateText}>Browse the weekly plans and place your first preorder!</Text>
        </View>
      )}

      {!loading && orders.length > 0 && (
        <>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Orders</Text>
              <Text style={styles.summaryValue}>{orders.length}</Text>
            </View>
            <View style={[styles.summaryCard, styles.summaryActive]}>
              <Text style={styles.summaryLabel}>Active</Text>
              <Text style={styles.summaryValue}>{orders.filter((o) => o.status?.includes('Paid')).length}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Order History</Text>
          {orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderBadge} />
              <View style={styles.orderBody}>
                <Text style={styles.orderTitle}>{order.published_weekly_plans?.name || 'Plan'}</Text>
                <Text style={styles.orderDate}>Ordered {formatDate(order.created_at)}</Text>
                <Text style={styles.orderPrice}>${order.published_weekly_plans?.weekly_price?.toFixed(2) || '—'}</Text>
              </View>
              <View style={styles.orderActions}>
                <View style={styles.statusChip}>
                  <Text style={styles.statusText}>{order.status?.toUpperCase()}</Text>
                </View>
                <Pressable style={styles.reviewButton} onPress={() => onOpenReview(order)}>
                  <Text style={styles.reviewButtonText}>Review</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </>
      )}

      <View style={styles.ctaCard}>
        <Text style={styles.ctaHeading}>Ready for next week?</Text>
        <Text style={styles.ctaDescription}>New plans are published every Saturday. Check back to preorder!</Text>
      </View>
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 12,
  },
  summaryActive: {
    backgroundColor: '#ebf5c7',
    borderColor: '#d8ed9a',
  },
  summaryLabel: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 8,
  },
  summaryValue: {
    color: COLORS.brand,
    fontSize: 26,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.brand,
    marginBottom: 14,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orderBadge: {
    width: 56,
    height: 56,
    backgroundColor: '#dfeecc',
    borderRadius: 18,
    marginRight: 14,
  },
  orderBody: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.brand,
    marginBottom: 4,
  },
  orderDate: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 6,
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.brand,
  },
  statusChip: {
    backgroundColor: '#e9f7dd',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  statusText: {
    color: COLORS.accent,
    fontWeight: '700',
    fontSize: 11,
  },
  orderActions: {
    alignItems: 'flex-end',
  },
  orderButton: {
    backgroundColor: '#f4f7ef',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  orderButtonText: {
    color: COLORS.brand,
    fontWeight: '700',
  },
  reviewButton: {
    backgroundColor: '#d6f18a',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  reviewButtonText: {
    color: COLORS.brand,
    fontWeight: '800',
  },
  ctaCard: {
    backgroundColor: COLORS.brand,
    borderRadius: 26,
    padding: 24,
    marginTop: 8,
  },
  ctaHeading: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },
  ctaDescription: {
    color: '#dde8d3',
    fontSize: 14,
    marginBottom: 18,
    lineHeight: 20,
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 28,
    alignItems: 'center',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.brand,
    marginBottom: 8,
  },
  emptyStateText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
