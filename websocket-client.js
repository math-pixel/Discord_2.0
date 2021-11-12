const Html5WebSocket = require('html5-websocket');
const ReconnectingWebSocket = require('reconnecting-websocket');
const uuid = require('uuid');

let isServerLocal;
let wsHost;
let wsPort;
if(isServerLocal === true) {
    let wsHost = 'localhost';
    let wsPort = '3000'
} else {
    return
}

const options = { constructor: Html5WebSocket };
const rws = new ReconnectingWebSocket('ws//' + wsHost + ':' + wsPort + '/ws', undefined, options);
rws.timeout = 1000;

rws.addEventListener('open', () => {
    console.log('[CLIENT] Connection to WebSocket server was opened.');
    rws.send('Connection Established.');

    setTimeout(function() {
        rws.send(JSON.stringify({ method: 'set-background-color', params: { 'color': 'blue' } }));
    }, 3000);
});

rws.addEventListener('message', (e) => {

    console.log('[Client] Message received: ' + e.data);

    try {
        handleMessage(JSON.parse(e.data));
    } catch (err) {
        console.log('The message is not JSON.');
    }

});

rws.addEventListener('close', () => {
    console.log('[Client] Connection closed.');
});

rws.onerror = (err) => {
    if (err.code === 'EHOSTDOWN') {
        console.log('[Client] Error: Server down.');
    }
};

let handlers = {
    "client-id": function(m) {
        console.log('[Client] Your id is ' + m.params.id);
    },
    'set-background-color': function(m) {
        // Connect your WebSocket client to smartgeometry.herokuapp.com:80 server
        // and go to nono.ma/teach to test this action
        console.log('[Client] Set background color to ' + m.params.color);
    }
};

function handleMessage(m) {

    if (m.method == undefined) {
        return;
    }

    let method = m.method;

    if (method) {

        if (handlers[method]) {
            let handler = handlers[method];
            handler(m);
        } else {
            console.log('No handler found for ' + method + '.');
        }

    }

}