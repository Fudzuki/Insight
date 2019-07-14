const { Command } = require('bot-framework')

module.exports = class extends Command {
  constructor() {
    super('support')
  }

  async run(msg) {
    msg.channel.send('サポートサーバー\nhttps:/\\/discord.gg\/kVHWKV3');
  }
}
