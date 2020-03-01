const {Wit, log} = require('node-wit');
const fs 		 = require('fs');
const Discord 	 = require('discord.js');
const bot  		 = new Discord.Client();

const credentials = require('./credentials.local.js');

// Configure WIT-AI
const witClient = new Wit({
    accessToken: credentials.WIT_TOKEN,
    logger: new log.Logger(log.DEBUG) // optional
});

bot.login(credentials.BOT_TOKEN);
bot.on('ready', () => {
    console.log('O Bot do Hadou está pronto');
});

bot.on('message', msg => {
    if ( msg.author.bot ) {
      console.log('Is author the bot?')
      return false;
    }

    if ( msg.content.toLowerCase().startsWith('bot') ) {
        if (  msg.content.includes('me conhece')  || msg.content.includes('quem sou eu') ) {
            msg.content = 'Quem é ' + msg.author.username;
        }

        console.log('MSG:' + msg.content );        

        witClient.message(msg.content).then((witSuccess) => {

            
            // Better response
            let better = { 
                confidence: 0, 
                value: 'Desculpe, não te entendi.' 
            }

            for ( key in witSuccess.entities) {
                let entity = witSuccess.entities[key];
                for ( k in entity ) {
                    if ( (entity[k].confidence*1000) > (better.confidence*1000) ) {
                        better = entity[k];
                    }                
                }
            }

            msg.reply( better.value );
        });        
    }

    // Log to teach the robot
    let filename = './chat.log';
    let chatContent = fs.readFileSync(filename, 'utf8');
    fs.writeFile(filename, chatContent + msg.content + '\r\n', function(err){
        if ( err ) {
            return console.log(err);
        }
        console.log('File saved!');
    });
});

bot.on('debug', console.log);
