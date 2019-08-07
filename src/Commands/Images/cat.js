const request = require('node-superfetch')
const { RichEmbed } = require('discord.js')
module.exports = {
    Triggers: ['cat', 'catto', 'kitter', 'randomcat'],
    Description: 'View some cute cats',
    Category: 'images',
    Permissions: {
      User: [],
      Bot: ['ATTACH_FILES', 'EMBED_LINKS', 'SEND_MESSAGES']
    },
    Options: {
      Dev: false,
      NSFW: false,
      Cooldown: {
        Enabled: true,
        Time: 0
      },
    },
    Run: async (client, message, paramaters) => {
        const { body } = await request.get(`http://aws.random.cat/meow`)
        const Embed = new RichEmbed()
        .setColor('RED')
        .setTitle('Here is your random cat!')
        .setImage(body.file)
        message.channel.send(Embed)
    }
  }