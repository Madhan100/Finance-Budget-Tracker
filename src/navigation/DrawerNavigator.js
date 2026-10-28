import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CustomDrawerContent } from '../components/CustomDrawerContent';
import { TabNavigator } from './TabNavigator';
import { HomeScreen } from '../screens/app/HomeScreen';
import { AnalysisScreen } from '../screens/app/AnalysisScreen';
import { TransactionScreen } from '../screens/app/TransactionScreen';
import { CategoriesScreen } from '../screens/app/CategoriesScreen';
import { ProfileScreen } from '../screens/app/ProfileScreen';

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 300,
        },
        drawerType: 'front',
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen
        name="HomeDrawer"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen
        name="AnalysisDrawer"
        component={AnalysisScreen}
        options={{ title: 'Analysis' }}
      />
      <Drawer.Screen
        name="TransactionsDrawer"
        component={TransactionScreen}
        options={{ title: 'Transactions' }}
      />
      <Drawer.Screen
        name="CategoriesDrawer"
        component={CategoriesScreen}
        options={{ title: 'Categories' }}
      />
      <Drawer.Screen
        name="ProfileDrawer"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Drawer.Navigator>
  );
};
