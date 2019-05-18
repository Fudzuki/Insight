const fs = require('fs').promises
const { Command } = require('bot-framework')
const { LoggerFactory } = require('logger.js')
const logger = LoggerFactory.getLogger('commands:manage', 'green')

module.exports = class extends Command {
  constructor() {
    super('manage', { permission: 8, allowedIn: ['TextChannel'], alias: ['m'], args: ['setup', 'cban'] })
  }

  async run(msg, lang, args, sendDeletable) {
    if (args[1] === 'setup') {
      const messagecount = require('../messagecount.json')
      const channel = await msg.guild.createChannel('MessageCount: 0', 'voice', [{
        id: msg.guild.id, // = @everyone
        deny: ['CONNECT'],
      }]).catch(() => sendDeletable('エラーが発生しました。チャンネルを作成する権限があるかどうか確認してください'))
      messagecount.push({
        'channelid'    : channel.id,
        'messagecount' : 0,
        'guildname'    : msg.guild.name,
        'guildid'      : msg.guild.id,
        'messagename'  : 'Message Count',
      })
      await fs.writeFile('../messagecount.json', JSON.stringify(messagecount)).catch(e => logger.error(`Error while writing to file: ${e}`))
      sendDeletable('作成しました。この機能は管理者権限が必須となります。動かない場合は管理者権限を与えてください')
    } else if (args[1] === 'cban') {
      const banmessagecount = require('../banmessagecount.json')
      const BMC = banmessagecount[msg.channel.id]
      if(BMC.banmessage == 0){
        BMC.banmessage = 1
        msg.channel.send(`${msg.channel}をメッセージカウント無効にしました`)
      }else{
        BMC.banmessage = 0
        msg.channel.send(`${msg.channel}をメッセージカウント有効にしました`)
      }
    }
  }
}
