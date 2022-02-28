const { Client, Intents } = require('discord.js')

const { firestore } = require('./firebase')

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
  if (commandName === 'checkprice') {
    const symbol = options.getString('symbol')
    const binanceSymbolPrice = await binance.getPrice(symbol)
    const bitkubSymbolPrice = await bitkub.getPrice(symbol)

    let binancePrice = ''
    let bitkubPrice = ''

    if (binanceSymbolPrice === null && bitkubSymbolPrice === null) {
      return await interaction.reply({ content: 'Not Found Symbol on Exchange', ephemeral: true })
    }

    if (binanceSymbolPrice !== null) {
      binancePrice = `🤑 BINANCE ${symbol.toUpperCase()}_USDT PRICE: **${binanceSymbolPrice}** USDT`
    } else {
      binancePrice = 'Not Found Symbol'
    }

    if (bitkubSymbolPrice !== null) {
      bitkubPrice = `🤑 BITKUB ${symbol.toUpperCase()}_THB PRICE: **${bitkubSymbolPrice}** THB`
    } else {
      bitkubPrice = 'Not Found Symbol'
    }

    const content = binancePrice + '\n' + bitkubPrice

    await interaction.reply({ content: content, ephemeral: true })
  }
  //end check symbol price binance and bitkub

  //set alert condition
  if (commandName === 'setalert') {
    const nameAlert = options.getString('name')
    const exchangeAlert = options.getString('exchange').toLowerCase()
    const symbolAlert = options.getString('symbol').toLowerCase()
    const priceAlert = options.getNumber('price').toFixed(2)
    const conditionAlert = options.getString('condition').toLowerCase()
    const scheduleAlert = options.getString('schedule').toLowerCase()
    const userId = interaction.user.id
    console.log(userId)
    const binanceSymbolPrice = await binance.getPrice(symbolAlert)
    const bitkubSymbolPrice = await bitkub.getPrice(symbolAlert)

    if (binanceSymbolPrice === null || bitkubSymbolPrice === null) {
      return await interaction.reply({ content: 'Failed Set Alert, Not Found Symbol on Exchange', ephemeral: true })
    } else {
      let priceCurrency = exchangeAlert === 'binance' ? 'usdt' : 'thb'
      const content =
        `name: ${nameAlert}` +
        '\n' +
        `exchange: ${exchangeAlert}` +
        '\n' +
        `symbol: ${symbolAlert}` +
        '\n' +
        `price: ${priceAlert} ${priceCurrency}` +
        '\n' +
        `condition: ${conditionAlert}` +
        '\n' +
        `schedule: ${scheduleAlert}`
      await firestore
        .collection('alert')
        .add({
          userId: userId,
          name: nameAlert,
          exchange: exchangeAlert,
          symbol: symbolAlert,
          price: priceAlert,
          condition: conditionAlert,
          schedule: scheduleAlert,
        })
        .then(async () => {
          await interaction.reply({ content: content, ephemeral: true })
          console.log('Save Alert Condition')
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
  //end set alert condition
})

client.login(process.env.DISCORD_TOKEN)
