import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useBudget } from '../context/BudgetContext';

export const PersonalizedAlert = () => {
  const { activeAlert, dismissAlert } = useBudget();

  if (!activeAlert) return null;

  const getAlertConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: 'checkmark-circle',
          iconColor: COLORS.success,
          bgColor: '#ECFDF5',
          borderColor: '#A7F3D0',
          textColor: '#065F46',
        };
      case 'warning':
        return {
          icon: 'alert-circle',
          iconColor: COLORS.warning,
          bgColor: '#FFFBEB',
          borderColor: '#FDE68A',
          textColor: '#92400E',
        };
      case 'danger':
        return {
          icon: 'close-circle',
          iconColor: COLORS.danger,
          bgColor: '#FEF2F2',
          borderColor: '#FECACA',
          textColor: '#991B1B',
        };
      case 'info':
      default:
        return {
          icon: 'information-circle',
          iconColor: COLORS.primary,
          bgColor: '#EEF2FF',
          borderColor: '#C7D2FE',
          textColor: '#3730A3',
        };
    }
  };

  const config = getAlertConfig(activeAlert.type);

  return (
    <View style={[styles.container, SHADOWS.md]}>
      <View
        style={[
          styles.alertBox,
          { backgroundColor: config.bgColor, borderColor: config.borderColor },
        ]}
      >
        <View style={styles.iconWrapper}>
          <Ionicons name={config.icon} size={24} color={config.iconColor} />
        </View>

        <View style={styles.contentWrapper}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: config.textColor }]}>
              {activeAlert.title}
            </Text>
            <Text style={styles.timestamp}>{activeAlert.timestamp}</Text>
          </View>
          <Text style={[styles.message, { color: config.textColor }]}>
            {activeAlert.message}
          </Text>
        </View>

        <TouchableOpacity
          onPress={dismissAlert}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={18} color={config.textColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: SPACING.base,
    right: SPACING.base,
    zIndex: 9999,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  iconWrapper: {
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  contentWrapper: {
    flex: 1,
    marginRight: SPACING.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  closeButton: {
    padding: 2,
    marginLeft: 4,
  },
});
