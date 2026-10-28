import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

// Screens
import { HomeScreen } from '../screens/app/HomeScreen';
import { AnalysisScreen } from '../screens/app/AnalysisScreen';
import { TransactionScreen } from '../screens/app/TransactionScreen';
import { CategoriesScreen } from '../screens/app/CategoriesScreen';
import { ProfileScreen } from '../screens/app/ProfileScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const { isAdmin } = useAuth();
  const activeColor = isAdmin ? '#DC2626' : COLORS.primary;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AnalysisTab') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          } else if (route.name === 'TransactionsTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'CategoriesTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = isAdmin
              ? (focused ? 'shield-checkmark' : 'shield-checkmark-outline')
              : (focused ? 'person-circle' : 'person-circle-outline');
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="AnalysisTab"
        component={AnalysisScreen}
        options={{ tabBarLabel: 'Analysis' }}
      />
      <Tab.Screen
        name="TransactionsTab"
        component={TransactionScreen}
        options={{ tabBarLabel: isAdmin ? 'Records' : 'Months' }}
      />
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesScreen}
        options={{ tabBarLabel: 'Categories' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    height: Platform.OS === 'ios' ? 86 : 64,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 26 : 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
