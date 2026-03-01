import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { colors } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: '我的花园',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="plant/[id]" 
          options={{ 
            title: '植物详情',
          }} 
        />
        <Stack.Screen 
          name="chat/[id]" 
          options={{ 
            title: '植物助手',
            presentation: 'modal',
          }} 
        />
      </Stack>
    </ErrorBoundary>
  );
}
