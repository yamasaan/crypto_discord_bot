const admin = require('firebase-admin')
const account = require('./firebase-account.json')

admin.initializeApp({
  credential: admin.credential.cert(account),
})

module.exports = { firestore: admin.firestore() }
