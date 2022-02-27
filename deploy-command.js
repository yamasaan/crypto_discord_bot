const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const dotenv = require('dotenv')
dotenv.config()

const commands = [
  new SlashCommandBuilder()
    .setName('price')
    .setDescription('Check symbol price for Binance and Bitkub')
    .addStringOption((option) => option.setName('symbol').setDescription('sample. BTC').setRequired(true)),
].map((command) => command.toJSON())

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN)

rest
  .put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error)
