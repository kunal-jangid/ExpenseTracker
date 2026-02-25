import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { useAppStore } from '../src/store/appStore';
import { getTheme } from '../src/theme/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { syncTransactionToSheet } from '../src/services/sync';

export default function RootLayout() {
    const currentTheme = useAppStore((state) => state.theme);
    const theme = getTheme(currentTheme);

    useEffect(() => {
        // Listen for network state changes
        const unsubscribe = NetInfo.addEventListener(state => {
            if (state.isConnected) {
                // Fetch latest state to get unsynced transactions
                const appState = useAppStore.getState();
                const unsynced = appState.transactions.filter(t => !t.synced);

                if (unsynced.length > 0) {
                    console.log(`Network connected. Auto-syncing ${unsynced.length} transactions...`);

                    const performAutoSync = async () => {
                        for (const item of unsynced) {
                            const success = await syncTransactionToSheet(item);
                            if (success) {
                                useAppStore.getState().markAsSynced(item.id);
                            }
                        }
                    };

                    performAutoSync();
                }
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

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
