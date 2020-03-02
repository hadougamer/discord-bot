const https = require('https');

const minehut = {
    config: {
      hostname: 'api.minehut.com',
      port: 443,
    },

    hello : () => {
    	console.log('Hello i am the MineHut Module!');
    },

    getData : ( endpoint, callback ) => {
      req = minehut.request('GET', endpoint, {}, callback );
      req.end();
    },

    request: ( method='GET', endpoint='/servers', headers={}, callback= (data) => { console.log('callback') }) => {
        console.log(minehut.config);
        
        let config = Object.assign(
          minehut.config, 
          {
            port: 443,
            path: endpoint,
            method: method
          }
        );
        
        return https.request(config, callback);
    }

};

module.exports = minehut;