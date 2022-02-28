const { Client, Intents } = require('discord.js')
const { firestore } = require('../firebase')
const binance = require('../src/binance')
const bitkub = require('../src/bitkub')
const dotenv = require('dotenv')
dotenv.config()

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
})

client.login(process.env.DISCORD_TOKEN)

const getAlert = async (schedule) => {
  const alertRef = firestore.collection('alert')
  const snapshot = await alertRef.where('schedule', '==', schedule).get()
  if (snapshot.empty) {
    console.log('No matching documents.')
    return
  }

  snapshot.forEach(async (doc) => {
    let priceCurrency = doc.data().exchange == 'binance' ? 'usdt' : 'thb'
    let content = (name, exchange, symbol, price, pricelast) =>
      `**Alert Remember**` +
      '\n' +
      `name: ${name}` +
      '\n' +
      `exchange: ${exchange}` +
      '\n' +
      `symbol: ${symbol}` +
      '\n' +
      `price: ${price} ${priceCurrency}` +
      '\n' +
      `price last: ${pricelast} ${priceCurrency}`

    const user = await client.users.fetch(doc.data().userId)
    if (doc.data().exchange == 'bitkub') {
      const price = Number(doc.data().price).toFixed(2)
      const priceLast = Number(await bitkub.getPrice(doc.data().symbol)).toFixed(2)

      if (priceLast >= price && doc.data().condition == 'more') {
        await user.send(content(doc.data().name, doc.data().exchange, doc.data().symbol, price, priceLast))
        console.log('schedule alert =>' + doc.data().schedule)
      }
      if (priceLast <= price && doc.data().condition == 'less') {
        await user.send(content(doc.data().name, doc.data().exchange, doc.data().symbol, price, priceLast))
        console.log('schedule alert =>' + doc.data().schedule)
      }
    }

    if (doc.data().exchange == 'binance') {
      const price = Number(doc.data().price).toFixed(2)
      const priceLast = Number(await binance.getPrice(doc.data().symbol)).toFixed(2)
      if (priceLast >= price && doc.data().condition == 'more') {
        await user.send(content(doc.data().name, doc.data().exchange, doc.data().symbol, price, priceLast))
        console.log('schedule alert =>' + doc.data().schedule)
      }
      if (price <= price && doc.data().condition == 'less') {
        await user.send(content(doc.data().name, doc.data().exchange, doc.data().symbol, price, priceLast))
        console.log('schedule alert =>' + doc.data().schedule)
      }
    }
    console.log(doc.id, '=>', doc.data())
    console.log('Notified')
  })
}

module.exports = { getAlert }
