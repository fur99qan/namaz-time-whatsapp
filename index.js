const fs = require('fs')
const path = require('path')
const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const os = require('os')

// Define custom session storage path
const SESSION_PATH = path.join(os.homedir(), '.wwebjs_auth')

// Debug: Ensure session directory and files exist
console.log(`🔍 Checking session storage at: ${SESSION_PATH}`)
if (fs.existsSync(SESSION_PATH)) {
    console.log("✅ Session directory exists.")
    console.log("📂 Session files:", fs.readdirSync(SESSION_PATH))
} else {
    console.log("❌ Session directory does NOT exist!")
}

// Initialize WhatsApp client with custom session path
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: SESSION_PATH }), // Use specified path
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

client.on('qr', (qr) => {
    console.log('⚠️ Scan this QR code to authenticate:')
    qrcode.generate(qr, { small: true })
})

client.on('ready', async () => {
    console.log('✅ WhatsApp client is ready!')

    try {
        const chatId = process.env.CHAT_ID
        const message = "Hello again from my Node.js script!"
    
        if (!chatId) {
            console.error("❌ CHAT_ID is not set in environment variables!")
            return
        }

        await client.sendMessage(chatId, message)
        console.log(`📩 Message sent to ${chatId}: ${message}`)
    } catch (error) {
        console.error("❌ Error sending message:", error)
    }
})

client.on('auth_failure', () => console.error('❌ Authentication failed! Scan QR again.'))
client.on('disconnected', () => console.log('⚠️ WhatsApp client disconnected. Restarting...'))

client.initialize()
