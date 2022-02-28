const { Client, Intents } = require('discord.js')
const alert = require('./src/alert')
const { firestore } = require('./firebase')
const binance = require('./src/binance')
const bitkub = require('./src/bitkub')
const dotenv = require('dotenv')
dotenv.config()

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
})

client.once('ready', async () => {
  sendAlertDM()
  console.log('Ready!')
})

const sendAlertDM = () => {
  alert.every1min()

  alert.every5min()

  alert.every15min()

  alert.every30min()

  alert.every1h()

  alert.every4h()

  alert.everyD()

  alert.everyW()

  alert.everyM()
}

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
      console.log('Not Found Symbol on Exchange')
      return await interaction.reply({ content: 'Not Found Symbol on Exchange', ephemeral: true })
    }

    if (binanceSymbolPrice !== null) {
      binancePrice = `🤑 BINANCE ${symbol.toUpperCase()}_USDT PRICE: **${binanceSymbolPrice}** USDT`
      console.log(`Symbol ${symbol.toUpperCase()} Price ${binanceSymbolPrice}`)
    } else {
      binancePrice = 'Not Found Symbol'
      console.log('Not Found Symbol')
    }

    if (bitkubSymbolPrice !== null) {
      bitkubPrice = `🤑 BITKUB ${symbol.toUpperCase()}_THB PRICE: **${bitkubSymbolPrice}** THB`
      console.log(`Symbol ${symbol.toUpperCase()} Price ${binanceSymbolPrice}`)
    } else {
      bitkubPrice = 'Not Found Symbol'
      console.log('Not Found Symbol')
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
    const alert = options.getString('schedule').toLowerCase()
    const userId = interaction.user.id
    console.log(userId)
    const binanceSymbolPrice = await binance.getPrice(symbolAlert)
    const bitkubSymbolPrice = await bitkub.getPrice(symbolAlert)
    await interaction.reply('Wating please')
    if (binanceSymbolPrice === null || bitkubSymbolPrice === null) {
      return await interaction.editReply({ content: 'Failed Set Alert, Not Found Symbol on Exchange', ephemeral: true })
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
        `schedule: ${alert}`

      await firestore
        .collection('alert')
        .add({
          userId: userId,
          name: nameAlert,
          exchange: exchangeAlert,
          symbol: symbolAlert,
          price: priceAlert,
          condition: conditionAlert,
          schedule: alert,
        })
        .then(async () => {
          await timeout(2000)
          await interaction.editReply({ content: content, ephemeral: true })
          console.log('Save Alert Condition')
        })
        .catch(async (error) => {
          await timeout(2000)
          await interaction.editReply({ content: 'Try again', ephemeral: true })
          console.log(error)
        })
    }
  }
  //end set alert condition
})

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

client.login(process.env.DISCORD_TOKEN)

module.exports = { client: client }
