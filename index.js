#!/usr/local/bin/node
require('./src/yaml')
// Discord bot implements
const discord = require('discord.js')
const logger = require('logger.js').LoggerFactory.getLogger('main', 'green')
const dispatcher = require('bot-framework/dispatcher')
const client = new discord.Client()
const _fs = require('fs')
const fs = _fs.promises
const config = require('./config.yml')
const { prefix } = config
const cache = { guilds: 0, messagecount: null, beta: false }
const git = require('simple-git/promise')

if (!_fs.existsSync('./messagecount.json')) _fs.writeFileSync('./messagecount.json', '[]')
if (!_fs.existsSync('./banmessagecount.json')) _fs.writeFileSync('./banmessagecount.json', '[]')

const messagecount = require('./messagecount.json')
const banmessagecount = require('./banmessagecount.json')

client.on('ready', async () => {
  client.user.setActivity(`${prefix}help | ${client.guilds.size} servers`)
  cache['guilds'] = client.guilds.size
  logger.info('Bot is ready!')
    .info('   Server Name | Server ID | MemberCount')
    .info(client.guilds.map(guild => ` - ${guild.name} | ${guild.id} | ${guild.memberCount} users`).join('\n'))
  const status = await git().branchLocal()
  if (status.current) cache.beta = true
  if (cache.beta) logger.config(true).debug('Running in beta mode. Some features will be disabled.')
})

client.on('error', error => logger.error(error.stack || error))

client.on('message', async message => {
  if (message.author.bot || message.system) return
  if (cache['guilds'] !== client.guilds.size) client.user.setActivity(`${prefix}help | ${client.guilds.size} servers`)

  if (message.content.startsWith(prefix)) dispatcher(message, require('./lang/ja.json'), prefix, config.owners, prefix)

  if (!message.guild) return
  cache['messagecount'] = messagecount
  if (message.guild.me.nickname !== null) message.guild.me.setNickname(`${message.guild.memberCount}人`)
  if (cache.beta) return
  if (!banmessagecount[message.channel.id]) banmessagecount[message.channel.id] = { banmessage: 0 }
  const BCM = banmessagecount[message.channel.id]
  const result = messagecount.filter(m => BCM.banmessage === 0 && m.guildid === message.guild.id)
  if (result.length) result.messagecount++

  for(const abc in messagecount){
    if(!client.channels.has(messagecount[abc].channelid)){
      messagecount[abc].guildid = 0
    } else {
      if(messagecount[abc].guildid == message.guild.id){
        client.channels.get(messagecount[abc].channelid).setName(`${messagecount[abc].messagename}: ${messagecount[abc].messagecount}`)
      }
    }
  }

  await fs.writeFile('./messagecount.json', JSON.stringify(messagecount)).catch(e => logger.error(`Error while writing to file: ${e}`))
})

logger.info('Logging in...')
client.login(config.token)
