const axios = require('axios')

//base url
const base_url = 'https://api.binance.com'
// get symbol_price_ticker
const symbol_price_ticker = '/api/v3/ticker/price'

async function getPrice(symbol) {
  try {
    const get_symbol = `${symbol.toUpperCase()}USDT`
    const res = await axios.get(base_url + symbol_price_ticker, {
      params: { symbol: get_symbol },
    })
    const data = res.data.price
    return Number(data).toFixed(2)
  } catch {
    return null
  }
}

module.exports = { getPrice }
