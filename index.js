const { Client, Intents } = require('discord.js')

const binance = require('./src/binance')
const bitkub = require('./src/bitkub')

const dotenv = require('dotenv')
dotenv.config()

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})
client.once('ready', () => {
  console.log('Ready!')
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return
  }
  const { commandName, options } = interaction
  const d = new Date()
  const datetime = d.toLocaleString()
  console.log(datetime)
  //check symbol price binance and bitkub
  if (commandName === 'price') {
    const symbol = options.getString('symbol')
    const binanceSymbolPrice = await binance.getPrice(symbol)
    const bitkubSymbolPrice = await bitkub.getPrice(symbol)

    let binancePrice = ''
    let bitkubPrice = ''

    if (binanceSymbolPrice == null && bitkubSymbolPrice == null) {
      return await interaction.reply({ content: 'Not Found Symbol All Exchange', ephemeral: true })
    }

    if (binanceSymbolPrice != null) {
      binancePrice = `🤑 BINANCE ${symbol.toUpperCase()}_USDT PRICE: **${binanceSymbolPrice}** USDT`
    } else {
      binancePrice = 'Not Found Symbol'
    }

    if (bitkubSymbolPrice != null) {
      bitkubPrice = `🤑 BITKUB ${symbol.toUpperCase()}_THB PRICE: **${bitkubSymbolPrice}** THB`
    } else {
      bitkubPrice = 'Not Found Symbol'
    }

    const content = binancePrice + '\n' + bitkubPrice

    await interaction.reply({ content: content, ephemeral: true })
  }
  //end check symbol price binance and bitkub
})

client.login(process.env.DISCORD_TOKEN)
