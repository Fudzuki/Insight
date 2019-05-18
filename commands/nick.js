const { Command } = require('bot-framework')
const { x: { char } } = require('emojilib/emojis')

module.exports = class extends Command {
  constructor() {
    super('nick', { permission: 8, allowedIn: ['TextChannel'], alias: ['n', 'nickname'], args: ['[member | New Nickname]'] })
  }

  async run(msg, lang, args, sendDeletable) {
    if (args[1] === 'member') {
      if (msg.guild.me.nickname === null) {
        sendDeletable('Insightのニックネームをサーバーメンバーに変更します')
        msg.guild.me.setNickname('???')
      } else {
        sendDeletable('Insightのニックネームをリセットしました')
        msg.guild.me.setNickname('')
      }
    } else msg.react(char)
  }
}
