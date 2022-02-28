const axios = require('axios')

//base url
const base_url = 'https://api.bitkub.com'
// get symbol_price_ticker
const symbol_price_ticker = '/api/market/ticker'

async function getPrice(symbol) {
  const get_symbol = `THB_${symbol.toUpperCase()}`
  const res = await axios.get(base_url + symbol_price_ticker, {
    params: { sym: get_symbol },
  })
  if (Object.entries(res.data).length !== 0 && res.data.result !== null) {
    for (const i in res.data) {
      const data = res.data[i].last
      console.log(`Symbol ${get_symbol} Price ${parseFloat(data).toFixed(2)}`)
      return parseFloat(data).toFixed(2)
    }
  } else {
    console.log('Bitkub Not Found Symbol')
    return null
  }
}

module.exports = { getPrice }
