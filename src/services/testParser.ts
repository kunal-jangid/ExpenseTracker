import { parseTransactionString } from './parser';

const tests = [
    "Paid ₹ 1,250 to Zomato via HDFC Bank on 25 Feb.",
    "Rs. 50.00 spent at Starbucks on your credit card ends in 1234",
    "Sent ₹ 5,000 to John Doe from A/c XX4567.",
    "Your a/c no. XX999 is debited for Rs.1200.00 on 24-02-26 and credited to Amazon Pay.",
    "Debited Rs 400 from A/C *1234. Info: Uber Rides.",
];

tests.forEach((text, i) => {
    console.log(`\nTest ${i + 1}:`);
    console.log(`Input: "${text}"`);
    console.log(JSON.stringify(parseTransactionString(text), null, 2));
});
