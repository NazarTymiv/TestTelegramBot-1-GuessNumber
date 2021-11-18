const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '2139974310:AAGWZp6vuQZ3C0AQdwq1iGmLNotYZuRDtQw'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

bot.setMyCommands([
    {command: '/start', description: 'First greering'},
    {command: '/info', description: 'About user'},
    {command: '/game', description: 'Start the game'}
])

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Now i will order a number between 1 - 10`) 
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, `Guess)`, gameOptions)
}

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
    
        if (text === '/start') {
            return bot.sendMessage(chatId, `Welcome ${msg.from.first_name}`)
        }
        if(text === '/info') {
            return bot.sendMessage(chatId, `Your first name: ${msg.from.first_name}\nYour username: ${msg.from.username}\nYour id: ${msg.from.id}\nYour language code: ${msg.from.language_code}`)
        }
        if(text == '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, `Sorry I don't understand your command(`)
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if(data === '/again') {
            return startGame(chatId)
        }

        Number(data) === chats[chatId] 
        ? await bot.sendMessage(chatId, `You won!\n Ordered number is ${chats[chatId]}`, againOptions) 
        : await bot.sendMessage(chatId, `You lose!\nOrdered number is ${chats[chatId]}`, againOptions)
    })
}

start()