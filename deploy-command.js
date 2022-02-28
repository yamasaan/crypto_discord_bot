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
    .addStringOption((option) => option.setName('symbol').setDescription('sample. BTC').setRequired(true))
    .addNumberOption((option) => option.setName('price').setDescription('sample. 30000.00').setRequired(true)),
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
