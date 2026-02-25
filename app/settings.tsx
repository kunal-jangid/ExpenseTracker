import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, useTheme, Card, SegmentedButtons, TextInput, Button, Divider } from 'react-native-paper';
import { useAppStore } from '../src/store/appStore';
import { ThemeType } from '../src/theme/theme';
import { syncTransactionToSheet } from '../src/services/sync';

export default function SettingsScreen() {
    const theme = useTheme();

    // Zustand Store mappings
    const currentTheme = useAppStore(state => state.theme);
    const setTheme = useAppStore(state => state.setTheme);
    const budgetLimit = useAppStore(state => state.budgetLimit);
    const setBudgetLimit = useAppStore(state => state.setBudgetLimit);
    const transactions = useAppStore(state => state.transactions);
    const markAsSynced = useAppStore(state => state.markAsSynced);

    // Local state for forms
    const [budgetInput, setBudgetInput] = useState(budgetLimit.toString());
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSaveBudget = () => {
        const val = parseInt(budgetInput, 10);
        if (!isNaN(val) && val > 0) {
            setBudgetLimit(val);
            Alert.alert("Success", "Budget updated successfully!");
        } else {
            Alert.alert("Error", "Please enter a valid number");
        }
    };

    const handleManualSync = async () => {
        const unsynced = transactions.filter(t => !t.synced);
        if (unsynced.length === 0) {
            Alert.alert("Info", "All transactions are already synced to Google Sheets!");
            return;
        }

        setIsSyncing(true);
        let successCount = 0;

        for (const item of unsynced) {
            const success = await syncTransactionToSheet(item);
            if (success) {
                markAsSynced(item.id);
                successCount++;
            }
        }

        setIsSyncing(false);

        // As per the sync service placeholder, if env vars are missing, it will return false and warn in console.
        if (successCount === 0) {
            Alert.alert("Sync Error", "Could not reach Google Sheets. Ensure the EXPO_PUBLIC_SHEETS_ENDPOINT is configured.");
        } else {
            Alert.alert("Sync Complete", `Successfully synced ${successCount} transactions.`);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

            {/* Theme Selection */}
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <Card.Title title="Appearance" subtitle="Material 3 Dynamic Themes" />
                <Card.Content>
                    <Text variant="bodyLarge" style={{ marginBottom: 12, color: theme.colors.onSurfaceVariant }}>
                        Select Application Theme
                    </Text>
                    <SegmentedButtons
                        value={currentTheme}
                        onValueChange={(val) => setTheme(val as ThemeType)}
                        buttons={[
                            { value: 'sandyLight', label: 'Sandy' },
                            { value: 'neonYellowDark', label: 'Neon' },
                            { value: 'matteDark', label: 'Matte' },
                        ]}
                    />
                </Card.Content>
            </Card>

            {/* Budget Configuration */}
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <Card.Title title="Budgeting" subtitle="Set your monthly tracking limits" />
                <Card.Content>
                    <TextInput
                        mode="outlined"
                        label="Monthly Budget Limit (₹)"
                        value={budgetInput}
                        onChangeText={setBudgetInput}
                        keyboardType="numeric"
                        style={{ marginBottom: 12 }}
                        left={<TextInput.Icon icon="currency-inr" />}
                    />
                    <Button mode="contained" onPress={handleSaveBudget}>Save Budget</Button>
                </Card.Content>
            </Card>

            {/* Cloud Sync Configuration */}
            <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant, elevation: 0 }]}>
                <Card.Title title="Google Sheets Sync" subtitle="Backup data to the cloud" />
                <Card.Content>
                    <Text variant="bodyMedium" style={{ marginBottom: 16, color: theme.colors.onSurfaceVariant }}>
                        Unsynced Transactions: {transactions.filter(t => !t.synced).length}
                    </Text>

                    <Button
                        mode="contained-tonal"
                        icon="cloud-upload"
                        onPress={handleManualSync}
                        loading={isSyncing}
                        disabled={isSyncing}
                    >
                        {isSyncing ? 'Syncing to Sheets...' : 'Sync Now'}
                    </Button>

                    <Divider style={{ marginVertical: 16 }} />
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                        Requires the `EXPO_PUBLIC_SHEETS_ENDPOINT` environment variable to be set during build to point to the secure backend proxy or Apps Script.
                    </Text>
                </Card.Content>
            </Card>

            <View style={{ paddingBottom: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        marginBottom: 16,
        borderRadius: 16,
    }
});
