// src/services/parser.ts

export interface ParsedTransaction {
    amount: number | null;
    sender: string | null;
    receiver: string | null;
    category: string;
    originalText: string;
    date: Date;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
    'Food & Dining': ['zomato', 'swiggy', 'restaurant', 'cafe', 'mcdonalds', 'kfc', 'starbucks', 'baker', 'eats'],
    'Groceries': ['blinkit', 'zepto', 'instamart', 'bigbasket', 'supermarket', 'grocery', 'mart'],
    'Transport': ['uber', 'ola', 'rapido', 'metro', 'fuel', 'petrol', 'diesel', 'irctc'],
    'Shopping': ['amazon', 'flipkart', 'myntra', 'ajio', 'store', 'retail'],
    'Utilities': ['recharge', 'bill', 'electricity', 'water', 'broadband', 'airtel', 'jio', 'vi'],
    'Entertainment': ['netflix', 'prime', 'spotify', 'movie', 'bookmyshow', 'pvr'],
};

/**
 * Attempts to categorize a transaction based on the receiver/merchant name.
 */
function guessCategory(receiver: string | null, text: string): string {
    if (!receiver && !text) return 'Miscellaneous';

    const searchString = `${receiver || ''} ${text}`.toLowerCase();

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(keyword => searchString.includes(keyword))) {
            return category;
        }
    }

    return 'Miscellaneous';
}

/**
 * Parses raw SMS/Notification text to extract transaction details.
 * Focuses on common Indian banking/UPI formats.
 */
export function parseTransactionString(text: string): ParsedTransaction {
    let amount: number | null = null;
    let sender: string | null = null;
    let receiver: string | null = null;

    // 1. Extract Amount
    // Matches formats like Rs. 500, INR 1,200.50, ₹ 50
    const amountRegex = /(?:Rs\.?|INR|₹)\s*([\d,]+\.?\d*)/i;
    const amountMatch = text.match(amountRegex);
    if (amountMatch && amountMatch[1]) {
        amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    // 2. Determine Receiver / Merchant
    // Look for "to [Name]", "paid to [Name]", "at [Merchant]"
    const receiverRegex = /(?:paid to|sent to|to|at)\s+([A-Za-z0-9\s@\.]+?)(?:\s+(?:on|via|using|from|for)|$|\.|,)/i;
    const receiverMatch = text.match(receiverRegex);
    if (receiverMatch && receiverMatch[1]) {
        receiver = receiverMatch[1].trim();
        // Clean up common trailing words caught by the regex if needed
        receiver = receiver.replace(/\s+(a\/c|account).*$/i, '');
    }

    // 3. Determine Sender (Usually the user's account, but sometimes explicitly mentioned)
    // Look for "from [Account]", "by [Name]"
    const senderRegex = /(?:from|by)\s+([A-Za-z0-9\s]+?)(?:\s+(?:on|to|for)|$|\.|,)/i;
    const senderMatch = text.match(senderRegex);
    if (senderMatch && senderMatch[1]) {
        sender = senderMatch[1].trim();
    } else {
        // Default to self for outbound payments if not explicitly stated
        sender = "Self (Default Account)";
    }

    // Determine if it's credit or debit to adjust logic (Optional enhancement)
    // const isCredit = /(?:credited|received)/i.test(text);

    const category = guessCategory(receiver, text);

    return {
        amount,
        sender,
        receiver,
        category,
        originalText: text,
        date: new Date(),
    };
}
