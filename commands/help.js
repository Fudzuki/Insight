const Discord = require('discord.js')
const { Command } = require('bot-framework')

module.exports = class extends Command {
  constructor() {
    super('help', { args: ['[Command]'] })
  }

  async run(msg, lang, args, sendDeletable, prefix) {
    if (args[1]) {
      const { commands } = require('bot-framework/commands')
      const command = commands[args[1]]
      if (!command) return sendDeletable('指定されたコマンドが見つかりません。')
      const callback = p => {
        const nounderbar = p.replace(/([A-Z].*?)(_(.*?))/g, '$1 ')
        return nounderbar.replace(/\b[A-Z]{2,}\b/g, str => str.toLowerCase())
      }
      const embed = new Discord.RichEmbed()
        .setTitle('About this command')
        .setDescription(
          (lang.commands[args[1]] || ' - Not available information - ')
          + `\n\nUsage: ${prefix}${args[1]} ${command.args !== [] ? command.args.join('\n') : ''}`
          + `\nAlias: ${command.alias !== [] ? command.alias.join('\n') : 'なし'}`
          + `\nAllowed in: ${command.allowedIn.join(', ')}`
          + `\nRequired permissions for you: ${command.permission.bitfield ? command.permission.toArray(false).map(callback).join(', ') : 'なし'}`
          + `\nIs special command: ${command.requiredOwner ? 'はい' : 'いいえ'}`
          + `\nIs enabled: ${command.enabled ? 'はい' : 'いいえ'}`)
        .setTimestamp()
        .setColor([0,255,0])
      return sendDeletable(embed)
    }
    const embed = new Discord.RichEmbed()
      .setTitle('List of commands')
      .addField('help', lang['commands']['help'])
      .addField('invite', lang['commands'][invite])
      .addField('version', lang['commands']['version'])
      .addField('nick', lang['commands']['nick'])
      .addField('ping', lang['commands']['ping'])
      .addField('manage', lang['commands']['manage'])
      .addField('mname', lang['commands']['mname'])
      .addField('Note!', `\`${prefix}help [Command]\`で詳細な情報を表示します！`)
      .setColor([0,255,0])
    sendDeletable(embed)
  }
}
