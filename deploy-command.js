const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const dotenv = require('dotenv')
dotenv.config()

const commands = [
  new SlashCommandBuilder()
    .setName('checkprice')
    .setDescription('Check symbol price for Binance and Bitkub')
    .addStringOption((option) => option.setName('symbol').setDescription('sample. BTC').setRequired(true)),
  new SlashCommandBuilder()
    .setName('setalert')
    .setDescription('Set alert symbol price')
    .addStringOption((option) => option.setName('name').setDescription('sample. name alert').setRequired(true))
    .addStringOption((option) =>
      option
        .setName('exchange')
        .setDescription('sample. bitkub or binance')
        .setRequired(true)
        .addChoice('bitkub', 'bitkub')
        .addChoice('binance', 'binance')
    )
    .addStringOption((option) => option.setName('symbol').setDescription('sample. BTC').setRequired(true))
    .addNumberOption((option) => option.setName('price').setDescription('sample. 30000.00').setRequired(true))
    .addStringOption((option) =>
      option
        .setName('condition')
        .setDescription('sample. less or more')
        .setRequired(true)
        .addChoice('more', 'more')
        .addChoice('less', 'less')
    )
    .addStringOption((option) =>
      option
        .setName('schedule')
        .setDescription('sample. 5m')
        .setRequired(true)
        .addChoice('1m', '1m')
        .addChoice('5m', '5m')
        .addChoice('15m', '15m')
        .addChoice('30m', '30m')
        .addChoice('1h', '1h')
        .addChoice('4h', '4h')
        .addChoice('d', 'd')
        .addChoice('w', 'w')
        .addChoice('m', 'm')
    ),
].map((command) => command.toJSON())

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN)

//One guild
rest
  .put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error)

//Global guild
// rest
//   .put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
//   .then(() => console.log('Successfully registered application commands.'))
//   .catch(console.error)
