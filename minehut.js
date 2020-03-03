const https = require('https');

const minehut = {
    config: {
        hostname: 'api.minehut.com',
        port: 443,
    },

    // Test the module
    ping : () => {
        console.log('Pong!');
    },

    send_command: ( command = '/say Hello Hadou!', token , callback = (res) => { console.log(res) } ) => {
        let headers = {
            'Content-Type'  : 'application/json',
            'Accept'        :'application/json',
            'Authorization' : 'Bearer %s' + token
        };

        let body = { command : command };

        req = minehut.request('POST', '/server/5e5adb6477d32d00b2aa6d80/send_command', headers, callback );
        req.write(JSON.stringify(body));
        req.end();
    },

    // Logs to Minehut
    login : ( credentials, callback = (res) => { console.log(res) }) => {
        let headers = {
            'Content-Type' : 'application/json',
        }

        let body = {
            email    : credentials.email,
            password : credentials.password,
        };

        req = minehut.request('POST', '/users/login', headers, callback );
        req.write(JSON.stringify(body));
        req.end();
    },

    // Get data (generic)
    getData : ( endpoint, callback ) => {
        req = minehut.request('GET', endpoint, {}, callback );
        req.end();
    },

    request: ( method='GET', endpoint='/servers', headers={}, callback= (data) => { console.log('callback') }) => {
        let local_config = {
            port: 443,
            path: endpoint,
            method: method
        };
        
        if ( headers != {} ) {
            local_config.headers = headers;
        }

        let config = Object.assign(
            minehut.config,
            local_config
        );

        return https.request(config, callback);
    }
};

module.exports = minehut;