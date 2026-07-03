export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send("Method Not Allowed");
    }

    const { text } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment variables");
        return res.status(500).send("Configuration Error");
    }

    try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: "Markdown" })
        });
        res.status(200).send("OK");
    } catch (error) {
        console.error("Error sending to Telegram:", error);
        res.status(500).send("Error");
    }
}
