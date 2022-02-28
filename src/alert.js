const { Client, Intents } = require('discord.js')
const { firestore } = require('../firebase')
const binance = require('../src/binance')
const bitkub = require('../src/bitkub')
const cron = require('node-cron')
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

// getAlert(schedule:string) => 1m 5m 15m 30m 1h 4h d w m
const every1min = () => {
  cron.schedule('*/1 * * * *', async () => {
    await getAlert('1m')
    console.log('called schedule 1 min')
  })
}

const every5min = () => {
  cron.schedule('*/5 * * * *', async () => {
    await getAlert('5m')
    console.log('called schedule 5 min')
  })
}

const every15min = () => {
  cron.schedule('*/15 * * * *', async () => {
    await getAlert('15m')
    console.log('called schedule 15 min')
  })
}

const every30min = () => {
  cron.schedule('*/30 * * * *', async () => {
    await getAlert('30m')
    console.log('called schedule 30 min')
  })
}

const every1h = () => {
  cron.schedule('*/60 * * * *', async () => {
    await getAlert('1h')
    console.log('called schedule 1 h')
  })
}

const every4h = () => {
  cron.schedule('0 */4 * * *', async () => {
    await getAlert('4h')
    console.log('called schedule 4 h')
  })
}

const everyD = () => {
  cron.schedule('0 0 * * *', async () => {
    await getAlert('d')
    console.log('called schedule D')
  })
}

const everyW = () => {
  cron.schedule('0 0 * * 1', async () => {
    await getAlert('w')
    console.log('called schedule W')
  })
}

const everyM = () => {
  cron.schedule('0 0 1 * *', async () => {
    await getAlert('m')
    console.log('called schedule M')
  })
}

module.exports = {
  every1min: every1min,
  every5min: every5min,
  every15min: every15min,
  every30min: every30min,
  every1h: every1h,
  every4h: every4h,
  everyD: everyD,
  everyW: everyW,
  everyM: everyM,
}
