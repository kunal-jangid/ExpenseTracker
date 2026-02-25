import { ParsedTransaction } from './parser';

/**
 * Service to handle appending rows to a target Google Sheet.
 * In a production scenario with API keys, this should be routed through a secure backend (Vercel/Netlify function).
 * For this client-side demo, we assume the Apps Script Web App URL or proxy endpoint is provided.
 */

const GOOGLE_SHEET_ENDPOINT = process.env.EXPO_PUBLIC_SHEETS_ENDPOINT || 'YOUR_APPS_SCRIPT_WEB_APP_URL';

export async function syncTransactionToSheet(transaction: ParsedTransaction): Promise<boolean> {
    if (GOOGLE_SHEET_ENDPOINT === 'YOUR_APPS_SCRIPT_WEB_APP_URL') {
        console.warn('Google Sheets Endpoint not configured. Skipping sync.');
        return false; // Simulated failure for offline caching
    }

    try {
        const payload = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date: transaction.date.toISOString(),
                amount: transaction.amount,
                sender: transaction.sender,
                receiver: transaction.receiver,
                category: transaction.category,
                raw_text: transaction.originalText,
            }),
        };

        const response = await fetch(GOOGLE_SHEET_ENDPOINT, payload);

        if (!response.ok) {
            throw new Error(`Failed to sync: ${response.statusText}`);
        }

        return true;

    } catch (error) {
        console.error('Error syncing to Google Sheets:', error);
        return false;
    }
}
