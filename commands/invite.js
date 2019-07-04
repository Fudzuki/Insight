const { Command } = require('bot-framework')

module.exports = class extends Command {
  constructor() {
    super('invite')
  }

  async run(msg) {
    msg.channel.send(`<https://discordapp.com/oauth2/authorize?client_id=${msg.client.user.id}&permissions=8&scope=bot>`)
  }
}
