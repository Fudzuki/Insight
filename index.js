#!/usr/local/bin/node
require('./src/yaml')
// Discord bot implements
const discord = require('discord.js');
const logger = require('logger.js').LoggerFactory.getLogger('main', 'green')
//const antispam = require('discord-anti-spam');
const dispatcher = require('bot-framework/dispatcher')
const client = new discord.Client();
const fs = require("fs");
const prefix = "\\";
const config = require('./config.yml')
let cache = null

let messagesu = JSON.parse(fs.readFileSync("./messagesu.json", "utf8"));
let SNickname = JSON.parse(fs.readFileSync("./SNickname.json", "utf8"));
let banmessagesu = JSON.parse(fs.readFileSync("./banmessagesu.json", "utf8"));
let GCcommands = 0;

client.on('ready', message => {
  client.user.setActivity(`${prefix}help | ${client.guilds.size} servers`)
  cache = client.guilds.size
  logger.info('Bot is ready!')
    .info("   Server Name | Server ID | MemberCount")
    .info(client.guilds.map(guild => ` - ${guild.name} | ${guild.id} | ${guild.memberCount}人`).join('\n'))
});

client.on('error', error => logger.error(error.stack || error))

client.on('message', message => {
  if (message.author.bot || message.system) return;

  let args = message.content.trim().split(/\s{1,}/g);
  let command = args.shift();
  let AmessageArray = message.content.split(" ");
  let cmd = AmessageArray[0];
  let agre = AmessageArray.slice(1)

  if (cache !== client.guilds.size) client.user.setActivity(`${prefix}help | ${client.guilds.size} servers`)

  if (message.content.startsWith(prefix) && message.content.includes('version') || message.content.includes('eval') || message.content.includes('help') || message.content.includes('ping')) {
    dispatcher(message, require('./lang/ja.json'), prefix, config.owners)
  }

  let gotiser = client.guilds.get('514362788425236480').memberCount;
  let gotizatuer = client.guilds.get('514362788425236480');
  let Gonmember = gotiser - gotizatuer.members.filter(m => m.presence.status === 'offline').size;

  if(!SNickname[message.guild.id]) SNickname[message.guild.id] = {
    on1: 0,
    on2: 0,
    on3: 0,
    on4: 0,
    on5: 0,
    on6: 0,
    on7: 0,
    on8: 0,
    on9: 0,
    on10: 0
  }
  let SNN = SNickname[message.guild.id];
  if(message.content == prefix + "n member"){
    if(message.member.hasPermission("ADMINISTRATOR") || message.author.id == '460208854362357770'){
      if(SNN.on1 == 0){
        SNN.on1 = 1;
        message.channel.send("Insightのニックネームをサーバーメンバーに変更します");
      }else{
        SNN.on1 = 0;
        message.channel.send("Insightのニックネームをリセットしました");
        //message.guild.members.get('509134889069838346').setNickname("Insight");
      }
    }else{
      message.channel.send("管理者権限を持っている人のみ実行可能です");
    }
  }
  let botman = message.guild.members.get('548423175872970764');
  if(SNN.on1 == 1){
    botman.setNickname(message.guild.memberCount+"人");
  }else{
    botman.setNickname(botman.user.username);
  }


  /*メッセージカウント*/
  let Mchannelid;
  let Mok = 0;
  if(message.content == prefix + "m setup"){
    if(message.member.hasPermission("ADMINISTRATOR") || message.author.id == '460208854362357770'){
  let server = message.guild;
        server.createChannel(`MessageCount: 0`, 'voice', [{
            id: message.guild.id, //@everyone
            deny: ['CONNECT']
        }]).then(channel => {
          Mchannelid = channel.id;
          //let category = server.channels.find(c => c.id ==
            //'543954520867340318' && c.type == "category");
          //if(!category) throw new Error("Category channel does not exist");
         // channel.setParent(category.id);
          Mok = 1;
          if(Mok == 1){
            messagesu.push({
              "channelid"    : Mchannelid,
              "messagecount" : 0,
              "guildname"    : message.guild.name,
              "guildid"      : message.guild.id,
              "messagename"  : "Message Count"
            });
            Mok = 0;
          }
          fs.writeFile("./messagesu.json", JSON.stringify(messagesu), (err) => {
            if (err) logger.error(err.stack || err)
          });
          message.reply("作成しました。この機能は管理者権限が必須となります、動かない場合は管理者権限を与えてください");
        }).catch(
          e => message.channel.send("エラーが発生しました、チャンネルを作成する権限があるかどうか確認してください")
        );
    }else{
      message.channel.send("管理者権限を持ってる人のみ実行可能です");
    }
  }


  if(!banmessagesu[message.channel.id]) banmessagesu[message.channel.id] = {
    banmessage : 0
  }
  let BCM = banmessagesu[message.channel.id];
  if(message.content == `${prefix}m cban`){
    if(message.member.hasPermission(8)){
    if(BCM.banmessage == 0){
      BCM.banmessage = 1;
      message.channel.send("<#" + message.channel.id + ">をメッセージカウント無効にしました");
    }else{
    BCM.banmessage = 0;
      message.channel.send("<#" + message.channel.id + ">をメッセージカウント有効にしました");
    }
    }else{
      message.channel.send("管理者権限を持ってる人のみ実行可能です");
    }
  }
  let MCok = 1;
  if(BCM.banmessage == 0){
    for(let abc in messagesu){
      MCok = 1;
     // let MC;
      if(messagesu[abc].guildid == message.guild.id && client.channels.get(messagesu[abc].channelid)){
        //message.channel.send("てすと");
        MCok = 0;
       // MC = client.channels.get(messagesu[abc].channelid);
      }else{
        //message.channel.send("テストで");
      }

      if(messagesu[abc].guildid == message.guild.id && MCok == 0){
        messagesu[abc].messagecount++;
        MCok = 1;
      }
    }
  }

  for(let bbb in messagesu){
    if(client.channels.get(messagesu[bbb].channelid)){
      //messagesu[bbb].guildid = 1;
      let CGGG = client.channels.get('542636090562052105');
      //CGGG.send(messagesu[bbb].guildname + "を削除しました");
    }
  }


  for(let abc in messagesu){

    let MC;
    if(client.channels.get(messagesu[abc].channelid) == false){
      messagesu[abc].guildid = 0;
    }
    if(client.channels.get(messagesu[abc].channelid)){
    if(messagesu[abc].guildid == message.guild.id){
      MC = client.channels.get(messagesu[abc].channelid);
      MC.edit({
        name: messagesu[abc].messagename +": " + messagesu[abc].messagecount
      })
    }else{
      //message.channel.send("エラー");
    }
    }
  }


  let okok;
  let Mname = 0;
  for(let cccc in messagesu){
    okok = 0;
    if(messagesu[cccc].guildid == message.guild.id && client.channels.get(messagesu[cccc].channelid)){
      okok = 1;
      if(messagesu[cccc].guildid == message.guild.id && MCok == 1){
        Mname = messagesu[cccc];
        okok = 0;
      }
    }
  }


  if(command == prefix + "mname"){
    if(message.member.hasPermission("ADMINISTRATOR") || message.author.id == '460208854362357770'){
      if(Mname !== 0){
      if(args[0]){
        if(args[1]){
          if(args[2]){
            if(args[3]){
              if(args[4]){}else{
                message.channel.send("```"+`${args[0]} ${args[1]} ${args[2]} ${args[3]}: 数値`+"```に変更しました");
                Mname.messagename = `${args[0]} ${args[1]} ${args[2]} ${args[3]}`;
              }
            }else{
              message.channel.send("```"+`${args[0]} ${args[1]} ${args[2]}: 数値`+"```に変更しました");
              Mname.messagename = `${args[0]} ${args[1]} ${args[2]}`;
            }
          }else{
            message.channel.send("```"+`${args[0]} ${args[1]}: 数値`+"```に変更しました");
            Mname.messagename = `${args[0]} ${args[1]}`;
          }
        }else{
          message.channel.send("```"+`${args[0]}: 数値`+"```に変更しました");
          Mname.messagename = `${args[0]}`;
        }
      }
      }else{
        message.channel.send("変更できるメッセージチャンネルが見つかりませんでした");
      }
    }else{
      message.channel.send("管理者権限を持っている人のみ実行可能です");
    }
  }

  /*グローバルチャット*/
  /*


  GCcommands = 0;*/

  fs.writeFile("./messagesu.json", JSON.stringify(messagesu), (err) => {
    if(err) logger.error(err.stack || err)
  });
  fs.writeFile("./SNickname.json", JSON.stringify(SNickname), (err) => {
    if(err) logger.error(err.stack || err)
  });

});

logger.info('Logging in...')
client.login(config.token);
