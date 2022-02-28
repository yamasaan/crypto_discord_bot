const alert = require('./alert')
const cron = require('node-cron')

// getAlert(schedule:string) => 1m 5m 15m 30m 1h 4h d w m
const every1min = () => {
  cron.schedule('*/1 * * * *', async () => {
    await alert.getAlert('1m')
    console.log('called schedule 1 min')
  })
}

const every5min = () => {
  cron.schedule('*/5 * * * *', async () => {
    await alert.getAlert('5m')
    console.log('called schedule 5 min')
  })
}

const every15min = () => {
  cron.schedule('*/15 * * * *', async () => {
    await alert.getAlert('15m')
    console.log('called schedule 15 min')
  })
}

const every30min = () => {
  cron.schedule('*/30 * * * *', async () => {
    await alert.getAlert('30m')
    console.log('called schedule 30 min')
  })
}

const every1h = () => {
  cron.schedule('*/60 * * * *', async () => {
    await alert.getAlert('1h')
    console.log('called schedule 1 h')
  })
}

const every4h = () => {
  cron.schedule('0 */4 * * *', async () => {
    await alert.getAlert('4h')
    console.log('called schedule 4 h')
  })
}

const everyD = () => {
  cron.schedule('0 0 * * *', async () => {
    await alert.getAlert('d')
    console.log('called schedule D')
  })
}

const everyW = () => {
  cron.schedule('0 0 * * 1', async () => {
    await alert.getAlert('w')
    console.log('called schedule W')
  })
}

const everyM = () => {
  cron.schedule('0 0 1 * *', async () => {
    await alert.getAlert('m')
    console.log('called schedule M')
  })
}

module.exports = {
  every1min,
  every5min,
  every15min,
  every30min,
  every1h,
  every4h,
  everyD,
  everyW,
  everyM,
}
