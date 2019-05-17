const { Command } = require('bot-framework')

module.exports = class extends Command {
  constructor() {
    super('ping')
  }

  async run(msg) {
    msg.channel.send(`:loading: | Ping を確認しています...`).then(msg2 => {
      msg2.edit(
        `API: ${Math.round(msg.client.ping)} ms\nLatency: ${msg2.createdTimestamp - msg.createdTimestamp} ms`
      )
    });
  }
}
