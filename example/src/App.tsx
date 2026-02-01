import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuraProvider } from 'rn-aura';

import HomeScreen from './screens/HomeScreen';
import InputsScreen from './screens/InputsScreen';
import MediaScreen from './screens/MediaScreen';
import LayoutScreen from './screens/LayoutScreen';
import InteractionScreen from './screens/InteractionScreen';
import VisualsScreen from './screens/VisualsScreen';
import AuraScreen from './screens/AuraScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuraProvider>
          <NavigationContainer>
            <Stack.Navigator 
              initialRouteName="Home"
              screenOptions={{
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTitleStyle: { fontWeight: '600', color: '#111827' },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: '#FFFFFF' }
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'RN Aura' }} />
              <Stack.Screen name="Inputs" component={InputsScreen} options={{ title: 'Smart Inputs' }} />
              <Stack.Screen name="Media" component={MediaScreen} options={{ title: 'Media' }} />
              <Stack.Screen name="Layout" component={LayoutScreen} options={{ title: 'Layout' }} />
              <Stack.Screen name="Interaction" component={InteractionScreen} options={{ title: 'Interaction' }} />
              <Stack.Screen name="Visuals" component={VisualsScreen} options={{ title: 'Visuals' }} />
              <Stack.Screen name="Aura" component={AuraScreen} options={{ title: 'Dynamic Island' }} />
            </Stack.Navigator>
          </NavigationContainer>
        </AuraProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
