#!/usr/local/bin/node
require('./src/yaml')
const Discord = require('discord.js')
const logger = require('logger.js').LoggerFactory.getLogger('main', 'green')
const dispatcher = require('bot-framework/dispatcher')
const client = new Discord.Client()
const _fs = require('fs')
const fs = _fs.promises
const prefix = '\\'
const config = require('./config.yml')
const cache = { guilds: 0, messagecount: null }

if (!_fs.existsSync('./messagecount.json')) _fs.writeFileSync('./messagecount.json', '[]')
if (!_fs.existsSync('./banmessagecount.json')) _fs.writeFileSync('./banmessagecount.json', '[]')

const messagecount = require('./messagecount.json')
const bm = require('./banmessagecount.json')

client.on('ready', () => {
  client.user.setActivity(`${prefix}help | ${client.guilds.size} servers`)
  cache['guilds'] = client.guilds.size
  logger.info('Bot is ready!')
    .info('   Server Name | Server ID | MemberCount')
    .info(client.guilds.map(guild => ` - ${guild.name} | ${guild.id} | ${guild.memberCount}人`).join('\n'))
})

client.on('error', error => logger.error(error.stack || error))

client.on('message', async message => {
  if (message.author.bot || message.system) return
  if (cache['guilds'] !== client.guilds.size) client.user.setActivity(`${prefix}help | ${client.guilds.size} servers`)

  if (message.content.startsWith(prefix)) dispatcher(message, require('./lang/ja.json'), prefix, config.owners, prefix)
  if(!bm[message.channel.id]) bm[message.channel.id] = { banmessage: 0 }
  
  const result = messagecount.filter(m => m.guildid === message.guild.id && client.channels.has(m.channelid));                                                                      
  if(result.size && bm[message.channel.id].banmessage === 0){                                                   
    result.forEach(counts => {                                                                            
      counts.messagecount++;                                                                                
      message.guild.channels.get(counts.channelid).setName(`${counts.messagename}: ${counts.messagecount}`) 
    });                                                                                                     
  }

  await fs.writeFile('./messagecount.json', JSON.stringify(messagecount)).catch(e => logger.error(`Error while writing to file: ${e}`))
})

logger.info('Logging in...')
client.login(config.token)
