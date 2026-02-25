import { Tabs } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { useAppStore } from '../src/store/appStore';
import { getTheme } from '../src/theme/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RootLayout() {
    const currentTheme = useAppStore((state) => state.theme);
    const theme = getTheme(currentTheme);

    return (
        <PaperProvider theme={theme}>
            <Tabs
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme.colors.surface,
                    },
                    headerTintColor: theme.colors.onSurface,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    tabBarStyle: {
                        backgroundColor: theme.colors.surfaceVariant,
                        borderTopWidth: 0,
                        elevation: 8,
                    },
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Dashboard',
                        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
                    }}
                />
                <Tabs.Screen
                    name="history"
                    options={{
                        title: 'History',
                        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="history" size={size} color={color} />
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: 'Settings',
                        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="cog" size={size} color={color} />
                    }}
                />
            </Tabs>
        </PaperProvider>
    );
}
