import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { useAppStore } from '../store/appStore';
import { parseTransactionString } from './parser';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.warn('Failed to get push token for push notification!');
            return;
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }
}

/**
 * Attaches a listener to incoming notifications.
 * When a notification arrives, it extracts the text and passes it to the generic Parser.
 */
export function setupNotificationListener() {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
        // Extract body of the mock notification
        const text = notification.request.content.body;

        if (text) {
            console.log("Intercepted Notification: ", text);
            const parsed = parseTransactionString(text);

            // If the parser successfully determined it's an expense (has an amount)
            if (parsed.amount !== null) {
                // Auto-add to state store
                useAppStore.getState().addTransaction(parsed);
                console.log("Logged new expense locally via Notification Simulator.");
            }
        }
    });

    return () => {
        subscription.remove();
    };
}
