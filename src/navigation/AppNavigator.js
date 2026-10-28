import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerNavigator } from './DrawerNavigator';
import { CategoryDetailsScreen } from '../screens/app/CategoryDetailsScreen';
import { AddEditTransactionScreen } from '../screens/app/AddEditTransactionScreen';
import { EditProfileScreen } from '../screens/app/EditProfileScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="DrawerRoot"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="DrawerRoot" component={DrawerNavigator} />
      <Stack.Screen
        name="CategoryDetails"
        component={CategoryDetailsScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="AddEditTransaction"
        component={AddEditTransactionScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};
