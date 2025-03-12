const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')

const client = new Client({
    authStrategy: new LocalAuth()
})

client.on('qr', (qr) => {
    console.log('Scan this QR code to authenticate:')
    qrcode.generate(qr, { small: true })
})

client.on('ready', async () => {
    console.log('WhatsApp client is ready!')

    try {
        const chatId = process.env.CHAT_ID
        const message = "Hello again from my Node.js script!"
    
        if (!chatId) {
            console.error("CHAT_ID is not set in .env file")
            return
        }

        await client.sendMessage(chatId, message)
        console.log(`Message successfully sent to ${chatId}: ${message}`)
    } catch (error) {
        console.error("Error sending message:", error)
    }
})

client.on('auth_failure', () => console.error('Authentication failed! Scan QR again.'))
client.on('disconnected', () => console.log('WhatsApp client disconnected. Restarting...'))

client.initialize()
