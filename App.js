import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { BudgetProvider } from './src/context/BudgetContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <BudgetProvider>
          <StatusBar style="auto" />
          <RootNavigator />
        </BudgetProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
