const sleep = require('system-sleep');
const {Wit, log} = require('node-wit');
const fs 		 = require('fs');
const Discord 	 = require('discord.js');
const bot  		 = new Discord.Client();

const credentials = require('./credentials.local.js');
const minehut     = require('./minehut.js');

let minehut_token   = null;
let minehut_session = null;

minehut.login( 
    credentials.MINEHUT,
    ( res ) => {
        let body = '';
        res.on('data', (data) =>{
            body += data;
        });
        res.on('end', () =>{
            //console.log( body );
            let json = JSON.parse(body);
            minehut_token = json.token;
            minehut_session = json.sessionId
        });
    }
);

// Sleep to wait minehut login
sleep(2000);
console.log( 'TOKEN: ' + minehut_token );

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

    // DOC Minehut: https://api.bennydoesstuff.me/
    if (  msg.content.startsWith('?mine') ) {
        let mine_command = '';

        msg.content = msg.content.replace('/', '');

        switch( msg.content ) {
            case '?mine noite':
                mine_command = '/time set night';
            break;

            case '?mine dia':
                mine_command = '/time set day';
            break;

            case '?mine chuva':
                mine_command = '/weather rain';
            break;

            case '?mine tempo bom':
                mine_command = '/weather clear';
            break;

            case '?mine neve':
                mine_command = '/time set snow';
            break;

            case '':
                return false;
            break;

            default:
                mine_command = '/Say [' + msg.author.username + '] : ' + msg.content.replace('?mine', '');
            break;
        }

        // Send command test
        minehut.send_command(
            mine_command,
            minehut_token,
            minehut_session,
            (res) => {
                let body = '';
                res.on('data', (data) => {
                    body += data;
                });

                res.on('end', () => {
                    console.log(body);
                    msg.reply( 'Comando Minehut enviado!' );
                });
            }
        );
    }

    if ( msg.content.toLowerCase().startsWith('bot') ) {
        if (  msg.content.includes('me conhece')  || msg.content.includes('quem sou eu') ) {
            msg.content = 'Quem é ' + msg.author.username;
        }

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

//bot.on('debug', console.log);
