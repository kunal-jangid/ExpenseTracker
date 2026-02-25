import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Card, Avatar, Button, IconButton } from 'react-native-paper';
import { useAppStore } from '../src/store/appStore';
import { setupNotificationListener, registerForPushNotificationsAsync, simulateBankSMS } from '../src/services/notificationService';

export default function Dashboard() {
    const theme = useTheme();
    const transactions = useAppStore(state => state.transactions);
    const budgetLimit = useAppStore(state => state.budgetLimit);

    const [totalSpent, setTotalSpent] = useState(0);

    useEffect(() => {
        // Setup Notifications Permissions and Listeners
        registerForPushNotificationsAsync();
        const removeListener = setupNotificationListener();
        return () => {
            removeListener();
        };
    }, []);

    useEffect(() => {
        // Calculate total spend for the dashboard
        const spent = transactions.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        setTotalSpent(spent);
    }, [transactions]);

    const simulateNotification = async () => {
        await simulateBankSMS();
    };

    const percentageSpent = Math.min((totalSpent / budgetLimit) * 100, 100);

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

            {/* Budget Summary Card */}
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant, elevation: 0 }]}>
                <Card.Title
                    title="Monthly Overview"
                    subtitle="Your current budget status"
                    left={(props) => <Avatar.Icon {...props} icon="wallet" style={{ backgroundColor: theme.colors.primary }} />}
                />
                <Card.Content>
                    <View style={styles.budgetRow}>
                        <View>
                            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>Total Spent</Text>
                            <Text variant="displaySmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>₹{totalSpent.toLocaleString()}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>Budget Limit</Text>
                            <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>₹{budgetLimit.toLocaleString()}</Text>
                        </View>
                    </View>

                    {/* Simple Progress Bar Representation */}
                    <View style={[styles.progressBarBg, { backgroundColor: theme.colors.outline }]}>
                        <View style={[styles.progressBarFill, {
                            backgroundColor: percentageSpent > 90 ? theme.colors.error : theme.colors.primary,
                            width: `${percentageSpent}%`
                        }]} />
                    </View>

                    <Text variant="bodySmall" style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
                        {percentageSpent.toFixed(1)}% of monthly budget utilized.
                    </Text>
                </Card.Content>
            </Card>

            {/* Simulator Tools */}
            <View style={styles.actionRow}>
                <Button
                    mode="contained-tonal"
                    icon="bell-ring"
                    onPress={simulateNotification}
                    style={{ flex: 1 }}
                >
                    Simulate Bank SMS
                </Button>
            </View>

            {/* Recent Transactions Preview */}
            <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={{ color: theme.colors.onBackground }}>Recent Activity</Text>
                <Button mode="text" compact>View All</Button>
            </View>

            {transactions.slice(0, 3).map((tx) => (
                <Card key={tx.id} style={[styles.txCard, { backgroundColor: theme.colors.surface }]} mode="contained">
                    <Card.Title
                        title={tx.receiver || "Unknown Merchant"}
                        subtitle={tx.category}
                        left={(props) => <Avatar.Icon {...props} icon="cash" size={40} style={{ backgroundColor: theme.colors.secondaryContainer }} color={theme.colors.onSecondaryContainer} />}
                        right={(props) => (
                            <Text variant="titleMedium" style={{ marginRight: 16, color: theme.colors.onSurface, fontWeight: 'bold' }}>
                                ₹{tx.amount?.toLocaleString()}
                            </Text>
                        )}
                    />
                </Card>
            ))}

            {transactions.length === 0 && (
                <Text variant="bodyMedium" style={{ textAlign: 'center', marginTop: 32, color: theme.colors.outline }}>
                    No recent transactions. Simulate an SMS to see it here!
                </Text>
            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        marginBottom: 24,
        borderRadius: 24,
    },
    budgetRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    progressBarBg: {
        height: 8,
        borderRadius: 4,
        width: '100%',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    actionRow: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    txCard: {
        marginBottom: 12,
    }
});
