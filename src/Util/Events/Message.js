const {
  owner,
  prefix
} = require('../../Configurations/Config.json')
const {
  RichEmbed
} = require('discord.js')
const NoXP4U = new Set();
const NoCMD = new Set()
module.exports = (message) => {
  if (message.author.bot) return
  if (message.channel.type === 'dm' && message.content.startsWith(prefix.toLowerCase())) {
    return message.channel.send('Hey! Please only use my commands in servers.')
  }
  const client = message.client;
  client.points.ensure(`${message.guild.id}-${message.author.id}`, {
      user: message.author.id,
      guild: message.guild.id,
      points: 0,
      level: 0
  });
  client.Credits.ensure(key, {
    Wallet: 500,
    lastUsed: null,
    Bank: 0,
    SecSys: false
  });
  let currentLevel = Math.floor(client.Points.get(message.author.id).Points / 100)
  if (Number(currentLevel) >= 99) currentLevel = 99
  if (!NoXP4U.has(message.author.id)) {
    NoXP4U.add(message.author.id)
    client.Points.set(key, {
      points: client.Points.get(key).points + Math.floor(Math.random() * 8),
      level: currentLevel
    });
    setTimeout(() => {
      NoXP4U.delete(message.author.id)
    }, 15000)
  }
  if (!message.content.startsWith(client.Prefix.get(message.guild.id).prefix.toLowerCase())) return;
  const Command = message.content.split(" ")[0].slice(client.Prefix.get(message.guild.id).prefix.length).toLowerCase();
  const Paramaters = message.content.split(" ").slice(1)
  if (client.triggers.has(Command)) {
    const CMD = client.triggers.get(Command)
    if (!CMD.Permissions.User.every(Permission => message.member.hasPermission(Permission))) {
      message.channel.send('You do not have the correct permissions to use that!')
    } else if (!CMD.Permissions.Bot.every(Permission => message.guild.me.hasPermission(Permission))) {
      message.channel.send('I do not have the correct permissions to do that!')
    } else if (CMD.Options.Dev === true && !owner.includes(message.author.id)) {
      message.channel.send('You do not have the correct permissions to use that!')
    } else if (CMD.Options.NSFW === true && message.channel.nsfw === false) {
      return message.channel.send('You can\'t use **__NSFW__** commands outside of an NSFW channel')
    } else {
      if (!NoCMD.has(message.author.id)) {
        if (!owner.includes(message.author.id)) {
          NoCMD.add(message.author.id)
        }
        //  if(!owners.includes(message.author.id)) {
        setTimeout(() => {
          NoCMD.delete(message.author.id)
        }, 3000)
        // }
        client.commandsUsed++;
        try {
          CMD.Run(client, message, Paramaters)
        } catch(e) {
          message.channel.send('It looks like there was an error! Try again later.')
          console.error(e)
        }
        } else {
        const Embed = new RichEmbed()
          .setTitle('Woah! There\'s a cooldown for that.')
          .setDescription('To prevent spam there is a **3** second cooldown on all commands!')
          .setColor('#36393f')
        message.channel.send(Embed).then(msg => {
          msg.delete(5000)
        })
        message.delete()
      }
    }
  }
}
