import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, Card, Avatar, Divider } from 'react-native-paper';
import { useAppStore } from '../src/store/appStore';

export default function HistoryScreen() {
    const theme = useTheme();
    const transactions = useAppStore(state => state.transactions);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text variant="bodyLarge" style={{ color: theme.colors.outline }}>
                            No transactions recorded yet.
                        </Text>
                    </View>
                }
                ItemSeparatorComponent={() => <Divider style={{ marginVertical: 8, backgroundColor: 'transparent' }} />}
                renderItem={({ item }) => (
                    <Card mode="contained" style={{ backgroundColor: theme.colors.surface }}>
                        <Card.Title
                            title={item.receiver || "Unknown Merchant"}
                            subtitle={`${item.category} • ${new Date(item.date).toLocaleDateString()}`}
                            left={(props) => <Avatar.Icon {...props} icon="receipt" style={{ backgroundColor: theme.colors.primaryContainer }} color={theme.colors.onPrimaryContainer} />}
                            right={(props) => (
                                <View style={{ marginRight: 16, alignItems: 'flex-end' }}>
                                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                                        ₹{item.amount?.toLocaleString()}
                                    </Text>
                                    <Text variant="labelSmall" style={{ color: item.synced ? theme.colors.primary : theme.colors.outline }}>
                                        {item.synced ? "Synced" : "Local"}
                                    </Text>
                                </View>
                            )}
                        />
                    </Card>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 64,
    }
});
