const Discord = require('discord.js');

const bot = new Discord.Client();

const token = 'YOUR_DISCORD_BOT_TOKEN_HERE';

bot.login(token);
bot.on('ready', () => {
    console.log('O Bot do Hadou está pronto');
});

bot.on('message', msg => {
    if ( msg.content.includes('Salve') || msg.content.includes('Oi') ) {
       msg.reply('Olá seja bem vindo ao Canal do Hadou!'); 
    }
})
