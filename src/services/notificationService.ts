import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAppStore } from '../store/appStore';
import { parseTransactionString } from './parser';

// In Expo Go SDK 53+, importing `expo-notifications` crashes the app.
// We only load it if we are NOT in the Expo Go client.
let Notifications: any = null;

if (Constants.appOwnership !== 'expo') {
    try {
        Notifications = require('expo-notifications');
    } catch (e) {
        console.warn("Could not load expo-notifications.", e);
    }
}

if (Notifications) {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
}

export async function registerForPushNotificationsAsync() {
    if (!Notifications) {
        console.warn('Push Notifications are disabled in Expo Go. Run a Dev Build to test properly.');
        return;
    }

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
    if (!Notifications) {
        return () => { }; // return empty cleanup function if in Expo Go 
    }

    const subscription = Notifications.addNotificationReceivedListener((notification: any) => {
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

export async function simulateBankSMS() {
    if (Notifications) {
        // Fire a local notification to simulate an incoming bank SMS
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Bank Alert!",
                body: "Paid ₹ 850 to Zomato via UPI on 25 Feb.",
            },
            trigger: null, // trigger immediately
        });
    } else {
        // Fallback for Expo Go: Bypass the notification listener and manually parse a string
        console.log("Simulating SMS directly (Expo Go Fallback)...");
        const testString = "Paid ₹ 850 to Zomato via UPI on 25 Feb.";
        const parsed = parseTransactionString(testString);
        if (parsed.amount !== null) {
            useAppStore.getState().addTransaction(parsed);
        }
    }
}

