const fs = require('fs').promises
const { Command } = require('bot-framework')

module.exports = class extends Command {
  constructor() {
    super('mname', { permission: 8, allowedIn: ['TextChannel'] })
  }

  async run(msg, lang, args) {
    const messagecount = require('../messagecount.json')
    const msgcountofguild = messagecount.filter(m => m.guildid === msg.guild.id && msg.client.channels.get(m.channelid))[0]
    if (msgcountofguild !== null) {
      if (args[1]) {
        msg.channel.send('```' + `${args.slice(1).join(' ')}: 数値` + '```に変更しました')
        msgcountofguild.messagename = args.slice(1).join(' ')
        await fs.writeFile('../messagecount.json', JSON.stringify(messagecount))
      }
    } else {
      msg.channel.send('変更できるメッセージチャンネルが見つかりませんでした')
    }
  }
}
