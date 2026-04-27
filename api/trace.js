export default async function handler(req, res) {
    // 1. جمع معلومات الزائر (الـ IP ونوع الجهاز)
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    // 2. بيانات البوت الخاص بك (SecCheck44_bot) والـ ID الخاص بك
    const botToken = "8677038270:AAF7pXdGVjJDBUgftzoDP0lnJsJEbNPjhpQ";
    const chatId = "5244299184"; 

    // 3. تجهيز الرسالة التي ستصلك على تليجرام
    const message = `⚠️ **تنبيه دخول جديد للموقع:**\n\n📍 **الـ IP:** \`${ip}\`\n📱 **الجهاز:** ${userAgent}\n⏰ **الوقت:** ${new Date().toLocaleString()}`;

    try {
        // 4. إرسال البيانات فوراً إلى بوت المراقبة
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "Markdown"
            })
        });
    } catch (error) {
        console.error("Error sending to Telegram:", error);
    }

    // 5. استجابة صامتة للسيرفر
    res.status(200).json({ status: "secured" });
}
